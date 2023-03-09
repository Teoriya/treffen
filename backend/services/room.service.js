const RoomModel = require('../models/room.model');

class RoomService {
    async createRoom(data) {
        try {       
            const room = await RoomModel.create(data);
            return room;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async fetchRooms(types) {
        if(typeof types === 'string'){
            types = [types];
        }
        try {       
            const rooms = await RoomModel.find({roomType:{$in : types}}).populate({path: 'owner'}).populate({path: 'speakers'});
            // console.log(rooms)
            return rooms;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async getRoomById(id){
        try{
            const room = RoomModel.findById(id).populate({path: 'owner'}).populate({path: 'speakers'});
            return room;
        }
        catch(error){
            console.log(error);
            return null;
        }

    }
}

module.exports = new RoomService();