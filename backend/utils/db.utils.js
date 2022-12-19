const mongoose = require('mongoose');

function dbConnect() {
    mongoose.set('strictQuery', false); // idk what this does ....research about strictQuery ...change this to trueif something breaks down :P
    mongoose.connect(process.env.MONGO_URI)

    const db= mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open',() =>{
        console.log("Connected to MongoDB");
    });
}

module.exports = dbConnect;