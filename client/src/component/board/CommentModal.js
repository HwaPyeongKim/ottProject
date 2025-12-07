import React, { useEffect, useState, useRef } from "react";
import "../../style/boardModal.css";
import { useSelector } from "react-redux";
import jaxios from "../../util/JWTUtil";
import axios from "axios";

const CommentModal = ({ onClose, bidx, onCommentAdded  }) => {
    const loginUser = useSelector(state => state.user);
    const modalRef = useRef(null);

    const [commentList, setCommentList] = useState([]);   // 댓글 리스트
    const [replyList, setReplyList] = useState([]);       // 대댓글 리스트
    const [replyOpen, setReplyOpen] = useState({});       // 대댓글 오픈 여부
    const [content, setContent] = useState("");           // 댓글 입력
    const [dropdownOpen, setDropdownOpen] = useState({});
    
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
            const res = await axios.get(`/api/bcomment/getCommentList/${bidx}`);
            let list = res.data.commentList;
            // let list = res.data?.commentList ?? [];

            // 댓글 / 대댓글 분리
            const comments = list.filter(c => c.pcidx === null);  
            const replies = list.filter(c => c.pcidx !== null);

            console.log(res);
            setCommentList(comments);
            setReplyList(replies);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (bidx) fetchComments();
    }, [bidx]);


    //  댓글 작성
    async function addComment() {
        if (!loginUser || !loginUser.midx) {
            alert("로그인이 필요합니다.");
            return;
        }
        if (!content.trim()) return;
        await jaxios.post("/api/bcomment/addComment", {boardId: bidx, memberId: loginUser.midx, content})
        .then((result)=>{
            if (result.data.msg !== "ok") {
                alert(result.data.msg); 
                return;
            }

            setContent("");
            fetchComments();
        console.log("onCommentAdded 호출 전"); 
            onCommentAdded && onCommentAdded();
        console.log("onCommentAdded 호출 후");  
        })
        .catch((err)=>{console.error(err)})
    }    

    //  대댓글 작성
    async function addReply(parentIdx, replyText) {
        if (!loginUser || !loginUser.midx) {
            alert("로그인이 필요합니다.");
            return; 
        }
        if (!replyText.trim()) return; // 공백제거

        await jaxios.post("/api/bcomment/addReply", {boardId: bidx, memberId: loginUser.midx, content: replyText, pcidx: parentIdx})
        .then((result) => {
            if (result.data.msg !== "ok") {
                alert(result.data.msg); 
                return;
            }

            fetchComments();   // 작성 후 다시 불러오기
            onCommentAdded && onCommentAdded();
        })
        .catch((err) => {
            console.error(err);
        });
    }

    // 댓글 수정
    async function updateReply(bcidx) {
        const editText = prompt("댓글을 수정하세요:");
        if (!editText) {
            setDropdownOpen(prev => ({...prev, [bcidx]: false})); // 취소 시 드롭다운 닫기
            return;
        }

        try {
            const result = await jaxios.post(`/api/bcomment/updateReply/${bcidx}`, {content: editText})

            if (result.data.msg !== "ok") {
                alert(result.data.msg); 
                return;
            }

            fetchComments();  // 수정 후 댓글 리스트 갱신
        } catch (err) {
            console.error(err);
        } finally {
            setDropdownOpen(prev => ({...prev, [bcidx]: false})); // 수정 완료/실패 후 드롭다운 닫기
        }
    }

    // 댓글 삭제
    async function onDeleteReply(bcidx) {
        if (!window.confirm("정말 삭제하시겠습니까?")) {
            setDropdownOpen(prev => ({...prev, [bcidx]: false})); // 취소 시 드롭다운 닫기
            return;
        }
        try {
            await jaxios.delete(`/api/bcomment/deleteReply/${bcidx}`);
            fetchComments();  // 삭제 후 댓글 리스트 갱신
        } catch (err) {
            console.error(err);
        } finally {
            setDropdownOpen(prev => ({...prev, [bcidx]: false})); // 삭제 완료/실패 후 드롭다운 닫기
        }
    }

    //  대댓글 토글
    const toggleReply = (bcidx) => {
        setReplyOpen(prev => ({
            ...prev,
            [bcidx]: !prev[bcidx]
        }));
    };

    useEffect(() => {
        if (bidx) fetchComments();

        const handleOutsideClick = (event) => {
            // 모든 드롭다운을 닫는 함수
            const closeAllDropdowns = () => {
                setDropdownOpen({});
            };
            
            // 클릭된 요소가 드롭다운 메뉴나 버튼의 일부인지 확인
            let isDropdownElement = false;
            let currentElement = event.target;
            while(currentElement) {
                if (currentElement.classList && (currentElement.classList.contains('reply-dropdown-wrapper') || currentElement.classList.contains('icon-button'))) {
                    isDropdownElement = true;
                    break;
                }
                currentElement = currentElement.parentElement;
            }

            // 클릭된 요소가 드롭다운 관련 요소가 아니라면 모두 닫음
            if (!isDropdownElement) {
                closeAllDropdowns();
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [bidx]);

    return (
        <div className="comment-modal-content" ref={modalRef}>            
            {/* Header */}
            <div className="modal-header"> 
                <h3 className="modal-title1">댓글</h3>
                <button className="close-button" onClick={onClose}>✖</button>
            </div>

            <div className="modal-comments-list">
                {commentList.map(comment => (
                    <div key={comment.bcidx} className="modal-comment-item">

                        <img className="modal-profile-image" 
                             src={comment.memberProfileUrl || "/default.png"} 
                             alt="profile" />

                        <div className="modal-comment-info">
                            <div className="modal-comment-header">
                                <span className="modal-username">{comment.memberNickname}</span>
                                <span className="modal-timestamp">{timeAgo(comment.writedate)}</span>
                                {loginUser && loginUser.nickname && comment.memberNickname === loginUser.nickname && (
                                    <div className="update-button reply-dropdown-wrapper">
                                        <button className="icon-button" 
                                        onClick={() => setDropdownOpen(prev => ({...prev,[comment.bcidx]: !prev[comment.bcidx]}))}> ⁝
                                        </button>
                                        <div className={`dropdown_menu ${dropdownOpen[comment.bcidx] ? 'open' : ''}`}>
                                            <button onClick={() => updateReply(comment.bcidx)}>수정</button>
                                            <button onClick={() => onDeleteReply(comment.bcidx)}>삭제</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <p className="modal-comment-text">
                                {comment.content}
                            </p>

                            <div className="modal-comment-actions">
                                {replyList.filter(r => r.pcidx === comment.bcidx).length > 0 ? (
                                    // 대댓글이 있을 때
                                    <button className="modal-icon-button"
                                        onClick={() => toggleReply(comment.bcidx)}>
                                        💬 대댓글 {replyList.filter(r => r.pcidx === comment.bcidx).length}개
                                    </button>
                                ) : (
                                    // 대댓글이 0개일 때
                                    <button className="modal-icon-button"
                                        onClick={() => toggleReply(comment.bcidx)}>  {/* toggle 사용 */}
                                        댓글작성
                                    </button>
                                )}
                            </div>

                            {/* 대댓글 목록 */}
                            {replyOpen[comment.bcidx] && (
                                <div className="modal-reply-area">

                                    {replyList
                                    .filter(r => r.pcidx === comment.bcidx)
                                    .map(reply => (
                                        <div key={reply.bcidx} className="modal-reply-item">

                                            <img className="modal-profile-image" src={reply.memberProfileUrl || "/default.png"} alt="profile" />

                                            <div className="modal-comment-info">
                                                <div className="modal-comment-header">
                                                    <span className="modal-username">{reply.memberNickname}</span>
                                                    <span className="modal-timestamp">{timeAgo(reply.writedate)}</span>
                                                    {loginUser && loginUser.nickname && reply.memberNickname === loginUser.nickname && (
                                                        <div className="update-button reply-dropdown-wrapper"> {/* wrapper 변경 */}
                                                            <button className="icon-button"
                                                            onClick={() =>setDropdownOpen(prev => ({...prev,[reply.bcidx]: !prev[reply.bcidx],}))}>
                                                            ⁝
                                                            </button>
                                                            <div className={`dropdown_menu ${dropdownOpen[reply.bcidx] ? 'open' : ''}`}>
                                                                <button onClick={() => updateReply(reply.bcidx)}>수정</button>
                                                                <button onClick={() => onDeleteReply(reply.bcidx)}>삭제</button>
                                                            </div>
                                                        </div>
                                                    )}                                                
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
            <button className="modal-submit-button2"
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
