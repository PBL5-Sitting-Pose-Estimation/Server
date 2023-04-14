const express = require('express')
const cors = require('cors')
const fs = require('fs')
const stream = require('stream')
const multer = require('multer')
const storageEngine = multer.diskStorage({
    destination: "./img/test",
    filename: (req, file, cb) => { cb(null, `${Date.now()}--${file.originalname}`); },
});

const upload = multer({ storage: storageEngine })

const app = express()

app.use(cors({
    origin: "*"
}))

app.use(express.json())

const { MONGO_DB_CONNECTION_STRING, PORT } = require('./utils/constants.js')
const mongoose = require('mongoose')
const DB_connect = async() => {
    try {
        await mongoose.connect(MONGO_DB_CONNECTION_STRING);
        console.log("DB connected");
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
}
DB_connect()

const authRouter = require('./router/auth.js')
const profileRouter = require('./router/profile.js')

app.use('/api/auth', authRouter)
app.use('/api/profile', profileRouter)

app.get("/", async(req, res) => {
    const r = fs.createReadStream('./img/1.png')
    const ps = new stream.PassThrough()
    stream.pipeline(
        r,
        ps,
        (err) => {
            if(err) {
                console.log(err)
                return res.sendStatus(400);
            }
        })
    ps.pipe(res)
})

app.post('/test', upload.single('image'), (req, res) => {

    var image = req.body

    if(!image) return res.status(400).json({
        success: false,
        message: "Missing context"
    })

    try {
        fs.writeFile('test.png', image, function(err) {
            if(err) throw err
            console.log('File saved.');
        });
        return res.status(200).json({
            success: true
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
});

app.listen(PORT, () => {
    console.log("server start on " + PORT)
})