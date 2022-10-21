const app = require("express")();
const http = require("http").createServer(app);
const express = require("express");
const io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
        transports: ["websocket", "polling"],
        credentials: true,
    },
    allowEIO3: true,
    maxHttpBufferSize: 1e8,
});

var requests = 0;
var current = 0;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client.html");
});

app.get("/hit", (req, res, next) => {
    current += 1;
    requests += 1;
    res.send("Page for incoming HTTP requests.");
    console.log(`[+] request : ${requests}`);
});

io.on("connection", (socket) => {
    if (socket.handshake.headers.token == Math.PI) {
        console.log("Client passed.");
    } else {
        console.log("Client not passed.");
    }
});

setInterval(() => {
    io.emit("packet", requests, current);
}, 60 / 1000);

setInterval(() => {
    current = 0;
}, 1000);

http.listen(8080, () => {
    console.log("Server started.");
});