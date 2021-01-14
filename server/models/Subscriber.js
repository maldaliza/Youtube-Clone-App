const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema({
    userTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, 
    userFrom: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })        // timestamps를 true로 하므로 만든 날짜, 업데이트 날짜가 표시됨.

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber };