const express = require('express');
const router = express.Router();
// const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require('multer');

// Multer로 서버에 비디오 저장하기
let storage = multer.diskStorage({
    // 어디에 파일을 저장할지 결정
    destination: (req, file, cb) => {
        cb(null, 'uploads/');       // uploads 디렉토리에 저장
    },

    // 파일 저장시, 어떤 이름으로 저장할지 결정
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },

    // 파일 필터 기능 구현
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        // 파일 확장자 mp4만 가능
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true);
    }
});

const upload = multer({ storage: storage }).single("file");


//=================================
//             Video
//=================================


// 클라이언트에서 보낸 request가 index.js를 통해서 오므로 /api/video는 생략
router.post('/uploadfiles', (req, res) => {
    // req를 통해 비디오 파일을 받는다.
    // 비디오를 서버에 저장한다.
    upload(req, res, err => {
        if(err) {
            return res.json({ success: false, err });
        }
        return res.json({ 
            success: true, 
            url: res.req.file.path,         // 클라이언트에게 파일 저장 위치경로를 보내줌
            fileName: res.req.file.filename
        });
    });
});

module.exports = router;