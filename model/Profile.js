const mongoose = require('mongoose')
const Schema = mongoose.Schema

const profileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    displayName: {
        type: String,
    }
})

module.exports = mongoose.model('profile', profileSchema)