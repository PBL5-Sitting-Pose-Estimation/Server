const express = require('express')
const History = require('../model/History')
const fs = require('fs')
const stream = require('stream')

const router = express.Router()

router.get('/', async(req, res) => {
    try {
        let histories = await History.find()
        return res.status(200).json({
            success: true,
            data: histories
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})

router.get('/byid/:id', async(req, res) => {
    const { id } = req.params

    if(!id) {
        return res.status(400).json({
            success: false,
            message: "Bad Request"
        })
    }

    try {
        let history = await History.findById(id)

        return res.status(200).json({
            success: true,
            data: history
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})

router.get('/img/:path', async(req, res) => {
    let { path } = req.params

    if(!path) return res.status(400).json({
        success: false,
        message: "bad request"
    })

    const r = fs.createReadStream('./img/history/' + path)
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

module.exports = router