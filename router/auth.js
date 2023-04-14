const express = require('express')
const User = require('../model/User')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.post('/register', async(req, res) => {
    const { username, password } = req.body;

    if(!username || !password)
        return res
            .status(400)
            .json({ success: false, message: "missing username or password" });

    try {
        const user = await User.findOne({ username: username });

        if(user)
            return res
                .status(400)
                .json({ success: false, message: "username already taken" })

        const hashedPWD = await argon2.hash(password);
        const newUser = new User({
            username: username,
            password: hashedPWD
        })

        await newUser.save();
        return res.status(200).json({ success: true, message: "user created" })
    } catch(err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
})

router.post('/login', async(req, res) => {
    const { username, password } = req.body;

    if(!username || !password)
        return res
            .status(400)
            .json({ success: false, message: "missing username or password"});

    try {
        const user = await User.findOne({ username });

        if(!user)
            return res
                .status(400)
                .json({ success: false, message: "user not existed" });

        if(await argon2.verify(user.password, password))
            return res.status(200).json({ success: true, message: "authenticated", access_token: jwt.sign(user._id.toString(), 'secret') });
        else
            return res.status(400).json({ success: false, message: "incorrect password" });
    } catch(err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal server error", error: err })
    }
})

module.exports = router