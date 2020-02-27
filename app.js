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

io.on("connection", socket => {
    console.log("New client connected");

    socket.emit('test')
    socket.on('note', (data) => {
        console.log('new note played', data)
        socket.broadcast.emit('note', data)
    })
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

