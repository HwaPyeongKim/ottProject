import React, {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useSelector } from 'react-redux';
import Board from './Board';

import "../../style/board.css";


function BoardMain() {
    const [boardList, setBoardList] = useState([]);
    const navigate = useNavigate();

    useEffect(
        ()=>{
            axios.get('/api/board/getBoardList')
            .then((result)=>{
                console.log("boardlist : " , result.data.boardList);
                setBoardList([...result.data.boardList]);
            }).catch((err)=>{})
        },[]
    )

    return (
        <div className='comment-section-container'>
            <h2 className="section-title">지금 뜨는 토픽</h2>
            <div className="tab-buttons">
                <div>
                    <button className="tab-button active">최신</button>
                    <button className="tab-button">인기</button>
                </div>
                <button className='tab-button boardWrite' onClick={()=>{navigate("/writeForm")}}>글쓰기</button>
            </div>
            <div className="boardlist">
                {
                    (boardList && boardList.length != 0)?(
                        boardList
                        .map((board, idx)=>{
                            return ( <Board key={idx} board={board} />  )
                        })
                    ):(<h3>검색된 피드가 없습니다</h3>)
                }
            </div>
        </div>
    )
}

export default BoardMain