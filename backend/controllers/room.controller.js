const RoomService = require('../services/room.service');
const RoomDto = require('../dtos/room.dto');

class RoomController{
    async createRoom(req, res){
        const {topic, roomType} = req.body;
        if(!topic || !roomType){
            return res.status(400).json({message: 'All Fields are required'});
        }
        const room = await RoomService.createRoom({topic, roomType , owner:req.user._id,speakers:[req.user._id]});
        res.json(new RoomDto(room));
    }
    async fetchRooms(req, res){
        const rooms = await RoomService.fetchRooms('open');
        res.json(rooms.map(room => new RoomDto(room)));
    }
    async getRoom(req,res){
        const {roomId} = req.params;
        if(!roomId){
            return res.status(400).json({message: 'All Fields are required'});
        }
        const room = await RoomService.getRoomById(roomId)
        res.json(new RoomDto(room));
    }
}

module.exports = new RoomController();