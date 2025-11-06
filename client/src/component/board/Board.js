import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'

import CommentModalContent from './CommentModalContent';
import "../../style/board.css";

Modal.setAppElement('#root');

function Board(props) {

    useEffect(()=> {
        console.log(props)
    }, [])
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

    const closeModal = () => setIsOpen(false);


    return (
        <div className="comment-section-container"> 
            <div className="comment-item">
                <div className="comment-header">
                    {/* <img className="profile-image" src={props.board.member.profileimg} alt="프로필 이미지" /> */}
                    <div className="user-info">
                        {/* <span className="username">{props.board.member.nickname}</span> */}
                        <span className="timestamp">
                            {/* {new Date(props.board.writedate).toLocaleString()} */}
                        </span>
                    </div>
                </div>

                <div className="comment-body">
                    <div className="review-content">
                        {/* <img className="review-image" src={props.board.member.profileimg} alt="" /> */}
                        <p className="review-text">{props.board}</p>
                    </div>
                </div>
                <div className="comment-actions">
                    <div className="likes-replies">
                        <span>👍 좋아요 23</span>
                        <span>💬 댓글 0</span>
                    </div>
                    <div className="action-buttons">
                        <button className="icon-button">👍</button>
                        <button className="icon-button">💬</button>
                    </div>
                </div>
                <div>
                    <Modal isOpen={isOpen}  ariaHideApp={false}  style={customStyles} >
                        <CommentModalContent onClose={closeModal} />
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default Board