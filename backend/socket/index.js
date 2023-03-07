const { ACTIONS } = require('../../frontend/src/socket/actions') // mayhave to change if both frontend and backend are deployed on different servers


module.exports = function (server) {
    const io = require('socket.io')(server, {
        serveClient: false,
        cors: {
            origin: process.env.CORS_ORIGIN,
            methods: ["GET", "POST"],
        }
    })

    const socketUserMap = {} // no support for exisiting connection in case of server restart .. need to use redis or something

    io.on('connection', (socket) => {
        socket.on(ACTIONS.JOIN_ROOM,({roomId,user})=>{
            console.log("asfsda")
            socketUserMap[socket.id] = user;
            const socketClients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            socketClients.forEach(clientId => {
                console.log("asfsda")
                io.to(clientId).emit(ACTIONS.ADD_PEER,{peerId:socket.id,createOffer:false,user})
                socket.emit(ACTIONS.ADD_PEER,{peerId:clientId,createOffer:true,user:socketUserMap[clientId]})
            })
            socket.join(roomId);
        })

        socket.on(ACTIONS.RELAY_ICE,({peerId, icecandidate})=>{
            io.to(peerId).emit(ACTIONS.NEW_ICE_CANDIDATE,{peerId:socket.id,icecandidate})
        })

        socket.on(ACTIONS.RELAY_SDP,({peerId,SDP})=>{
            io.to(peerId).emit(ACTIONS.SDP,{peerId:socket.id,SDP})
        })

        // const leaveRoom = ()=>{
        //     const {rooms} = socket;
        //     Array.from(rooms || []).forEach((roomId)=>{
        //         const clients = Array.from(io.sockets.adapter.rooms.get(roomId)|| [])
        //         clients.forEach(clientId =>{io.to(clientId).emit(ACTIONS.REMOVE_PEER,{peerId:socket.id,userId:socketUserMap[socket.id]._id});
        //         socket.emit(ACTIONS.REMOVE_PEER,{peerId:clientId,userId:socketUserMap[clientId]._id})
        //     })
        //     socket.leave(roomId);
                
        //     }) ;
        //     delete socketUserMap[socket.id]
        // }
        // socket.on(ACTIONS.LEAVE_ROOM,leaveRoom);
        // socket.on('disconnecting',leaveRoom)
    }
    )


}