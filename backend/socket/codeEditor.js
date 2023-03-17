const { ACTIONS } = require('../../frontend/src/socket/actionsEditor') // mayhave to change if both frontend and backend are deployed on different servers
const {ChangeSet, Text} = require("@codemirror/state")
const {cppBoilerPlate} = require('../utils/boilerPlate.utils')

rooms = {};

const codeEditorListeners =  (socket,io) =>{
    socket.on(ACTIONS.FETCH,({roomId})=>{
        if(!rooms[roomId]){
            rooms[roomId]={
                doc:(Text.of([cppBoilerPlate])),
                updates:[],
            };
        }
        socket.emit(ACTIONS.PULL,{version:rooms[roomId].updates.length,code:rooms[roomId].doc.toString()})
    })

    socket.on(ACTIONS.PUSH,({version,roomId,newUpdates})=>{
        if(!rooms[roomId])return console.warn("Invalid Websocket Request : Invalid Roomid");
        if (rooms[roomId].updates.length != version) return;
        for (let update of newUpdates){
            let changes = ChangeSet.fromJSON(update.changes)
            rooms[roomId].updates.push({changes,clientID:update.clientID})
            rooms[roomId].doc = changes.apply(rooms[roomId].doc)
        }
        io.to(roomId).emit(ACTIONS.SYNC,{newVersion:rooms[roomId].updates.length, updates:rooms[roomId].updates})

    })
}

module.exports = codeEditorListeners