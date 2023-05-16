const mongoose = require('mongoose')
const Schema = mongoose.Schema

const feedbackSchema = new Schema({
    history_id: {
        type: Schema.Types.ObjectId,
        ref: 'history'
    },
    user_label: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('feedback', feedbackSchema)