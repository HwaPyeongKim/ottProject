import React, { useEffect, useState } from "react";
import "../../style/boardModal.css";
import { useSelector } from "react-redux";
import jaxios from "../../util/JWTUtil";

const CommentModal = ({ onClose, bidx }) => {
    const loginUser = useSelector(state => state.user);

    const [commentList, setCommentList] = useState([]);   // 댓글 전체 리스트
    const [replyOpen, setReplyOpen] = useState({});       // 대댓글 오픈 여부
    const [content, setContent] = useState("");           // 댓글 입력

    //-----------------------
    //  시간 표시
    //-----------------------
    const timeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diff = (now - date) / 1000;

        if (diff < 60) return "방금 전";
        const minutes = Math.floor(diff / 60);
        if (minutes < 60) return `${minutes}분 전`;
        const hours = Math.floor(diff / 3600);
        if (hours < 24) return `${hours}시간 전`;
        const days = Math.floor(diff / 86400);
        if (days < 7) return `${days}일 전`;
        if (days < 30) return `${Math.floor(days / 7)}주 전`;
        return `${Math.floor(days / 30)}개월 전`;
    };


    //-----------------------
    //  댓글 리스트 가져오기
    //-----------------------

    async function fetchComments(){
        try {
            const res = await jaxios.get(`/api/bcomment/getCommentList/${bidx}`);
            console.log(res);
            // console.log("서버 응답:", res.data);
            setCommentList(res.data.commentList);   // 서버에서 대댓글로 묶어서 보내주는 것을 추천
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (bidx) fetchComments();
    }, [bidx]);


    //-----------------------
    //  댓글 작성
    //-----------------------
    async function addComment() {
        if (!content.trim()) return;

        await jaxios.post("/api/bcomment/addComment", {board: {bidx}, member: {midx: loginUser.midx}, content, pcidx: null})
        .then((result)=>{
            setContent("");
            fetchComments();
        })
        .catch((err)=>{console.error(err)})
    }    


    //-----------------------
    //  대댓글 작성
    //-----------------------
    const addReply = async (parentIdx, replyText) => {
        if (!replyText.trim()) return;

        try {
            await jaxios.post("/api/bcomment", {
                bidx,
                midx: loginUser.midx,
                content: replyText,
                pcidx: parentIdx
            });

            fetchComments();

        } catch (err) {
            console.error(err);
        }
    };


    //-----------------------
    //  대댓글 토글
    //-----------------------
    const toggleReply = (bcidx) => {
        setReplyOpen(prev => ({
            ...prev,
            [bcidx]: !prev[bcidx]
        }));
    };


    return (
        <div className="comment-modal-content">
            
            {/* Header */}
            <div className="modal-header">
                <h3 className="modal-title">댓글</h3>
                <button className="close-button" onClick={onClose}>✖</button>
            </div>

            {/* 댓글 리스트 */}
            <div className="modal-comments-list">
                {commentList.map(comment => (
                    <div key={comment.bcidx} className="modal-comment-item">

                        {/* 프로필 */}
                        <img className="modal-profile-image" 
                             src={comment.member?.profileimgUrl || "/default.png"} 
                             alt="profile" />

                        <div className="modal-comment-info">

                            <div className="modal-comment-header">
                                <span className="modal-username">{comment.member?.nickname}</span>
                                <span className="modal-timestamp">{timeAgo(comment.writedate)}</span>
                            </div>

                            <p className="modal-comment-text">
                                {comment.content}
                            </p>


                            <div className="modal-comment-actions">
                                <button className="modal-icon-button"
                                    onClick={() => toggleReply(comment.bcidx)}>
                                    💬 대댓글
                                </button>

                                {comment.replies?.length > 0 && (
                                    <button className="modal-icon-button"
                                            onClick={() => toggleReply(comment.bcidx)}>
                                        {replyOpen[comment.bcidx]
                                            ? "숨기기"
                                            : `대댓글 ${comment.replies.length}개`}
                                    </button>
                                )}
                            </div>


                            {/* 대댓글 목록 */}
                            {replyOpen[comment.bcidx] && (
                                <div className="modal-reply-area">

                                    {comment.replies?.map(reply => (
                                        <div key={reply.bcidx} className="modal-reply-item">
                                            
                                            <img className="modal-profile-image"
                                                 src={reply.member?.profileimgUrl || "/default.png"}
                                                 alt="profile" />

                                            <div className="modal-comment-info">

                                                <div className="modal-comment-header">
                                                    <span className="modal-username">{reply.member?.nickname}</span>
                                                    <span className="modal-timestamp">{timeAgo(reply.writedate)}</span>
                                                </div>

                                                <p className="modal-comment-text">{reply.content}</p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* 대댓글 입력 */}
                                    <ReplyInput
                                        parentIdx={comment.bcidx}
                                        onSubmit={addReply}
                                    />

                                </div>
                            )}

                        </div>
                    </div>
                ))}
            </div>

            {/* 댓글 입력 */}
            <div className="modal-comment-input-area">
                <input
                    type="text"
                    className="modal-comment-input"
                    placeholder="댓글을 입력하세요"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />
                <button className="modal-submit-button" onClick={addComment}>등록</button>
            </div>

        </div>
    );
};


//-------------------------------
// 대댓글 입력 전용 컴포넌트
//-------------------------------
const ReplyInput = ({ parentIdx, onSubmit }) => {

    const [text, setText] = useState("");

    return (
        <div className="modal-reply-input">
            <input
                type="text"
                className="modal-comment-input"
                placeholder="대댓글을 입력하세요"
                value={text}
                onChange={e => setText(e.target.value)}
            />
            <button className="modal-submit-button"
                    onClick={() => {
                        onSubmit(parentIdx, text);
                        setText("");
                    }}>
                등록
            </button>
        </div>
    );
};


export default CommentModal;
