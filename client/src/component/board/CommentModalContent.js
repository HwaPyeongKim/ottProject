import React from 'react';
import "../../style/boardModal.css";

// 댓글 목록 더미 데이터 
const dummyComment = {
  user: { nickname: '올림픽안장설아', avatarUrl: 'https://via.placeholder.com/30?text=U' },
  timeAgo: '1개월',
  text: '갠적으로 장준환 b급 감성 빠져서 아쉽...\n원작 안 보고 봤으면 어땠을까하는 생각이 드네',
  likes: 0,
};

const CommentModalContent = ({ onClose }) => {
    return (
        <div className="comment-modal-content">
        {/* 1. 모달 헤더 (제목 및 닫기 버튼) */}
        <div className="modal-header">
            <h3 className="modal-title">댓글</h3>
            <button className="close-button" onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
        </div>

        {/* 2. 댓글 목록 컨테이너 */}
        <div className="modal-comments-list">
            
            {/* 기존 댓글 (사진 속 댓글) */}
            <div className="modal-comment-item">
                <img className="modal-profile-image" src={dummyComment.user.avatarUrl} alt="프로필 이미지" />
                <div className="modal-comment-info">
                    <div className="modal-comment-header">
                    <span className="modal-username">{dummyComment.user.nickname}</span>
                    <span className="modal-timestamp">{dummyComment.timeAgo} 전</span>
                    {/* 별점 기능 제외 */}
                    </div>
                    <p className="modal-comment-text">{dummyComment.text}</p>
                    <div className="modal-comment-actions">
                    <button className="modal-icon-button">👍</button>
                    <span className="modal-likes">좋아요 {dummyComment.likes}</span>
                    </div>
                </div>
                <button className="modal-more-button">...</button>
            </div>
            
            {/* 추가 댓글 아이템 (스크롤링 확인용) */}
            <div className="modal-comment-item">
            <img className="modal-profile-image" src="https://via.placeholder.com/30?text=A" alt="프로필 이미지" />
            <div className="modal-comment-info">
                <div className="modal-comment-header">
                <span className="modal-username">추가 사용자</span>
                <span className="modal-timestamp">2일 전</span>
                {/* 별점 기능 제외 */}
                </div>
                <p className="modal-comment-text">좋은 글 감사합니다!</p>
                <div className="modal-comment-actions">
                <button className="modal-icon-button">👍</button>
                <span className="modal-likes">좋아요 5</span>
                </div>
            </div>
            <button className="modal-more-button">...</button>
            </div>
            
        </div>

        {/* 3. 댓글 입력창 (하단 고정) */}
        <div className="modal-comment-input-area">
            <img className="modal-input-profile-image" src="https://via.placeholder.com/30?text=My" alt="내 프로필" />
            <input 
            type="text" 
            placeholder="코멘트에 댓글을 남겨보세요" 
            className="modal-comment-input"
            />
            <button className="modal-submit-button" disabled>댓글</button>
        </div>
        </div>
    );
};

export default CommentModalContent;