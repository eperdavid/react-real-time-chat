const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);

let users = [];

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("login", (data) => {
        if(users.some((user) => user.username.toLowerCase() === data.username.toLowerCase()))
        {
            console.log("loginError");  
        }
        else{
            socket.emit("loginSuccess", data.username);
            users.push({socketID: data.socketId, username: data.username});
            setTimeout(() => {
                io.emit("updateUsers", users);
            }, 100);
            console.log(users);
        }
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        users = users.filter(user => user.socketID !== socket.id);
        io.emit("updateUsers", users);
    });
})



server.listen(3001, () => {
    console.log("Server is running");
})