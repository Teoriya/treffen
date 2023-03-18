const { ACTIONS } = require('../../frontend/src/socket/actionsWebRTC') // mayhave to change if both frontend and backend are deployed on different servers

const socketUserMap = {} // no support for exisiting connection in case of server restart .. need to use redis or something

const webRTCListeners =  (socket,io) =>{
    socket.on(ACTIONS.JOIN_ROOM,({roomId,user})=>{
        socketUserMap[socket.id] = user;
        const socketClients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        socketClients.forEach(clientId => {
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

    socket.on(ACTIONS.CLIENT_MUTE,({userId,muteState,roomId})=>{
        io.to(roomId).emit(ACTIONS.CLIENT_MUTE,{userId,muteState})})
        

    const leaveRoom = ()=>{
        const {rooms} = socket;
        Array.from(rooms || []).forEach((roomId)=>{
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId)|| [])
            // console.log(socketUserMap)
            clients.forEach(clientId =>{io.to(clientId).emit(ACTIONS.REMOVE_PEER,{peerId:socket.id,userId:socketUserMap[socket.id]?._id});
            socket.emit(ACTIONS.REMOVE_PEER,{peerId:clientId,userId:socketUserMap[clientId]?._id})
        })
        socket.leave(roomId);
        // console.log((io.sockets.adapter.rooms))
            
        }) ;
        delete socketUserMap[socket.id]
    }
    socket.on(ACTIONS.LEAVE_ROOM,leaveRoom);
    socket.on('disconnecting',leaveRoom)
}

module.exports = webRTCListeners