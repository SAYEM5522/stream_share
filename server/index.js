import { config } from 'dotenv';
config();
const connection_url =process.env.connection_url
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import { Server } from 'socket.io';
const PORT=process.env.PORT||8081
const app=express()
app.use(cors())
app.use(bodyParser.json())
const io = new Server(8080, {
  cors: {
    origin: "http://localhost:3000",
    // methods: ["GET", "POST"],
  },
});


mongoose.connect(connection_url,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.connection.once('open',()=>{
  console.log("Connected Successfully")
})

// app.use("/form",FormRouter)

app.listen(PORT,()=>{
  console.log(`Server Started At PORT ${PORT}`)
})
