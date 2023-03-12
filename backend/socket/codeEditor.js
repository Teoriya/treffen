const { ACTIONS } = require('../../frontend/src/socket/actionsEditor') // mayhave to change if both frontend and backend are deployed on different servers
const {ChangeSet, Text} = require("@codemirror/state")
const {cppBoilerPlate} = require('./boilerPlate')

rooms = {};

const codeEditorListeners =  (socket,io) =>{
    socket.on(ACTIONS.FETCH,({roomId})=>{
        if(!rooms[roomId]){
            rooms[roomId]={
                doc:(Text.of(cppBoilerPlate)).toString(),
                updates:[],
            };
        socket.emit(ACTIONS.PULL,{version:rooms[roomId].updates.length,code:rooms[roomId].doc})
        }
    })

    socket.on(ACTIONS.PUSH,({version,roomId,updates})=>{
        if(!rooms[roomId])return console.warn("Invalid Websocket Request : Invalid Roomid");
        if (rooms[roomId].updates.length() != version) return console.warn("New updates can't sync with authority version");
        for (let update of updates){
            let changes = ChangeSet.fromJSON(update.changes)
            updates.push({changes,clientID:update.clientID})
            rooms[roomId].doc = changes.apply(rooms[roomId].doc)
        }
        io.to(roomId).emit(ACTIONS.SYNC,{version:rooms[roomId].updates.length, updates:rooms[roomId].updates})

    })
}

module.exports = codeEditorListeners