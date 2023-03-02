const {Schema, model} = require('mongoose');

const RoomSchema = new Schema({
    topic: {
        type: String,
        required: true
    },
    roomType: {
        type: String,
        required: true,
        enum: ['open', 'private','social']
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    speakers: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        required: false,
    },
},
{
    timestamps: true,
});

module.exports = model('Room', RoomSchema, 'rooms');