import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';

import CommentModal from './CommentModal';
import { useSelector } from 'react-redux';
import axios from 'axios';
import jaxios from '../../util/JWTUtil';
import { useNavigate, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import parse from 'html-react-parser';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCommentDots } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";

Modal.setAppElement('#root');

function Board(props) {
    const [isOpen, setIsOpen] = useState(false);    
    const closeModal = () => setIsOpen(false);
    const loginUser = useSelector(state => state.user);
    const [likeList, setLikeList] = useState([]);
    const [imgSrc, setImgSrc] = useState('');
    const [profileImgSrc, setProfileImgSrc] = useState('');
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const updateButtonRef = useRef(null);
    const cookies = new Cookies();
    const {bidx} = useParams();

    const [reported, setReported] = useState(false);
    const [showSpoiler, setShowSpoiler] = useState(false);
    const isBlurred = props.board.status === "BLURRED";
    const [showFullContent, setShowFullContent] = useState(false);
    const [commentCount, setCommentCount] = useState(0);

    const contentRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    const customStyles = {
        overlay: { backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000 },
        content: {
            left: "50%",
            top: "50%", 
            transform: "translate(-50%, -50%)", 
            margin: 0, 
            width: "700px",
            height: "700px",
            padding: "15px",
            overflow: "auto",
            zIndex: 1001,
            borderRadius: "35px",
            border: "none", 
        },
    };

    function timeAgo(dateString) {
        const now = new Date();
        const writeDate = new Date(dateString);
        const diff = (now - writeDate) / 1000;

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

    // // 게시글 overflow 체크
    // useEffect(() => {
    //     if (!contentRef.current) return;

    //     const el = contentRef.current;
    //     const style = window.getComputedStyle(el);
    //     const lineHeight = parseFloat(style.lineHeight); // line-height 값 가져오기
    //     const maxLines = 3; // 3줄 제한
    //     const maxHeight = lineHeight * maxLines;
    //     setIsOverflowing(el.scrollHeight > maxHeight);
    // }, [props.board.content, showFullContent]);


    // 게시글 overflow 체크
    useEffect(() => {
        if (!contentRef.current) return;

        const el = contentRef.current;
        const style = window.getComputedStyle(el);
        const lineHeight = parseFloat(style.lineHeight);

        // line-height 못 구하면 그냥 더보기 안 보이게
        if (!lineHeight || Number.isNaN(lineHeight)) {
            setIsOverflowing(false);
            return;
        }

        // 실제 줄 수 계산
        const lines = el.scrollHeight / lineHeight;

        // 3줄 "초과"일 때만 더보기 버튼 표시
        // (소수점 오차 감안해서 3.1 기준으로)
        setIsOverflowing(lines > 3.1);
    }, [props.board.content]);



    useEffect(() => {
        axios.get(`/api/board/getLikeList`, {params: {boardid: props.board.bidx}})
            .then(result => setLikeList([...result.data.likeList]))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (!props.board.fidx) return setImgSrc('');
        axios.get(`/api/file/url/${props.board.fidx}`)
            .then(res => setImgSrc(res.data.image))
            .catch(err => console.error(err));
    }, [props.board.fidx]);

    useEffect(() => {
        if (!props.board.boardMember.profileimg) return;
        axios.get(`/api/file/url/${props.board.boardMember.profileimg}`)
            .then(res => setProfileImgSrc(res.data.image))
            .catch(err => console.error(err));
    }, [props.board.boardMember.profileimg]);

    async function onLike(){
        if (!loginUser || !loginUser.midx) {
            alert("좋아요는 로그인이 필요한 서비스입니다.");
            return;
        }

        let result = await jaxios.post('/api/board/addlike', { bidx: props.board.bidx, midx: loginUser.midx })

        result = await axios.get('/api/board/getLikeList', {params: {boardid: props.board.bidx}})
        setLikeList( [ ...result.data.likeList ] );
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (updateButtonRef.current && !updateButtonRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    useEffect(
        () => {
        if (!loginUser || !loginUser.midx) {
            setReported(false);
            return;
        }
        jaxios.get(`/api/board/isReported/${props.board.bidx}?midx=${loginUser.midx}`)
            .then(res => setReported(res.data.reported))
            .catch(err => console.error(err));
    }, [props.board.bidx, loginUser?.midx]);

    function reportBoard(){
        if (!loginUser || !loginUser.midx) {
            alert("스포신고는 로그인이 필요한 서비스입니다.");
            return;
        }

        if(reported) return;

        jaxios.post(`/api/board/reportBoard/${props.board.bidx}`, { midx: loginUser.midx })
            .then(res => {
                if (res.data.msg === 'ok') alert('신고가 접수되었습니다');
                else if (res.data.msg === '이미 신고한 게시글입니다') alert(res.data.msg);
                else alert('신고 처리 중 오류가 발생했습니다');
                setReported(true);
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        async function CommentCount() {
            try {
                const res = await axios.get(`/api/bcomment/getCommentCount/${props.board.bidx}`);
                setCommentCount(res.data.count);
            } catch (err) { console.error(err); }

        }
        if (props.board.bidx) CommentCount();
    }, [props.board.bidx]);

    return (
        <div className="comment-section-container">
            <div className="comment-item">
                <div className="comment-header">
                    <img className="profile-image" src={profileImgSrc} alt="프로필 이미지" style={{cursor: 'pointer'}} onClick={() => navigate(`/pageView/${props.board.boardMember.midx}`)}/>
                    <div className="user-info">
                        <span className="username" style={{cursor: 'pointer'}} onClick={() => navigate(`/pageView/${props.board.boardMember.midx}`)}>{props.board.boardMember.nickname}</span>
                        <span className="timestamp">{timeAgo(props.board.writedate)}</span>
                    </div>
                </div>

                <div className="comment-body">
                    <div className="review-content">
                        {imgSrc && <img className="review-image" src={imgSrc} alt="영화포스터 / 자유게시물 등" />}
                        
                        {isBlurred && !showSpoiler ? (
                            <div className="spoiler-warning" onClick={() => setShowSpoiler(true)}>
                                ⚠️ 스포성 내용이 포함된 게시글입니다. (클릭하여 보기)
                            </div>
                        ) : (
                            <div>
                                <p className="review-text boardtitle">{props.board.title}</p>
                            <div ref={contentRef} className={`review-text ${!showFullContent ? 'clamp' : ''}`} style={{ whiteSpace: "pre-wrap" }}>
                                {parse(props.board.content || '')}
                            </div>
                                {isOverflowing && (
                                    <button className="show-more-button" onClick={() => setShowFullContent(prev => !prev)}>
                                        {showFullContent ? "접기" : "더보기"}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="comment-actions">
                    <div className="action-buttons">
                        <div className='left-buttons'>
                            {likeList.some(like => Number(like.midx) === Number(loginUser?.midx)) ? (
                                <button className="icon-button" onClick={() => onLike()}><FontAwesomeIcon icon={faHeartSolid} style={{color: "#ff0000",}} /> {likeList.length}</button>
                            ) : (
                                <button className="icon-button" onClick={() => onLike()}><FontAwesomeIcon icon={faHeart} /> {likeList.length}</button>
                            )}
                            <button className="icon-button" onClick={() => setIsOpen(true)}><FontAwesomeIcon icon={faCommentDots} /> {commentCount}</button>
                        </div>

                        {Number(loginUser?.midx) === Number(props.board.boardMember.midx) && (
                            <div className="update-button" ref={updateButtonRef}>
                                <button className="icon-button" onClick={() => setMenuOpen(prev => !prev)}>⋯</button>
                                <div className={`dropdown_menu ${menuOpen ? 'open' : ''}`}>
                                    <button onClick={() => navigate(`/updateForm/${props.board.bidx}`)}>수정</button>
                                    {/* <button onClick={()=>{reportBoard(); setMenuOpen(false);}} disabled={reported} >스포일러 신고</button> */}
                                    <button onClick={() => {props.deleteBoard(props.board.bidx); setMenuOpen(false);}}>삭제</button>
                                </div>
                            </div>
                        )}

                        {loginUser?.midx && Number(loginUser.midx) !== Number(props.board.boardMember.midx) && (
                            <div className="update-button" ref={updateButtonRef}>
                                <button className="icon-button" onClick={() => setMenuOpen(prev => !prev)}>⋯</button>
                                <div className={`dropdown_menu ${menuOpen ? 'open' : ''}`}>
                                    <button onClick={()=>{reportBoard(); setMenuOpen(false);}} disabled={reported} >스포일러 신고</button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
                    <CommentModal onClose={closeModal} bidx={props.board.bidx} onCommentAdded={() => setCommentCount(prev => prev + 1)} />
                </Modal>
            </div>
        </div>
    );
}

export default Board;