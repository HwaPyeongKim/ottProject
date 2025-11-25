import React, {useState, useEffect} from 'react'
import '../../style/admin.css'
import { useNavigate, useParams } from "react-router-dom";
import SubMenu from '../Submenu';
import jaxios from '../../util/JWTUtil';

function QnaAdminView() {
    const [qna, setQna] = useState();
    const [reply, setReply] = useState("");
    const navigate = useNavigate();
    const { qidx } = useParams();

    useEffect(() => {
        jaxios.get('/api/admin/getQna', { params: { qidx } })
            .then((result) => setQna(result.data.qna))
            .catch((err) => console.error(err));
    }, []);

    async function writeReply() {
        await jaxios.post('/api/admin/writeReply', null, { params: { reply, qidx } });
        const result = await jaxios.get('/api/admin/getQna', { params: { qidx } });
        setQna(result.data.qna);
        setReply("");
    }

    return (
        <div className="admin-container">
            <h2 className="admin-title">QnA 상세 보기</h2>

            {qna ? (
                <div className="admin-card">

                    {/* 필드 영역 */}
                    <div className="field">
                        <label>번호</label>
                        <span>{qna.qidx}</span>
                    </div>

                    <div className="field">
                        <label>제목</label>
                        <span>{qna.title}</span>
                    </div>

                    <div className="field">
                        <label>작성자</label>
                        <span>{qna.member.nickname}</span>
                    </div>

                    <div className="field">
                        <label>이메일</label>
                        <span>{qna.member.email}</span>
                    </div>

                    <div className="field">
                        <label>내용</label>
                        <span className="long-text">{qna.content}</span>
                    </div>

                    <div className="field">
                        <label>작성일시</label>
                        <span>{(qna.writedate + "").substring(0, 10)}</span>
                    </div>

                    <div className="field">
                        <label>답변</label>

                        {qna.reply ? (
                            <span className="reply-complete">{qna.reply}</span>
                        ) : (
                            <div className="reply-box">
                                <input
                                    className="admin-input"
                                    type="text"
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                />
                                <button
                                    className="admin-btn primary"
                                    onClick={writeReply}
                                >
                                    등록
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 버튼 영역 */}
                    <div className="btn-area">
                        <button
                            className="admin-btn secondary"
                            onClick={() => navigate('/qnaList')}
                        >
                            목록으로
                        </button>
                    </div>

                </div>
            ) : (
                <>Loading...</>
            )}
        </div>
    );
}

export default QnaAdminView;
