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
        origin: ["https://letschatnow.vercel.app", "http://letschatnow.vercel.app"],
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("login", (data) => {
    if(data.username.length <= 15)
    {
        if(data.username.trim() !== '')
        {
            if(users.some((user) => user.username.toLowerCase().trim() === data.username.toLowerCase().trim()))
            {
                socket.emit("loginError", "Username already exists");
            }
            else{
                socket.emit("loginSuccess", data.username, data.socketId);
                users.push({socketID: data.socketId, username: data.username});
                setTimeout(() => {
                    io.emit("updateUsers", users);
                }, 100);
                console.log(users);
            }
        }
        else{
            socket.emit("loginError", "Field cannot be empty");
        }
    }
    else{
        socket.emit("loginError", "Maximum 15 character");
    }
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        users = users.filter(user => user.socketID !== socket.id);
        io.emit("updateUsers", users);
        io.emit("userDisconnect", {socketID: socket.id});
    });


    socket.on("sendMessage", (data) => {
        io.to(data.to).emit('privateMessage', {from: socket.id, message: data.message, username: data.username})
    });

    socket.on("typeing", (data) => {
        io.to(data.to).emit('typeing', {from: socket.id});
    })

    socket.on("stopTypeing", (data) => {
        io.to(data.to).emit('stopTypeing', {from: socket.id});
    })
})


const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log("Server is running");
})