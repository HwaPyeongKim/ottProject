import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/JWTUtil';

function MemberList() {
    const [memberList, setMemberList] = useState([]);
    const [paging, setPaging] = useState({});
    const [beginEnd, setBeginEnd] = useState([]);
    const [key, setKey] = useState("");

    // 🔥 추가된 부분
    const [sortField, setSortField] = useState("midx");
    const [sortDir, setSortDir] = useState("DESC");

    useEffect(() => {
        loadData(1, key, sortField, sortDir);
    }, []);

    function loadData(page, key, sortField, sortDir) {
        jaxios.get('/api/admin/getMemberList', {
            params: { page, key, sortField, sortDir }
        })
        .then((result) => {
            setMemberList(result.data.memberList);
            setPaging(result.data.paging);

            let arr = [];
            for (let i = result.data.paging.beginPage; i <= result.data.paging.endPage; i++) {
                arr.push(i);
            }
            setBeginEnd(arr);
        })
        .catch((err) => console.error(err));
    }

    function onPageMove(p) {
        loadData(p, key, sortField, sortDir);
    }

    // 🔥 헤더 클릭 시 정렬 토글
    function handleSort(field) {
        let direction = "ASC";
        if (sortField === field && sortDir === "ASC") direction = "DESC";

        setSortField(field);
        setSortDir(direction);

        loadData(1, key, field, direction);
    }

    return (
        <div className="admin-container">

            {/* 검색 영역 */}
            <div className="admin-card">
                <h2 className="admin-title">회원 관리</h2>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <input
                        className="admin-input"
                        type="text"
                        value={key}
                        placeholder="검색어 입력 (성명, 닉네임, 이메일, 주소)"
                        onChange={(e) => setKey(e.target.value)}
                    />
                    <button
                        className="admin-btn primary"
                        onClick={() => loadData(1, key, sortField, sortDir)}
                    >
                        검색
                    </button>
                </div>
            </div>

            {/* 테이블 */}
            <table className="admin-table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort("midx")}>
                            NO. {sortField === "midx" && (sortDir === "ASC" ? "▲" : "▼")}
                        </th>
                        <th onClick={() => handleSort("name")}>
                            성명 {sortField === "name" && (sortDir === "ASC" ? "▲" : "▼")}
                        </th>
                        <th onClick={() => handleSort("nickname")}>
                            닉네임 {sortField === "nickname" && (sortDir === "ASC" ? "▲" : "▼")}
                        </th>
                        <th onClick={() => handleSort("email")}>
                            이메일 {sortField === "email" && (sortDir === "ASC" ? "▲" : "▼")}
                        </th>
                        <th onClick={() => handleSort("phone")}>
                            Phone {sortField === "phone" && (sortDir === "ASC" ? "▲" : "▼")}
                        </th>
                        <th onClick={() => handleSort("address1")}>
                            주소 {sortField === "address1" && (sortDir === "ASC" ? "▲" : "▼")}
                        </th>
                        <th onClick={() => handleSort("provider")}>
                            Provider {sortField === "provider" && (sortDir === "ASC" ? "▲" : "▼")}
                        </th>
                        <th onClick={() => handleSort("indate")}>
                            가입일 {sortField === "indate" && (sortDir === "ASC" ? "▲" : "▼")}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {memberList.length > 0 ? (
                        memberList.map((member, idx) => (
                            <tr key={idx}>
                                <td>{member.midx}</td>
                                <td>{member.name}</td>
                                <td>{member.nickname}</td>
                                <td>{member.email}</td>
                                <td>{member.phone}</td>
                                <td>{member.address1} {member.address2}</td>
                                <td>{member.provider}</td>
                                <td>{member.indate.substring(2, 10)}</td>
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

                {beginEnd.map((p, idx) => (
                    <span
                        key={idx}
                        className={`page-btn ${p === paging.page ? "active" : ""}`}
                        onClick={() => onPageMove(p)}
                    >
                        {p}
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
    );
}

export default MemberList;
