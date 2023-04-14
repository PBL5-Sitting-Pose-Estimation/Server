const express = require('express')
const Profile = require('../model/Profile')


const router = express.Router()

router.get('/', async(req, res) => {
    try {
        const newProfile = new Profile({
            
        })
        await newProfile.save()
        return res.status(200).json({
            success: true
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err
        })
    }
})

module.exports = router