import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import "../../style/board.css";
import jaxios from '../../util/JWTUtil';
import axios from 'axios';
import Board from '../board/Board';

function UserCommunity() {

    const loginUser = useSelector(state => state.user);
    const {userMidx} = useParams();
    const userId = Number(userMidx);
    const [targetMidx, setTargetMidx] = useState(userId);
    useEffect(() => {
    if (loginUser?.midx) {
        setTargetMidx(
        userId === loginUser.midx ? loginUser.midx : userId
        );
    }
    }, [loginUser, userId]);

    const navigate = useNavigate();
    const [boardList, setBoardList] = useState([]);
    const [paging, setPaging] = useState({});
    const [searchWord, setSearchWord] = useState('');
    const [deletedIds, setDeletedIds] = useState([]);
    const [sortType, setSortType] = useState('latest'); // 최신(latest) or 인기(popular)

    useEffect(() => {
        setBoardList([]);
        onSearch(1); // 초기 데이터 로드
    }, [sortType]); // 정렬 기준 바뀌면 다시 로드

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, [paging.page, boardList, deletedIds]);

    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight - 50;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight) {
            if (Number(paging.page) + 1 > Number(paging.totalPage)) return;
            onPageMove(Number(paging.page) + 1);
        }
    }


    function onPageMove(p) {
    axios.get(`/api/board/getBoardList/${p}`, { params: { searchWord, sortType } })
        .then(result => {

            const merged = [
                ...boardList,
                ...result.data.boardList.filter(board => !deletedIds.includes(board.bidx))
            ];

            // 인기탭일 경우 프론트에서 한 번 더 정렬
            const sorted = sortType === 'popular'
                ? [...merged].sort((a, b) => {
                    if (b.likecount !== a.likecount) return b.likecount - a.likecount;
                    return new Date(b.writedate) - new Date(a.writedate);
                })
                : merged;

            setBoardList(sorted);
            setPaging(result.data.paging);
        })
        .catch(err => console.error(err));
    }

    function onWriteClick() {
        if (!loginUser || !loginUser.midx) {
            alert("글쓰기는 로그인이 필요한 서비스입니다.");
            navigate("/login");
            return;
        }
        // 로그인 되어 있으면 페이지 이동
        navigate("/writeForm");
    }

    function onSearch(p) {
        axios.get(`/api/board/getBoardList/${p}`, { params: { searchWord, sortType } })
            .then(result => {
                const filteredBoards = result.data.boardList.filter(board => !deletedIds.includes(board.bidx));
                setBoardList(filteredBoards);
                setPaging(result.data.paging);
            })
            .catch(err => console.error(err));
    }

    function deleteBoard(bidx) {
        if (!loginUser || !loginUser.midx) {
            alert("삭제는 로그인이 필요한 서비스입니다.");
            return;
        }

        if (window.confirm('정말로 게시글을 삭제하시겠습니까?')) {
            jaxios.delete(`/api/board/deleteBoard/${bidx}`)
            .then(() => {
                setDeletedIds(prev => [...prev, bidx]);
                setBoardList(prev => prev.filter(board => board.bidx !== bidx));
                onSearch(1);
            })
            .catch(err => console.error(err));
        }
    }

    // 탭 클릭 시 정렬 기준 변경
    function Latest() {
        setSortType('latest');
    }

    function Popular() {
        setSortType('popular');
    }

    return (
        <div className='comment-section-container'>
            <h2 className="section-title" style={{marginLeft: "10px", marginBottom: "40px"}}>커뮤니티 글 모음</h2>
            {/* <div className="tab-buttons">
                <div>
                    <button className={`tab-button ${sortType === 'latest' ? 'active' : ''}`} onClick={Latest}>최신</button>
                    <button className={`tab-button ${sortType === 'popular' ? 'active' : ''}`} onClick={Popular}>인기</button>
                </div>
                <button className='tab-button boardWrite' onClick={() => onWriteClick()}>글쓰기</button>
            </div> */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchWord}
                    onChange={(e) => setSearchWord(e.target.value)}
                />
                <button className='search-btn' onClick={() => onSearch(1)}>검색</button>                
            </div>
            <div className="boardlist">
                {
                    boardList && boardList.length > 0 && 
                    boardList.some(board => board.midx === targetMidx) ? (
                        boardList
                        .filter(board => board.midx === targetMidx)
                        .map((board, idx) => (
                            <Board key={idx} board={board} deleteBoard={deleteBoard} />
                        ))
                    ) : (
                        <><br /> <h3>&nbsp;&nbsp;작성 내역이 없습니다</h3></>
                    )
                }
            </div>
        </div>
    )
}

export default UserCommunity