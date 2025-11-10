import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'

import CommentModalContent from './CommentModalContent';

Modal.setAppElement('#root');

function Board(props) {

    useEffect(
        ()=> {
            console.log("Board props:", props);
            console.log("board data:", props.board);
        }, []
    )
    const [isOpen, setIsOpen] = useState(false);

    const customStyles = {
        overlay: { backgroundColor: "rgba( 0 , 0 , 0 , 0.5)", zIndex: 1000 },
        content: {
            left: "50%",
            top: "50%", 
            transform: "translate(-50%, -50%)", 
            margin: "0", 
            width: "700px",
            height: "600px",
            padding: "0",
            overflow: "hidden", 
            zIndex: 1001,
            borderRadius: "35px",
            border: "none", 
        },
    };

    function timeAgo(dateString) {
        const now = new Date();
        const writeDate = new Date(dateString);
        const diff = (now - writeDate) / 1000; // 초 단위 차이

        const minutes = Math.floor(diff / 60);
        const hours = Math.floor(diff / 3600);
        const days = Math.floor(diff / 86400);

        if (diff < 60) return "방금 전";
        if (minutes < 60) return `${minutes}분 전`;
        if (hours < 24) return `${hours}시간 전`;
        if (days < 7) return `${days}일 전`;
        if (days < 30) return `${Math.floor(days / 7)}주 전`;
        if (days < 365) return `${Math.floor(days / 30)}개월 전`;
        return `${Math.floor(days / 365)}년 전`;
    }

    const closeModal = () => setIsOpen(false);


    return (
        <div className="comment-section-container"> 
            <div className="comment-item">
                <div className="comment-header">
                    <img className="profile-image" src={props.board.member.profileimg} alt="프로필 이미지" />
                    <div className="user-info">
                        <span className="username">{props.board.member.nickname}</span>
                        <span className="timestamp">
                            {timeAgo(props.board.writedate)}
                        </span>
                    </div>
                </div>

                <div className="comment-body">
                    <div className="review-content">
                        <img className="review-image" src={props.board.member.profileimg} alt="영화포스터 / 자유게시물 등" />
                        <div>
                            <p className="review-text">{props.board.title}</p>
                            <p className="review-text">{props.board.content}</p>
                        </div>
                    </div>
                    <div className="likes-replies">
                        <span>좋아요 23</span>
                        <span>댓글 0</span>
                    </div>
                </div>
                <div className="comment-actions">                    
                    <div className="action-buttons">
                        <button className="icon-button">👍</button>
                        <button className="icon-button">💬</button>
                    </div>
                </div>
                {/* <div>
                    <Modal isOpen={isOpen}  ariaHideApp={false}  style={customStyles} >
                        <CommentModalContent onClose={closeModal} />
                    </Modal>
                </div> */}
            </div>
        </div>
    );
};

export default Board