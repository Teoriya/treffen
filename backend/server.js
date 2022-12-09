require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const userRouter = require('./routes/user.routes');
const cors = require('cors');
const dbConnect = require('./utils/db.utils');
dbConnect();

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json());
app.use( '/users',userRouter);
app.get('/',(req,res)=>{
    res.send("Hello World");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
