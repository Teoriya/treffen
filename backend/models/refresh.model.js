const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refreshSchema = new Schema(
    {
        token: { type: String, required: true, unique: true },
        userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Refresh', refreshSchema, 'tokens');