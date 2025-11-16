import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Board from './Board';

import "../../style/board.css";
import jaxios from '../../util/JWTUtil';
function BoardMain() {
    const loginUser = useSelector(state => state.user);
    const navigate = useNavigate();
    const [boardList, setBoardList] = useState([]);
    const [paging, setPaging] = useState({});
    const [searchWord, setSearchWord] = useState('');
    const [deletedIds, setDeletedIds] = useState([]);
    const [sortType, setSortType] = useState('latest'); // 최신(latest) or 인기(popular)

    useEffect(() => {
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
        jaxios.get(`/api/board/getBoardList/${p}`, { params: { searchWord, sortType } })
            .then(result => {
                setPaging(result.data.paging);
                const newBoards = result.data.boardList
                    .filter(board => !deletedIds.includes(board.bidx))
                    .filter(board => !boardList.some(b => b.bidx === board.bidx));
                setBoardList([...boardList, ...newBoards]);
            })
            .catch(err => console.error(err));
    }

    function onSearch(p) {
        jaxios.get(`/api/board/getBoardList/${p}`, { params: { searchWord, sortType } })
            .then(result => {
                const filteredBoards = result.data.boardList.filter(board => !deletedIds.includes(board.bidx));
                setBoardList(filteredBoards);
                setPaging(result.data.paging);
            })
            .catch(err => console.error(err));
    }

    function deleteBoard(bidx) {
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
            <h2 className="section-title">지금 뜨는 토픽</h2>
            <div className="tab-buttons">
                <div>
                    <button className={`tab-button ${sortType === 'latest' ? 'active' : ''}`} onClick={Latest}>최신</button>
                    <button className={`tab-button ${sortType === 'popular' ? 'active' : ''}`} onClick={Popular}>인기</button>
                </div>
            </div>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchWord}
                    onChange={(e) => setSearchWord(e.target.value)}
                />
                <button className='search-btn' onClick={() => onSearch(1)}>검색</button>
                <button className='tab-button boardWrite' onClick={() => navigate("/writeForm")}>글쓰기</button>
            </div>
            <div className="boardlist">
                {boardList && boardList.length !== 0 ? (
                    boardList.map((board, idx) => (
                        <Board key={idx} board={board} deleteBoard={deleteBoard} />
                    ))
                ) : (
                    <h3>검색된 피드가 없습니다</h3>
                )}
            </div>
        </div>
    )
}


export default BoardMain;
