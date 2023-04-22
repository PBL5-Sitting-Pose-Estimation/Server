const express = require('express')
const fs = require('fs')
const stream = require('stream')

const router = express.Router()

router.get("/", async(req, res) => {
    try {
        const r = fs.createReadStream('./img/tmp/temp.jpg')
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
    } catch(err) {}
})

module.exports = router