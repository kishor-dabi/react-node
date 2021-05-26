const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require("http")
// app.use(express.json());

const cors = require('cors');
var jwt = require('jsonwebtoken');
require('dotenv').config();
const env = process.env.NODE_ENV || 'local';
const config = require(__dirname + '/server/config/config.json')[env];
const sendResponse = require('./server/services/response.service').response;

const db = require("./server/models");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS
app.use(cors());

app.get('/', (req, res) => {
        return res.send("ok");
    })
    // app.use('/images', express.static('icon-images'));
    // app.use(express.static('icon-images'))
app.use("/icon-images", express.static(__dirname + '/icon-images'));

// ===================================================

const server = http.createServer(app)
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:8000",
		methods: [ "GET", "POST" ]
	}
})


// app.use	("/socket/video", (req, res)=>{
console.log("------------------" , new Date().getTime());
io.on("connection", (socket) => {
    socket.emit("me", socket.id)

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded")
    })

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
    })

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal)
    })
})





//  

app.use((req, res, next) => {
    // if (req.path == '/api/signup' || req.path == '/api/login' || '/api/verify-signup-otp') {
    // console.log(req.path, req.body);
    // next(); 
    // }else 
    if (!req.headers.authorization) {
        if (req.path == '/api/signup' || req.path == '/api/login' || req.path == '/api/verify-signup-otp' || req.path == '/api/forgot-password' || req.path == '/api/resend-otp' || req.path == '/api/verify-otp' || req.path == '/api/reset-password' || req.path == "/api/policy/terms-and-condition" || req.path == "/api/admin/create" || req.path == "/api/admin/login" || req.path == "/api/check-version") {
            next();
        } 
        else if (req.path.indexOf('/icon-images') === 0) {
            next();
        } else {
            return res.status(403).json({ message: 'Header missing!' });
        }
    } else {

        // var decoded = jwt.verify(token, 'shhhhh');
        let token = req.headers.authorization
        token = token ? token.split(" ") : [];
        // console.log(token , "-- token");
        // if (token[0].toLocaleLowerCase() == 'auth') {
            // if (req.path == '/api/signup' || req.path == '/api/login' || req.path == '/api/verify-signup-otp' || req.path == '/api/forgot-password' || req.path == '/api/resend-otp' || req.path == '/api/verify-otp' || req.path == '/api/reset-password' || req.path == "/api/policy/terms-and-condition" || req.path == "/api/admin/create" || req.path == "/api/admin/login" || req.path == "/api/check-version") {
            //     next();
            // } 
        //     else {
        //         return sendResponse(res, 100, false, 'server middleware error.')
        //     }
        // } 
        // else 
        if (token[0].toLocaleLowerCase() == 'bearer' && token[1]) {
            jwt.verify(token[1], config.jwt, async function(err, decoded) {
                console.log(decoded) // bar
                if (decoded) {

                    let userDevice = await db.Token.findOne({
                            where: {
                                user_id: decoded.data.user_id,
                                token: token[1]
                            }
                        })
                        // console.log((userDevice), "--------------------- user device");
                    if (userDevice) {

                        next()
                    } else {
                        return res.status(401).json({ message: 'user token not exist.' });
                    }



                } else {
                    return res.status(401).json({ message: 'Invalid token.' });

                }
            });
        } else {
            return res.status(403).json({ message: 'Unauthorized' });

        }

    }
})

require('./server/routes/v1')(app);

// db.sequelize.sync({ logging: false, }).then(function() {
//     // console.log("-------------------------");
// });

db.sequelize.authenticate().then(() => {
        console.log('Connected to SQL database:', config.database);
    })
    .catch(err => {
        console.error('Unable to connect to SQL database:', config.database, err);
    });

// var moment = require('moment')
// var test = moment().day("Monday").week(2);
// console.log(test);


const PORT = config.server_port || 4000;
server.listen(PORT, () => {
    console.log(`Server is listening to port ${PORT}`)
})