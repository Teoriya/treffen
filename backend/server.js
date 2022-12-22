require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.json({limit:"16mb"}));
const port = process.env.PORT || 5000;
const userRouter = require('./routes/user.routes');

app.use('/public',express.static('public'))

const cors = require('cors');
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials:true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const dbConnect = require('./utils/db.utils');
dbConnect();


app.use( '/users',userRouter);
app.get('/',(req,res)=>{
    res.send("Hello World");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
