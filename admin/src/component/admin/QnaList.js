import React, { useEffect, useState } from 'react'
import SubMenu from '../Submenu'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/JWTUtil';

function QnaList() {

    const [qnaList, setQnaList] = useState([]);
    const [paging, setPaging]=useState({});
    const navigate = useNavigate();
    const [key, setKey]=useState('')
    const [beginEnd, setBeginEnd]=useState([])

    useEffect(
        ()=>{
            jaxios.get('/api/admin/getQnaList', {params:{page:1, key}})
            .then((result)=>{ 
                setQnaList(result.data.qnaList)
                setPaging( result.data.paging )
                setKey( result.data.key)
                let arr = [];
                for( let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                    arr.push(i);
                }
                setBeginEnd( [...arr] )
            })
            .then((err)=>{console.error(err)})
        },[]
    )

    function onPageMove(page){
        jaxios.get(`/api/admin/getQnaList`, {params:{page, key}})
        .then((result)=>{
            setQnaList( [...result.data.qnaList ] );
            setPaging( result.data.paging);
            setKey(result.data.key);
            const pageArr = [];
            for(let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                pageArr.push(i);
            }
            setBeginEnd( [...pageArr] );
        }).catch((err)=>{console.error(err)})
    }

    return (
        <div className="admin-container">

            {/* 검색 영역 */}
            <div className="admin-card">
                <h2 className="admin-title">Q&A 게시판</h2>

                <div style={{ display: "flex", gap: "1rem" }}>
                    <input
                        type="text"
                        className="admin-input"
                        value={key}
                        onChange={(e) => setKey(e.currentTarget.value)}
                    />

                    <button
                        className="admin-btn primary"
                        style={{ marginLeft: "auto" }}
                        onClick={() => onPageMove(1)}
                    >
                        검색
                    </button>
                </div>
            </div>

            {/* 리스트 테이블 */}
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th style={{ width: "40%" }}>제목</th>
                        <th>작성자</th>
                        <th>답변여부</th>
                        <th>작성일</th>
                    </tr>
                </thead>

                <tbody>
                    {qnaList ? (
                        qnaList.map((qna, idx) => (
                            <tr
                                key={idx}
                                onClick={() => navigate(`/qnaView/${qna.qidx}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <td>{qna.qidx}</td>

                                <td style={{ textAlign: "left", paddingLeft: "10px" }}>
                                    {qna.title}
                                </td>

                                <td>{qna.member.nickname}</td>

                                <td className={`reply-status ${qna.reply ? "done" : "pending"}`}>
                                    {qna.reply ? "Y" : "N"}
                                </td>

                                <td>{qna.writedate.substring(2, 10)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">loading...</td>
                        </tr>
                    )}
                </tbody>
            </table>


            {/* 페이징 */}
            <div className="pagination">
                {paging.prev && (
                <span className="page-btn" onClick={() => onPageMove(paging.beginPage - 1)}>
                    ◀
                </span>
                )}
                {beginEnd &&
                beginEnd.map((page, idx) => (
                    <span
                    className={`page-btn ${page === paging.page ? 'active' : ''}`}
                    key={idx}
                    onClick={() => onPageMove(page)}
                    >
                    {page}
                    </span>
                ))}
                {paging.next && (
                <span className="page-btn" onClick={() => onPageMove(paging.endPage + 1)}>
                    ▶
                </span>
                )}
            </div>
        
        </div>
    )
}

export default QnaList