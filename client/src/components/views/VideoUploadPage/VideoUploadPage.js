import React, { useState } from 'react';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

const PrivateOption = [
    { value: 0, label: 'Private' },
    { value: 1, label: 'Public' }
]

const CatogoryOption = [
    { value: 0, label: "Film & Animation" },
    { value: 1, label: "Autos & Vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" }
]

function VideoUploadPage() {

    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Private, setPrivate] = useState(0);      // Private 0, Public 1
    const [Category, setCategory] = useState("Film & Animation");

    const onTitleChange = (event) => {
        setVideoTitle(event.currentTarget.value);
    }

    const onDescriptionChange = (event) => {
        setDescription(event.currentTarget.value);
    }

    const onPrivateChange = (event) => {
        setPrivate(event.currentTarget.value);
    }

    const onCategoryChange = (event) => {
        setCategory(event.currentTarget.value);
    }

    // onDrop function
    const onDrop = (files) => {
        // 서버에 request를 보낼 것 => axios를 이용
        let formData = new FormData;
        const config = {
            header: {'Content-Type': 'multipart/form-data'}
        };
        formData.append("file", files[0]);      // files 파라미터는 업로드할 파일의 정보를 담고있다.

        Axios.post('/api/video/uploadfiles', formData, config)
        .then(response => {
            if(response.data.success) {
                console.log(response.data);
            } else {
                alert('비디오 업로드를 실패했습니다.');
            }
        })
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            {/* Upload Video 타이틀 */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>Upload Video</Title>
            </div>

            {/* 업로드 Form Template */}
            <Form onSubmit>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Drop Zone */}

                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}        // 한번에 업로드를 하나만 할 것이므로 false
                        maxSize={1000000000}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', 
                            alignItems: 'center', justifyContent: 'center' }} {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize: '3rem' }} />
                            </div>
                        )}
                    </Dropzone>

                    {/* Thumbnail */}
                    <div>
                        <img src alt />
                    </div>
                </div>

                <br />
                <br />
                <label>Title</label>
                <Input 
                    onChange={onTitleChange}
                    value={VideoTitle}
                />

                <br />
                <br />
                <label>Description</label>
                <TextArea 
                    onChange={onDescriptionChange}
                    value={Description}
                />

                <br />
                <br />
                <select onChange={onPrivateChange}>
                    {PrivateOption.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>

                <br />
                <br />
                <select onChange={onCategoryChange}>
                    {CatogoryOption.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>

                <br />
                <br />
                <Button type="primary" size="large" onClick>
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default VideoUploadPage;