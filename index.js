const express = require('express')
const cors = require('cors')
const fs = require('fs')
const stream = require('stream')

const app = express()

app.use(cors({
    origin: "*",
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
const imageRouter = require('./router/image.js')
const imageSendRouter = require('./router/sendImg.js')
const historyRouter = require('./router/history.js')

app.use('/api/auth', authRouter)
app.use('/api/profile', profileRouter)
app.use('/api/img', imageRouter)
app.use('/api/getimage', imageSendRouter)
app.use('/api/history', historyRouter)

app.get("/", (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            version: "1.0.2",
            lastUpdate: "10/5/2023"
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            data: {
                message: "Internal Server Error"
            }
        })
    }
})

var currentUser = ""
var queue = []

app.get("/current", (req, res) => {
    try {
        if(currentUser) return res.status(200).json({
            success: true,
            data: {
                currentUser: currentUser
            }
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})

app.get("/test", (req, res) => {
    try {
        return res.status(200).json({
            success: true
        })
    } catch(err) {
        return res.status(500).json({
            success: false
        })
    }
})

app.listen(PORT, () => {
    console.log("server start on " + PORT)
})