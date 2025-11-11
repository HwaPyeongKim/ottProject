 import React, { useEffect, useRef, useState } from 'react'
import Modal from 'react-modal'

import CommentModalContent from './CommentModalContent';
import { useSelector } from 'react-redux';
import axios from 'axios';
import jaxios from '../../util/JWTUtil';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

function Board(props) {    
    const [isOpen, setIsOpen] = useState(false);    
    const closeModal = () => setIsOpen(false);
    const loginUser = useSelector(state => state.user);
    const [likeList, setLikeList] = useState([]);
    const [imgSrc, setImgSrc] = useState('');
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const updateButtonRef = useRef(null);

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

    useEffect(
        ()=>{
            // console.log("Board props:", props);
            // console.log("board data:", props.board.member);          
            // console.log("board data:", props.board.boardMember);

            jaxios.get(`/api/board/getLikeList`, {params: {boardid: props.board.bidx}})
            .then((result)=>{
                setLikeList([...result.data.likeList]);
            }).catch((err)=>{console.error(err)})            
        },[props.board]
    )

    useEffect(() => {
        if (!props.board.fidx) return;

        axios.get(`/api/file/url/${props.board.fidx}`)
            .then((res) => {
                setImgSrc(res.data.image); // 실제 S3 URL
            })
            .catch((err) => console.error(err));
    }, [props.board.fidx]);

    async function onLike(){
        let result = await jaxios.post('/api/board/addlike', { bidx: props.board.bidx, midx: loginUser.midx })

        result = await jaxios.get('/api/board/getLikeList', {params: {boardid: props.board.bidx}})
        setLikeList( [ ...result.data.likeList ] );
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (updateButtonRef.current && !updateButtonRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="comment-section-container"> 
            <div className="comment-item">
                <div className="comment-header">
                    <img className="profile-image" src={props.board.boardMember.profileimg} alt="프로필 이미지" />
                    <div className="user-info">
                        <span className="username">{props.board.boardMember.nickname}</span>
                        <span className="timestamp">
                            {timeAgo(props.board.writedate)}
                        </span>
                    </div>
                </div>

                <div className="comment-body">
                    <div className="review-content">
                        <img className="review-image" src={imgSrc} alt="영화포스터 / 자유게시물 등" />
                        <div>
                            <p className="review-text">{props.board.title}</p>
                            <p className="review-text">{props.board.content}</p>
                        </div>
                    </div>
                    <div className="likes-replies">
                        <span>좋아요 {likeList.length}</span>
                        <span>댓글 0</span>
                    </div>
                </div>
                <div className="comment-actions">                    
                    <div className="action-buttons">
                        <div className='left-buttons'>
                            {
                                likeList.some((like) => Number(like.midx) === Number(loginUser.midx))? (
                                    <button className="icon-button" onClick={() => onLike()}>❤️</button>
                                ) : (
                                    <button className="icon-button" onClick={() => onLike()}>🤍</button>
                                )
                            }
                            {/* <button className="icon-button">👍</button> */}
                            <button className="icon-button" onClick={()=>{setIsOpen(true)}}>💬</button>
                        </div>
                        <div className="update-button" ref={updateButtonRef}>
                            <button className="icon-button" onClick={() => setMenuOpen(prev => !prev)}>⋯</button>
                            <div className={`dropdown_menu ${menuOpen ? 'open' : ''}`}>
                                <button onClick={()=>{navigate('/updateForm')}}>수정</button>
                                <button>스포일러 신고</button>
                                <button>삭제</button>
                            </div>
                        </div>
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