const webRTCListeners = require("./webRTC")
const codeEditorListeners = require("./codeEditor")

module.exports = function (server) {
    const io = require('socket.io')(server, {
        serveClient: false,
        cors: {
            origin: process.env.CORS_ORIGIN,
            methods: ["GET", "POST"],
        }
    })

    io.on('connection', (socket) => {
        webRTCListeners(socket,io);
        codeEditorListeners(socket,io);
    }
    )


}