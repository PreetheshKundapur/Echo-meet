import express from "express";
import{ createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";

import { connectToSocket } from "./controllers/socketManager.js ";
import cors from "cors";
import userRoutes from "./routes/user.route.js ";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", (process.env.PORT || 8000))
app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb",extended:true}));
app.use("/api/v1/users",userRoutes);

const start = async()=>{
    const connectionDB = await mongoose.connect("mongodb+srv://preetheshpk51:echomeet@cluster0.dzxexso.mongodb.net/")
    console.log('Preethesh You connected :${DB.connection.Host}')
    server.listen(app.get("port"),()=>{
        console.log("LISTENIN ON PORT 8000")
    });
}
start();