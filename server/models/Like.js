const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = mongoose.Schema({
    userId: {       // 누가 Like을 눌렀는지
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, 
    commentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }, 
    videoId: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    }
}, { timestamps: true });        // timestamps를 true로 하므로 만든 날짜, 업데이트 날짜가 표시됨.

const Like = mongoose.model('Like', likeSchema);

module.exports = { Like };