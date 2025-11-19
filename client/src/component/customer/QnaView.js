import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import jaxios from '../../util/JWTUtil'
import "../../style/qna.css";

function QnaView() {
    const [qna, setQna] = useState(null)
    const { qidx } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let result = await jaxios.get('/api/admin/getQna', { params: { qidx } });
                if (result.data.qna.security === 'Y') {
                    let pass = window.prompt('패스워드를 입력하세요');
                    let res = await jaxios.post('/api/admin/confirmPass', null, { params: { qidx, pass } });
                    if (res.data.msg === 'ok') {
                        setQna(result.data.qna);
                    } else {
                        alert('패스워드가 일치하지 않습니다');
                        navigate('/qna');
                    }
                } else {
                    setQna(result.data.qna);
                }
            } catch (error) {
                console.error(error);
                alert('데이터를 불러오지 못했습니다.');
                navigate('/qna');
            }
        };
        fetchData();
    }, [qidx, navigate]);

    return (
        <article>
            <div className="main-container">
                {qna ? (
                <div className="qna-view-card">
                    <div className="qna-view-header">
                    <h2 className="qna-view-title">{qna.title}</h2>
                    <div className="qna-view-info">
                        작성자: {qna.member.nickname} | 작성일: {qna.writedate}
                    </div>
                    </div>
                    <div className="qna-view-body">{qna.content}</div>
                    {qna.reply && (
                    <div className="qna-reply-box">
                        <h4>답변</h4>
                        <p>{qna.reply}</p>
                    </div>
                    )}
                    <div className="qna-btns">
                    <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                        목록으로
                    </button>
                    </div>
                </div>
                ) : (
                <div className="no-data">Loading...</div>
                )}
            </div>
        </article>

    );
}

export default QnaView;
