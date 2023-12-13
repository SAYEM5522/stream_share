import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const Stream = () => {
  const [socket, setSocket] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [accessUser, setAccessUser] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const screenRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const startSharing = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  
      // Attach the stream to the screen element
      screenRef.current.srcObject = stream;
  
      // Emit 'startSharing' event to notify the server
      socket.emit('startSharing');
  
      // Set the state to indicate that sharing has started
      setIsSharing(true);
    } catch (error) {
      console.error('Error accessing screen:', error);
      // Handle errors, e.g., show an error message to the user
    }
  };
  

  const grantAccess = (userId) => {
    // Send a 'grantAccess' event to the server with the target user's ID
    // and emit 'accessGranted' event when access is granted
    setAccessUser(userId);
  };

  const handleMouseMove = (e) => {
    // Track mouse movements and send to the server
    const { clientX, clientY } = e;
    setMousePosition({ x: clientX, y: clientY });
    socket.emit('mouseMove', { x: clientX, y: clientY });
  };

  useEffect(() => {
    // Listen for mouse movements from the access user
    if (socket) {
      socket.on('mouseMove', (position) => {
        // Implement logic to move a cursor or highlight the screen based on the received position
      });
    }

    return () => {
      if (socket) {
        socket.off('mouseMove');
      }
    };
  }, [socket]);

  return (
    <div>
      {isSharing ? (
        <div>
          <div
            ref={screenRef}
            style={{ width: '100%', height: '500px', background: '#eee' }}
            onMouseMove={handleMouseMove}
          >
            {/* Render shared screen here */}
          </div>
          <button onClick={() => grantAccess('userIdToGrantAccess')}>
            Grant Access
          </button>
        </div>
      ) : (
        <button onClick={startSharing}>Start Sharing</button>
      )}
    </div>
  );
};

export default Stream;
