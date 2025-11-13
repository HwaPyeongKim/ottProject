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
    const [deletedIds, setDeletedIds] = useState([]); // 삭제된 게시글 ID 관리

    useEffect(() => {
        onSearch(1); // 초기 데이터 로드
    }, []);

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
            // console.log(paging.page);
            onPageMove(Number(paging.page) + 1);
        }
    }

    function onPageMove(p) {
        jaxios.get(`/api/board/getBoardList/${p}`, { params: { searchWord } })
            .then(result => {
                setPaging(result.data.paging);
                const newBoards = result.data.boardList
                    .filter(board => !deletedIds.includes(board.bidx)) // 삭제 글 제외
                    .filter(board => !boardList.some(b => b.bidx === board.bidx)); // 중복 제외
                setBoardList([...boardList, ...newBoards]);
            })
            .catch(err => console.error(err));
    }

    function onSearch(p) {
        jaxios.get(`/api/board/getBoardList/${p}`, { params: { searchWord } })
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
                setDeletedIds(prev => [...prev, bidx]); // 삭제 ID 추가
                setBoardList(prev => prev.filter(board => board.bidx !== bidx)); // 화면에서도 제거
                onSearch(1); // 페이지 초기화 후 새로 로드
            })
            .catch(err => console.error(err));
        }
    }

    return (
        <div className='comment-section-container'>
            <h2 className="section-title">지금 뜨는 토픽</h2>
            <div className="tab-buttons">
                <div>
                    <button className="tab-button active">최신</button>
                    <button className="tab-button">인기</button>
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
