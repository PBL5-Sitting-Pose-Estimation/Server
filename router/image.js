const express = require('express')
const User = require('../model/User')
const jwt = require('jsonwebtoken')

const fs = require('fs')
const stream = require('stream')

const multer = require('multer')
const storageEngine = multer.diskStorage({
    destination: "./img/tmp",
    filename: (req, file, cb) => { cb(null, `${file.originalname}`); },
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
})

module.exports = router