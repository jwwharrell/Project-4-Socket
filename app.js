const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = process.env.PORT || 4001;
const index = require("./routes/index.js");

const app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(index);


const server = http.createServer(app);

const io = socketIo(server);

const getApiAndEmit = async socket => {
    try {
        //Recieve event from the button that was pressed
        //Emit the same event to everyone but the original sender

        //--------------------------------
        // const res = await axios.get(
        //     "https://api.darksky.net/forecast/54d9c9a176d27b6fec0daee17babafac/43.7695,11.2558"
        // );
        // socket.emit("FromAPI", res.data.currently.temperature)
        //--------------------------------        
    } catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

// let interval;

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

