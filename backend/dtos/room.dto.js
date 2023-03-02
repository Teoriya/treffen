const userDto = require('./user.dto');

class RoomDto {
    id;
    topic;
    ownerId;
    speakers;
    roomType;
    createdAt;
  constructor(room) {
    try {
      if(room.owner.phone){
        this.owner = new userDto(room.owner,true);
    }
    if(room.speakers){
        this.speakers = room.speakers.map(speaker => new userDto(speaker,true));
    }
    this.id = room._id;
    this.topic = room.topic;
    this.ownerId = room.ownerId;
    this.roomType = room.roomType; 
    this.createdAt = room.createdAt;
    } catch (error) {
      console.log(error);
    }

  }
}

module.exports = RoomDto;