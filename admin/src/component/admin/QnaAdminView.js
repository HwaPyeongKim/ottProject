import React, {useState, useEffect} from 'react'
import '../../style/admin.css'
import { useNavigate, useParams } from "react-router-dom";
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
            {qna ? (
                <>
                    <h2 className="admin-title">&nbsp;Q & A [ No.{qna.qidx} ]</h2>

                    <div className="admin-card">

                        {/* 작성자 정보 묶음 */}
                        <div className="writer-info">
                            <div><span className="info-label">이름</span> {qna.member.name}</div>
                            <div><span className="info-label">닉네임</span> {qna.member.nickname}</div>
                            <div><span className="info-label">이메일</span> {qna.member.email}</div>
                        </div>
                        {/* 작성일 */}
                        <div>
                            <div><span className="info-label">작성일시</span> {qna.writedate}</div>
                        </div>
                    </div>
                    <div className="admin-card">

                        {/* 제목 */}
                        <div className="field">
                            <label>제목</label>
                            <span>{qna.title}</span>
                        </div>

                        {/* 내용 */}
                        <div className="field">
                            <label>내용</label>
                            <span className="long-text">{qna.content}</span>
                        </div>

                        {/* 답변 */}
                        <div className="field">
                            <label>답변</label>

                            {qna.reply ? (
                                <span className="reply-complete">{qna.reply}</span>
                            ) : (
                                <div className="reply-box">
                                <textarea
                                    className="admin-textarea reply-textarea"
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                />
                                </div>
                            )}
                        </div>

                        {/* 버튼 */}
                        <div className="btn-area">
                            <button className="admin-btn primary" onClick={writeReply}>
                                    등록
                            </button>
                            <button
                                className="admin-btn secondary"
                                onClick={() => navigate('/qnaList')}
                            >
                                목록으로
                            </button>
                        </div>

                    </div>
                </>
            ) : (
                <>Loading...</>
            )}
        </div>
    );
}

export default QnaAdminView;
