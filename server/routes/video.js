const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');

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

// 클라이언트에서 보낸 onSubmit 함수의 request가 index.js를 통해서 오므로 /api/video는 생략
router.post('/uploadVideo', (req, res) => {
    // 비디오 정보들을 mongoDB에 저장한다.

    // 클라이언트에서 보낸 variable 모든 정보들이 req.body에 담겨있다.
    const video = new Video(req.body);

    // 정보들을 mongoose의 메소드를 이용해서 저장
    video.save((err, doc) => {
        if(err) return res.json({ success: false, err });
        res.status(200).json({ success: true });
    });
});

// 랜딩페이지에서 보낸 Axios를 받는 라우터
router.get('/getVideos', (req, res) => {
    // 비디오를 DB에서 가져와서 클라이언트에 보낸다.

    Video.find()
    .populate('writer')     // populate를 해줘야 Video 모델에서 모든 정보들을 가져올 수 있다.
    .exec((err, videos) => {
        if(err) return res.status(400).send(err);
        res.status(200).json({ success: true, videos });
    });
});

// 해당하는 비디오를 찾아 비디오 디테일 페이지에 보여주는 라우터
router.get('/getVideoDetail', (req, res) => {
    Video.findOne({ "_id": req.body.videoId })
    .populate('writer')
    .exec((err, VideoDetail) => {
        if(err) return res.status(400).send(err);
        return res.status(200).json({ success: true, VideoDetail });
    })
});

router.post('/thumbnail', (req, res) => {
    // 썸네일 생성하고 비디오 러닝타임(정보)도 가져오기

    let filePath = "";
    let fileDuration = "";
    
    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function(err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);
        
        fileDuration = metadata.format.duration;
    });

    // 썸네일 생성
    ffmpeg(req.body.url)        // req.body.url은 client에서 온 비디오 저장 경로

    // 비디오 썸네일 파일이름 생성
    .on('filenames', function(filenames) {
        console.log('Will generate ' + filenames.join(', '));
        console.log(filenames);

        filePath = "uploads/thumbnails/" + filenames[0];
    })

    // 썸네일 생성 후 무엇을 할 것인지
    .on('end', function() {
        console.log('Screenshots taken');
        return res.json({
            success: true,
            url: filePath,
            fileDuration: fileDuration
        });
    })

    // 에러처리
    .on('error', function(err) {
        console.error(err);
        return res.json({
            success: false,
            err
        });
    })

    .screenshots({
        count: 3,       // 3개의 썸네일을 찍을 수 있다
        folder: 'uploads/thumbnails',
        size: '320x240',
        filename: 'thumbnail-%b.png'
    });
});

module.exports = router;