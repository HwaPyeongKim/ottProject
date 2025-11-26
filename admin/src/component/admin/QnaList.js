import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/JWTUtil';

function QnaList() {

    const [qnaList, setQnaList] = useState([]);
    const [paging, setPaging] = useState({});
    const navigate = useNavigate();
    const [key, setKey] = useState('');
    const [beginEnd, setBeginEnd] = useState([]);

    // 🔥 정렬 관련 state
    const [sortField, setSortField] = useState("qidx");
    const [sortDir, setSortDir] = useState("DESC");

    useEffect(() => {
        loadData(1, key, sortField, sortDir);
    }, []);

    // 🔥 데이터 로딩 공통 함수
    function loadData(page, key, sortField, sortDir) {
        jaxios.get('/api/admin/getAdminQnaList', {
            params: { page, key, sortField, sortDir }
        })
            .then((result) => {
                setQnaList(result.data.qnaList);
                setPaging(result.data.paging);

                let arr = [];
                for (let i = result.data.paging.beginPage; i <= result.data.paging.endPage; i++) {
                    arr.push(i);
                }
                setBeginEnd(arr);
            })
            .catch((err) => console.error(err));
    }

    // 🔥 페이지 이동
    function onPageMove(page) {
        loadData(page, key, sortField, sortDir);
    }

    // 🔥 헤더 클릭 시 정렬 토글
    function handleSort(field) {
        let direction = "ASC";

        // 동일 컬럼 클릭 → 방향 변경
        if (sortField === field && sortDir === "ASC") {
            direction = "DESC";
        }

        setSortField(field);
        setSortDir(direction);

        loadData(1, key, field, direction);
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
                        placeholder="검색어 입력 (제목)"
                        onChange={(e) => setKey(e.currentTarget.value)}
                    />

                    <button
                        className="admin-btn primary"
                        style={{ marginLeft: "auto" }}
                        onClick={() => loadData(1, key, sortField, sortDir)}
                    >
                        검색
                    </button>
                </div>
            </div>

            {/* 리스트 테이블 */}
            <table className="admin-table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort("qidx")}>
                            No. {sortField === "qidx" && (sortDir === "ASC" ? "▲" : "▼")}
                        </th>

                        <th
                            style={{ width: "40%", cursor: "pointer" }}
                            onClick={() => handleSort("title")}
                        >
                            제목 {sortField === "title" && (sortDir === "ASC" ? "▲" : "▼")}
                        </th>

                        <th onClick={() => handleSort("member.nickname")}>
                            작성자 {sortField === "member.nickname" && (sortDir === "ASC" ? "▲" : "▼")}
                        </th>

                        <th onClick={() => handleSort("reply")}>
                            답변여부 {sortField === "reply" && (sortDir === "ASC" ? "▲" : "▼")}
                        </th>

                        <th onClick={() => handleSort("writedate")}>
                            작성일 {sortField === "writedate" && (sortDir === "ASC" ? "▲" : "▼")}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {qnaList.length > 0 ? (
                        qnaList.map((qna, idx) => (
                            <tr
                                key={idx}
                                onClick={() => navigate(`/qnaAdminView/${qna.qidx}`)}
                                style={{ cursor: "pointer" }}
                                className={qna.reply ? "" : "not-answer"}
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
                            <td colSpan="8">데이터가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 페이징 */}
            <div className="pagination">
                {paging.prev && (
                    <span
                        className="page-btn"
                        onClick={() => onPageMove(paging.beginPage - 1)}
                    >
                        ◀
                    </span>
                )}

                {beginEnd.map((page, idx) => (
                    <span
                        key={idx}
                        className={`page-btn ${page === paging.page ? "active" : ""}`}
                        onClick={() => onPageMove(page)}
                    >
                        {page}
                    </span>
                ))}

                {paging.next && (
                    <span
                        className="page-btn"
                        onClick={() => onPageMove(paging.endPage + 1)}
                    >
                        ▶
                    </span>
                )}
            </div>

        </div>
    )
}

export default QnaList;
