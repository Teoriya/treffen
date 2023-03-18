require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.json({ limit: "16mb" }));
app.use('/public', express.static('public'))

const origin = process.env.CORS_ORIGIN.split(',')

const cors = require('cors');
const corsOptions = {
    origin,
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const dbConnect = require('./utils/db.utils');
dbConnect();

const userRouter = require('./routes/user.routes');
const roomRouter = require('./routes/room.routes');
app.use('/users', userRouter);
app.use('/rooms', roomRouter);
app.get('/', (req, res) => {
    res.send("Hello World");
})

try {
    const fs = require('fs')
    let httpsOptions = {
        key: fs.readFileSync('./ssl_certificates/private.key'),
        cert: fs.readFileSync('./ssl_certificates/certificate.crt')
    };
    const sslPort = process.env.PORT || 8443;
    const httpsServer = require('https').createServer(httpsOptions, app)
    require("./socket")(httpsServer);
    httpsServer.listen(sslPort, () => {
        console.log(`HTTPS Server is running on port ${port}`);
    })
} catch (error) {
    console.log("Couldnt find ssl information, running an http server instead.")
    const port = process.env.PORT || 5000;
    const server = require('http').createServer(app);
    require("./socket")(server);
    server.listen(port,() => {
        console.log(`HTTP Server is running on port ${port}`);
    })
}






