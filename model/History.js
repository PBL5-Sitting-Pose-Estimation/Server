const mongoose = require('mongoose')
const Schema = mongoose.Schema

const historySchema = new Schema({
    predict_label: {
        type: String
    },
    detect_date: {
        type: String
    },
    path: {
        type: String,
        require: true
    },
    got_feedback: {
        type: Boolean,
        default: false
    },
    user_label: {
        type: String,
        default: ""
    }
})

module.exports = mongoose.model('history', historySchema)