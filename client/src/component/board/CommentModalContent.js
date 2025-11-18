import React, { useEffect, useState } from "react";
import "../../style/boardModal.css";
import { useSelector } from "react-redux";
import jaxios from "../../util/JWTUtil";

const CommentModalContent = ({ onClose, bidx }) => {
    const loginUser = useSelector(state => state.user);
    const [commentList, setCommentList] = useState([]);
    const [replyOpen, setReplyOpen] = useState({});
    const [replyContent, setReplyContent] = useState("");

    // 대댓글 토글
    const toggleReply = (bcidx) => {
        setReplyOpen(prev => ({ ...prev, [bcidx]: !prev[bcidx] }));
    };

    // 시간 표시
    const timeAgo = (dateString) => {
        const now = new Date();
        const writeDate = new Date(dateString);
        const diff = (now - writeDate) / 1000; // 초
        if (diff < 60) return "방금 전";
        const minutes = Math.floor(diff / 60);
        if (minutes < 60) return `${minutes}분 전`;
        const hours = Math.floor(diff / 3600);
        if (hours < 24) return `${hours}시간 전`;
        const days = Math.floor(diff / 86400);
        if (days < 7) return `${days}일 전`;
        if (days < 30) return `${Math.floor(days / 7)}주 전`;
        if (days < 365) return `${Math.floor(days / 30)}개월 전`;
        return `${Math.floor(days / 365)}년 전`;
    };

    // 좋아요 토글
    const toggleLike = (bcidx, isReply = false, parentIdx = null) => {
        setCommentList(prev => prev.map(comment => {
            if (!isReply && comment.bcidx === bcidx) {
                return { ...comment, likes: comment.likes + 1 };
            }
            if (isReply && comment.bcidx === parentIdx) {
                return {
                    ...comment,
                    replies: comment.replies.map(reply => reply.bcidx === bcidx ? { ...reply, likes: reply.likes + 1 } : reply)
                };
            }
            return comment;
        }));
    };

    // 댓글 리스트 불러오기
    const fetchComments = async () => {
        try {
            const result = await jaxios.get(`/api/board/getReplyList/${bidx}`);
            setCommentList([...result.data.replyList]);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!bidx) return;
        fetchComments();
    }, [bidx]);

    // 댓글 작성
    const addComment = async () => {
        if (!replyContent.trim()) return;

        try {
            await jaxios.post('/api/board/addComment', {
                bidx: bidx,
                midx: loginUser.midx,
                content: replyContent
            });
            setReplyContent(""); // 입력창 초기화
            fetchComments();     // 댓글 리스트 갱신
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="comment-modal-content">
            {/* 헤더 */}
            <div className="modal-header">
                <h3 className="modal-title">댓글</h3>
                <button className="close-button" onClick={onClose}>✖</button>
            </div>

            {/* 댓글 목록 */}
            <div className="modal-comments-list">
                {commentList.map(comment => (
                    <div key={comment.bcidx} className="modal-comment-item">
                        <img className="modal-profile-image" src={comment.member.profileImg} alt="프로필" />
                        <div className="modal-comment-info">
                            <div className="modal-comment-header">
                                <span className="modal-username">{comment.member.nickname}</span>
                                <span className="modal-timestamp">{timeAgo(comment.writedate)}</span>
                            </div>
                            <p className="modal-comment-text">{comment.content}</p>
                            <div className="modal-comment-actions">
                                <button className="modal-icon-button" onClick={() => toggleLike(comment.bcidx)}>👍</button>
                                <span className="modal-likes">{comment.likes}</span>
                                {comment.replies && comment.replies.length > 0 &&
                                    <button className="modal-icon-button" onClick={() => toggleReply(comment.bcidx)}>
                                        {replyOpen[comment.bcidx] ? "대댓글 숨기기" : `대댓글 ${comment.replies.length}개 보기`}
                                    </button>
                                }
                            </div>

                            {/* 대댓글 */}
                            {replyOpen[comment.bcidx] && comment.replies && comment.replies.map(reply => (
                                <div key={reply.bcidx} className="modal-reply-item">
                                    <img className="modal-profile-image" src={reply.member.profileImg} alt="프로필" />
                                    <div className="modal-comment-info">
                                        <div className="modal-comment-header">
                                            <span className="modal-username">{reply.member.nickname}</span>
                                            <span className="modal-timestamp">{timeAgo(reply.writedate)}</span>
                                        </div>
                                        <p className="modal-comment-text">{reply.content}</p>
                                        <div className="modal-comment-actions">
                                            <button className="modal-icon-button" onClick={() => toggleLike(reply.bcidx, true, comment.bcidx)}>👍</button>
                                            <span className="modal-likes">{reply.likes}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* 댓글 입력창 */}
            <div className="modal-comment-input-area">
                <img className="modal-input-profile-image" src="https://via.placeholder.com/30?text=My" alt="프로필"/>
                <input
                    type="text"
                    className="modal-comment-input"
                    placeholder="댓글을 입력하세요"
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                />
                <button className="modal-submit-button" onClick={addComment}>댓글</button>
            </div>
        </div>
    );
};

export default CommentModalContent;
