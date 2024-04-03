const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

let userCount = 0;

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("test", (data) => {
        console.log(data);
    });
})


server.listen(3001, () => {
    console.log("Server is running");
})