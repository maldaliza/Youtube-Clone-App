const express = require('express');
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");


//=================================
//             Subscribe
//=================================


// 구독자 수의 정보를 가져오는 라우터
router.post('/subscribeNumber', (req, res) => {
    Subscriber.find({ 'userTo': req.body.userTo })
    .exec((err, subscribe) => {         // subscribe에는 userTo를 구성하는 모든 케이스가 들어있다.
        if(err) return res.status(400).send(err);
        return res.status(200).json({ success: true, subscribeNumber: subscribe.length });
    });
});

// 해당 비디오를 업로드한 유저를 구독하는지에 대한 정보를 가져오는 라우터
router.post('/subscribed', (req, res) => {
    Subscriber.find({ 'userTo': req.body.userTo, 'userFrom': req.body.userFrom })
    .exec((err, subscribe) => {
        if(err) return res.status(400).send(err);
        
        let result = false;
        if(subscribe.length !== 0) {
            result = true;
        }
        res.status(200).json({ success: true, subscribed: result });
    });
});

// 구독 o => 구독 x
router.post('/unSubscribe', (req, res) => {
    Subscriber.findOneAndDelete({ userTo: req.body.userTo, userFrom: req.body.userFrom })
    .exec((err, doc) => {
        if(err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true, doc });
    });
});

// 구독 x => 구독 o
router.post('/subscribe', (req, res) => {

    // DB에 userTo, userFrom을 저장해야한다.
    const subscribe = new Subscriber(req.body);

    subscribe.save((err, doc) => {
        if(err) return res.json({ success: false, err });
        res.status(200).json({ success: true });
    });
});


module.exports = router;