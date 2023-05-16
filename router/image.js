const express = require('express')
const User = require('../model/User')
const History = require('../model/History')
const jwt = require('jsonwebtoken')

const fs = require('fs')
const stream = require('stream')

const multer = require('multer')
const storageEngine = multer.diskStorage({
    destination: "./img/tmp",
    filename: (req, file, cb) => { 
        cb(null, `${file.originalname}`)
    },
});

const upload = multer({ storage: storageEngine })

const router = express.Router()


router.get('/avatar/:token', async(req, res) => {
    const r = fs.createReadStream('./avatar/default_avatar.jpg')
    const ps = new stream.PassThrough()
    stream.pipeline(
        r,
        ps,
        (err) => {
            if(err) {
                console.log(err)
                return res.sendStatus(200);
            }
        })
    ps.pipe(res)
})

router.post('/pose', upload.single('image'), async(req, res) => {
    let { posture, date } = req.body

    let image = req.file

    if(!image) return res.status(400).json({
        success: false,
        message: "Missing context"
    })

    let filename = date.split("-").join('')

    try {
        fs.readFile(image.path, function (err, data) {
            if (err) throw err;
            fs.writeFile('./img/history/' + filename + '.jpg', data, function (err) {
                if (err) throw err;
            });
        });

        const newHistory = new History({
            predict_label: posture,
            detect_date: date,
            path: filename + '.jpg',
        })

        await newHistory.save()

        return res.status(200).json({
            success: true
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})

module.exports = router