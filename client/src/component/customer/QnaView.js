import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import jaxios from '../../util/JWTUtil'
import axios from 'axios';
import "../../style/qna.css";

function QnaView() {
    const [qna, setQna] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [password, setPassword] = useState("");
    const [tempQna, setTempQna] = useState(null);

    const { qidx } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let result = await axios.get('/api/admin/getQna', { params: { qidx } });

                if (result.data.qna.security === 'Y') {
                    setTempQna(result.data.qna);
                    setShowModal(true);
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

    const handlePasswordCheck = async () => {
        try {
            let res = await axios.post(
                '/api/admin/confirmPass',
                null,
                { params: { qidx, pass: password } }
            );

            if (res.data.msg === 'ok') {
                setQna(tempQna);
                setShowModal(false);
            } else {
                alert('패스워드가 일치하지 않습니다');
                navigate('/qna');
            }
        } catch (error) {
            console.error(error);
            alert('오류가 발생했습니다.');
            navigate('/qna');
        }
    };

    return (
        <article>
            <div className="main-container">

                {/* 🔐 비밀번호 입력 모달 */}
                {showModal && (
                    <div className="modal-backdrop">
                        <div className="modal-box">
                            <h3>비공개 글입니다</h3>
                            <p>비밀번호를 입력하세요.</p>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="modal-input"
                                placeholder="비밀번호 입력"
                            />
                            <div className="modal-btns">
                                <button className="btn btn-primary" onClick={handlePasswordCheck}>
                                    확인
                                </button>
                                <button className="btn btn-secondary" onClick={() => navigate('/qna')}>
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
