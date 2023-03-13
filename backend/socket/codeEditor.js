const { ACTIONS } = require('../../frontend/src/socket/actionsEditor') // mayhave to change if both frontend and backend are deployed on different servers
const {ChangeSet, Text} = require("@codemirror/state")
const {cppBoilerPlate} = require('./boilerPlate')

rooms = {};

const codeEditorListeners =  (socket,io) =>{
    socket.on(ACTIONS.FETCH,({roomId})=>{
        console.log("fetch")

        if(!rooms[roomId]){
            rooms[roomId]={
                doc:(Text.of([cppBoilerPlate])),
                updates:[],
            };
        socket.emit(ACTIONS.PULL,{newVersion:rooms[roomId].updates.length,code:rooms[roomId].doc.toString()})
        }
    })

    socket.on(ACTIONS.PUSH,({version,roomId,newUpdates})=>{
        if(!rooms[roomId])return console.log("Invalid Websocket Request : Invalid Roomid");
        if (rooms[roomId].updates.length != version) return console.warn("New updates can't sync with authority version");
        for (let update of newUpdates){
            let changes = ChangeSet.fromJSON(update.changes)
            rooms[roomId].updates.push({changes,clientID:update.clientID})
            rooms[roomId].doc = changes.apply(rooms[roomId].doc)
        }
        io.to(roomId).emit(ACTIONS.SYNC,{newVersion:rooms[roomId].updates.length, updates:rooms[roomId].updates})

    })
}

module.exports = codeEditorListeners