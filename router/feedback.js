const express = require('express')
const FeedBack = require('../model/FeedBack')
const History = require('../model/History')

const router = express.Router()

router.post("/", async(req, res) => {
    const { id, user_label } = req.body

    if(!id || !user_label){
        return res.status(400).json({
            success: false,
            message: "Bad Request"
        })
    }

    try{
        let history = await History.findById(id)

        history.got_feedback = true
        history.user_label = user_label
        
        const fb = new FeedBack({
            history_id: id,
            user_label: user_label
        })

        await history.save()
        await fb.save()

        return res.status(200).json({
            success: true,
            message: "feedback saved"
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})

module.exports = router