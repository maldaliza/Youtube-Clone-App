import React, { useEffect, useState } from 'react'
import { Card, Avatar, Col, Typography, Row } from 'antd';
import Axios from 'axios';
import moment from 'moment';

const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage() {

    const [Video, setVideo] = useState([]);

    // mongoDB에서 Video 데이터들을 가져온다.
    useEffect(() => {

        const subscriptionVariables = {
            // 본인의 아이디로 구독하는 사람들을 찾을 수 있고, 비디오를 찾을 수 있다.
            userFrom: localStorage.getItem('userId')
        };

        Axios.post('/api/video/getSubscriptionVideos', subscriptionVariables)     // 조건을 가지고 비디오들을 선별해서 가져와야한다.
        .then(response => {
            if(response.data.success) {
                console.log(response.data);
                setVideo(response.data.videos);
            } else {
                alert('비디오 가져오기를 실패했습니다.');
            }
        });
    }, []);

    const renderCards = Video.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);

        return (
            <Col lg={6} md={8} xs={24}>
                <div style={{ position: 'relative' }}>
                    <a href={`/video/${video._id}`}>
                        <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} />
                        <div className="duration">
                            <span>{minutes} : {seconds}</span>
                        </div>
                    </a>
                </div>
                <br />
                <Meta 
                    avatar={
                        <Avatar src={video.writer.image} />
                    }
                    title={video.title}
                    description=""
                />
                <span>{video.writer.name}</span><br />
                <span style={{ marginLeft: '3rem' }}>{video.views}</span>
                - <span>{moment(video.createdAt).format("MMM Do YY")}</span>
            </Col>
        );
    });

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2}> Recommended </Title>
                <br />
                <Row gutter={[32, 16]}>
                    {renderCards}
                </Row>
        </div>
    );
}

export default SubscriptionPage;
