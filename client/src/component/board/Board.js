 import React, { useEffect, useRef, useState } from 'react'
import Modal from 'react-modal'

import CommentModal from './CommentModal';
import { useSelector } from 'react-redux';
import axios from 'axios';
import jaxios from '../../util/JWTUtil';
import { useNavigate, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import parse from 'html-react-parser';

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
    // 신고 상태
    const [reported, setReported] = useState(false);
    // 스포일러 내용
    const [showSpoiler, setShowSpoiler] = useState(false);
    const isBlurred = props.board.status === "BLURRED";
    // 글 더보기
    const [showFullContent, setShowFullContent] = useState(false);
    const [commentCount, setCommentCount] = useState(0);

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
            overflow: "auto", // 수정: 모달 밖 스크롤 방지
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

    // useEffect(() => {
    //     const preventScroll = (e) => {
    //     if (isOpen) e.preventDefault();
    //     };
    //     if (isOpen) {
    //     window.addEventListener('wheel', preventScroll, { passive: false });
    //     window.addEventListener('touchmove', preventScroll, { passive: false });
    //     } else {
    //     window.removeEventListener('wheel', preventScroll);
    //     window.removeEventListener('touchmove', preventScroll);
    //     }
    //     return () => {
    //     window.removeEventListener('wheel', preventScroll);
    //     window.removeEventListener('touchmove', preventScroll);
    //     };
    // }, [isOpen]);

    useEffect(
        ()=>{
            console.log("Board props:", props);
            // console.log("board data:", props.board.member);          
            // console.log("board data:", props.board.boardMember);
            // console.log("현재 로그인 정보:", loginUser);
            // console.log(" 쿠키 user:", cookies.get("user"));

            axios.get(`/api/board/getLikeList`, {params: {boardid: props.board.bidx}})
            .then((result)=>{
                setLikeList([...result.data.likeList]);
            }).catch((err)=>{console.error(err)})            
        },[]
    )

    useEffect(
        () => {
            if (!props.board.fidx) {
                setImgSrc('');
                return;
            }
            setImgSrc('');
            axios.get(`/api/file/url/${props.board.fidx}`)
                .then((res) => {
                    setImgSrc(res.data.image); // 실제 S3 URL
                    // console.log(props)
                    console.log(props.board.bidx);
                }).catch((err) => console.error(err));
        }, [props.board.fidx]
    );

    useEffect(
        ()=>{
            if (!props.board.boardMember.profileimg) return;

            axios.get(`/api/file/url/${props.board.boardMember.profileimg}`)
            .then((res) => {
                setProfileImgSrc(res.data.image);    // 완성된 S3 URL 저장
            }).catch(err => console.error(err));
        },[props.board.boardMember.profileimg]
    )

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
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    useEffect(
        () => {
        if (!loginUser || !loginUser.midx) {
            setReported(false);
            return;
        }
        // 페이지 로드 시 신고 여부 확인
        jaxios.get(`/api/board/isReported/${props.board.bidx}?midx=${loginUser.midx}`)
        .then((res) => {
            setReported(res.data.reported); // 서버에서 신고 여부 가져오기
        })
        .catch((err) => { console.error(err); });
        }, [props.board.bidx, loginUser.midx]
    ); 

    function reportBoard(){
        if (!loginUser || !loginUser.midx) {
            alert("스포신고는 로그인이 필요한 서비스입니다.");
            return;
        }

        if(reported) return;

        jaxios.post(`/api/board/reportBoard/${props.board.bidx}`, {midx: loginUser.midx} )
        .then((res) => {
            if (res.data.msg === 'ok'){
                alert('신고가 접수되었습니다');
                setReported(true);
            } else if (res.data.msg === '이미 신고한 게시글입니다'){
                alert(res.data.msg);
                setReported(true);
            } else {
                alert('신고 처리 중 오류가 발생했습니다');
            }
        })
        .catch((err)=>{console.error(err)});
    }

    useEffect(() => {
        async function CommentCount() {
            try {
                const res = await axios.get(`/api/bcomment/getCommentCount/${props.board.bidx}`);
                setCommentCount(res.data.count); // 서버에서 댓글+대댓글 합계 반환
            } catch (err) {
                console.error(err);
            }
        }
        if (props.board.bidx) {
            CommentCount();
        }
    }, [props.board.bidx]);
   

    return (
        <div className="comment-section-container"> 
            <div className="comment-item">
                <div className="comment-header">
                    <img className="profile-image" src={profileImgSrc} alt="프로필 이미지" />
                    <div className="user-info">
                        <span className="username">{props.board.boardMember.nickname}</span>
                        <span className="timestamp">
                            {timeAgo(props.board.writedate)}
                        </span>
                    </div>
                </div>

                <div className="comment-body">
                    <div className="review-content">
                        {imgSrc && (
                            <img className="review-image" src={imgSrc} alt="영화포스터 / 자유게시물 등" />
                        )}      
                        {isBlurred && !showSpoiler ? (
                            <div className="spoiler-warning" onClick={() => setShowSpoiler(true)} >
                            ⚠️ 스포성 내용이 포함된 게시글입니다. (클릭하여 보기)
                            </div>
                        ) : (
                            <div>
                            <p className="review-text boardtitle">{props.board.title}</p>
                            <div className={`review-text ${!showFullContent ? 'clamp' : ''}`} style={{ whiteSpace: "pre-wrap" }}>
                                {parse(props.board.content || '')}
                            </div>

                            {props.board.content.length > 100 && (
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
                            {
                                likeList.some((like) => Number(like.midx) === Number(loginUser.midx))? (
                                    <button className="icon-button" onClick={() => onLike()}>❤️ {likeList.length}</button>
                                ) : (
                                    <button className="icon-button" onClick={() => onLike()}>🤍 {likeList.length}</button>
                                )
                            }
                            <button className="icon-button" onClick={()=>{setIsOpen(true)}}>💬 {commentCount}</button>
                        </div>
                        <div className="update-button" ref={updateButtonRef}>
                            <button className="icon-button" onClick={() => setMenuOpen(prev => !prev)}>⋯</button>
                            <div className={`dropdown_menu ${menuOpen ? 'open' : ''}`}>
                                <button onClick={()=>{navigate(`/updateForm/${props.board.bidx}`)}}>수정</button>
                                <button onClick={()=>{reportBoard(); setMenuOpen(false);}} disabled={reported} >스포일러 신고</button>
                                <button onClick={()=>{props.deleteBoard(props.board.bidx); setMenuOpen(false);}}>삭제</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles} >
                        <CommentModal onClose={closeModal} bidx={props.board.bidx} onCommentAdded={() => setCommentCount(prev => prev + 1)}/>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default Board