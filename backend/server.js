require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.json({limit:"16mb"}));
const port = process.env.PORT || 5000;
const server = require('http').createServer(app);


app.use('/public',express.static('public'))

const origin = process.env.CORS_ORIGIN.split(',')

const cors = require('cors');
const corsOptions = {
    origin,
    credentials:true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const dbConnect = require('./utils/db.utils');
dbConnect();

const userRouter = require('./routes/user.routes');
const roomRouter = require('./routes/room.routes');
app.use( '/users',userRouter);
app.use( '/rooms',roomRouter);
app.get('/',(req,res)=>{
    res.send("Hello World");
})

require("./socket")(server);
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
