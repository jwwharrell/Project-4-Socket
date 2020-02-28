const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index.js");

const app = express();

app.use(function (req, res, next) {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(index);


const server = http.createServer(app);

const io = socketIo(server);

const currentUsers = []

io.on("connection", socket => {
    console.log("New client connected")
    socket.on('newUser', name => {
        console.log(`${name} has joined the jam! With ID: ${socket.id}`)
        currentUsers.push({userName: name, userId: socket.id})
        console.log(currentUsers)
        socket.broadcast.emit('newUser', currentUsers)
    })
    socket.on('note', data => {
        console.log('new note played', data)
        socket.broadcast.emit('note', data)
    })
    socket.on("disconnect", () => {
        console.log("Client disconnected")
        for (let i = 0; i < currentUsers.length; i++) {
            if (socket.id === currentUsers[i].userId) {
                console.log(`${currentUsers[i].userName} has left the jam!`)
                currentUsers.splice(i, 1)
            }
        }
        console.log(socket.id)
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

