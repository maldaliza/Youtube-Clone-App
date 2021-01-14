import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0);
    const [Subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        /*
            DB에서 얼마나 많은 사람들이 
            비디오 업로드 한 유저를 구독하는지
            정보 가져오기
        */
        let variable = { userTo: props.userTo };

        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response => {
                if(response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber);
                } else {
                    alert('구독자 수 정보를 받아오지 못했습니다.');
                }
        });

        /*
            내가 이 비디오 업로드 한 유저를
            구독하는지 정보 가져오기
        */
        let subscribedVariable = { 
            userTo: props.userTo, 
            userFrom: localStorage.getItem('userId')
        };

        Axios.post('/api/subscribe/subscribed', subscribedVariable)
            .then(response => {
                if(response.data.success) {
                    setSubscribed(response.data.subscribed);
                } else {
                    alert('정보를 받아오지 못했습니다.');
                }
        });

    }, []);

    return (
        <div>
            <button
                style={{ 
                    backgroundColor: `${Subscribe ? '#CC0000' : '#AAAAAA'}`, borderRadius: '4px',
                    color: 'white', padding: '10px 16px', 
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                }}
                onClick
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    );
}

export default Subscribe;
