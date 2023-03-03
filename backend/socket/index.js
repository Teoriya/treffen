const { ACTIONS } = require('../../frontend/src/socket/actions') // mayhave to change if both frontend and backend are deployed on different servers


module.exports = function (server) {
    const io = require('socket.io')(server, {
        serveClient: false,
        cors: {
            origin: process.env.CORS_ORIGIN,
            methods: ["GET", "POST"],
        }
    })

    const userSocketMap = {} // no support for exisiting connection in case of server restart .. need to use redis or something

    io.on('connection', (socket) => {
        console.log('New client connected',socket.id)

        socket.on(ACTIONS, ({user}) => {
            console.log(user.name)
        }
        )
        socket.on(ACTIONS.JOIN_ROOM, ({ roomId,user }) => {
            userSocketMap[socket.id] = user;
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            clients.forEach((clientId) => io.to(clientId).emit(ACTIONS.ADD_PEER, { }));
            socket.emit(ACTIONS.ADD_PEER,{ })
            socket.join(roomId);
            
            console.log(io.sockets.adapter.rooms)  //https://socket.io/docs/v4/adapter/ know more about adapters
        })
        socket.on('disconnecting', () => {
           delete userSocketMap[socket.id]
            console.log(io.sockets.adapter.rooms,userSocketMap)
        })
        socket.on('disconnect', () => {
            console.log('Client disconnected',socket.id)
        })
    }
    )

    
}