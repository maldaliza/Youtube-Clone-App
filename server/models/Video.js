const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    writer: {
        // User 모델의 모든 정보를 불러올 수 있다.
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, 
    title: {
        type: String,
        maxlength: 50
    }, 
    description: {
        type: String
    }, 
    privacy: {
        type: Number
    }, 
    category: {
        type: String
    }, 
    views: {        // 조회수
        type: Number,
        default: 0
    }, 
    duration: {
        type: String
    }, 
    thumbnail: {
        type: String
    }
}, { timestamps: true })        // timestamps를 true로 하므로 만든 날짜, 업데이트 날짜가 표시됨.

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video };