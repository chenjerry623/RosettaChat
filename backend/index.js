const express = require('express');

const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io'); 
const { Configuration, OpenAIApi } = require("openai");
const Handler = require('./handler');

// initialize Express
const app = express();

// load environment variables
require('dotenv').config();

app.use(cors()); 

// initialize HTTP server
const server = http.createServer(app);

// initialize IO server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

// initialize OpenAI
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// initialize Handler
let handler = new Handler(io, openai);

io.on('connection', (socket) => {

    console.log(`User connected ${socket.id}`);

    socket.on('join_room', (data) => {
        handler.handleJoinRoom(socket, data);
    });

    socket.on('send_message', async (data) => {

        await handler.handleSendMessage(data);
    });

    socket.on('leave_room', (data) => {

        handler.handleLeaveRoom(socket, data);
    });

    socket.on('disconnect', () => {

        handler.handleDisconnect(socket);
    });

});

server.listen(4000, () => 'Server is running on port 4000');