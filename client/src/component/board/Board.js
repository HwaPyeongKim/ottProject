import React, { useState } from 'react'
import Modal from 'react-modal'

import CommentModalContent from './CommentModalContent';
import "../../style/board.css";

Modal.setAppElement('#root');

function Board() {
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
            <h2 className="section-title">지금 뜨는 토픽</h2>
            
            {/* 탭 버튼 섹션 */}
            <div className="tab-buttons">
                <button className="tab-button active">최신</button>
                <button className="tab-button">인기</button>
            </div>

            {/* 댓글 목록 섹션 */}
            <div className="comments-list">
                
                {/* 첫 번째 댓글 아이템 (사진 속 댓글) */}
                <div className="comment-item">
                <div className="comment-header">
                    {/* 프로필 이미지 (더미) */}
                    <img className="profile-image" src="https://via.placeholder.com/40" alt="프로필 이미지" />
                    <div className="user-info">
                        <span className="username">Dh</span>
                        <span className="timestamp">약 14시간 전</span>
                    </div>
                </div>

                <div className="comment-body">
                    <div className="review-content">
                    {/* 리뷰 이미지 (더미) */}
                    <img className="review-image" src="https://via.placeholder.com/80x120?text=GAME+IMAGE" alt="The Rains Game Cover" />
                    <p className="review-text">
                        **더 레인스 게임**<br />
                        천재지변이 덮친 인도, 네 녀석의 희로애락
                        <span role="img" aria-label="cheers-emoji"> 🍻</span>
                    </p>
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
                    {/* "..." 기능 제외 */}
                    </div>
                </div>
                </div>

                {/* 두 번째 댓글 아이템 (반복 예시) */}
                <div className="comment-item">
                    <div className="comment-header">
                        <img className="profile-image" src="https://via.placeholder.com/40" alt="프로필 이미지" />
                        <div className="user-info">
                            <span className="username">React Dev</span>
                            <span className="timestamp">약 2일 전</span>
                        </div>
                    </div>

                    <div className="comment-body">
                        <div className="review-content">
                            <img className="review-image" src="https://via.placeholder.com/80x120?text=Movie+Poster" alt="Movie Poster" />
                            <p className="review-text">
                                **React와 CSS는 꿀조합**<br />
                                게시판 코딩은 언제나 즐거워요!
                                <span role="img" aria-label="code-emoji"> 💻</span>
                            </p>
                        </div>
                    </div>

                    <div className="comment-actions">
                        <div className="likes-replies">
                            <span>좋아요 10</span>
                            <span onClick={ ()=>{ setIsOpen( true ) }}>댓글 5</span>
                        </div>
                        <div className="action-buttons">
                            <button className="icon-button">👍</button>
                            <button className="icon-button" onClick={ ()=>{ setIsOpen( true ) }}>💬</button>
                        </div>
                    </div>
                        <div>
                            <Modal isOpen={isOpen}  ariaHideApp={false}  style={customStyles} >
                                <CommentModalContent onClose={closeModal} />
                            </Modal>
                        </div>
                </div>                
            </div>
        </div>
    );
};

export default Board