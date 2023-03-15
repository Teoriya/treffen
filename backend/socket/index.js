const webRTCListeners = require("./webRTC")
const codeEditorListeners = require("./codeEditor")

const origin = process.env.CORS_ORIGIN.split(',')

module.exports = function (server) {
    const io = require('socket.io')(server, {
        serveClient: false,
        cors: {
            origin,
            methods: ["GET", "POST"],
        }
    })

    io.on('connection', (socket) => {
        webRTCListeners(socket,io);
        codeEditorListeners(socket,io);
    }
    )


}