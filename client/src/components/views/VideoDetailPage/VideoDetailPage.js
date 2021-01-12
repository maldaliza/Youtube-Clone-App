import React, { useEffect, useState } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';

function VideoDetailPage(props) {

    // 비디오의 id를 보낸다. => 그래야 해당하는 비디오를 가져올 수 있다.
    const videoId = props.match.params.videoId;
    const variable = { videoId: videoId };

    const [VideoDetail, setVideoDetail] = useState([]);

    useEffect(() => {

        // Axios로 request를 보낸다.
        Axios.post('/api/video/getVideoDetail', variable)
        .then(response => {
            if(response.data.success) {
                setVideoDetail(response.data.VideoDetail);
            } else {
                alert('비디오 정보 가져오기를 실패했습니다.');
            }
        });

    }, []);

    if(VideoDetail.writer) {        // VideoDetail.writer가 있으면 렌더링
        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>
                    <div style={{ width: '100%', padding: '3rem 4em' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
    
                        <List.Item
                            actions
                        >
                            <List.Item.Meta 
                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
                        </List.Item>
    
                        {/* Comments */}
    
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    Side Videos
                </Col>
            </Row>
        )
    } else {
        return (
            <div>Loading...</div>
        )
    }


    
}

export default VideoDetailPage;