import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/JWTUtil';

function MemberList() {
    const [memberList, setMemberList] = useState([]);
    const [selected, setSelected] = useState([]);
    const [paging, setPaging] = useState({});
    const [beginEnd, setBeginEnd] = useState([]);
    const [key, setKey] = useState("");

    // 🔥 추가된 부분
    const [sortField, setSortField] = useState("nickname");
    const [sortDir, setSortDir] = useState("ASC");

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

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = memberList.map(member => member.midx);
            setSelected(allIds);
        } else {
            setSelected([]);
        }
    };

    const handleSelectOne = (midx) => {
        setSelected(prev =>
            prev.includes(midx)
            ? prev.filter(item => item !== midx)
            : [...prev, midx]
        );
    };

    async function setAdmin(role) {
        if (selected.length === 0) {
            return alert("변경할 회원을 체크해주세요");
        }
        jaxios.post("/api/admin/setAdmin", null, {params:{selected, role}})
        .then((result)=>{
            if (result.data.msg === "ok") {
                alert("관리자 권한이 변경 되었습니다");
                loadData(1, key, sortField, sortDir);
                setSelected([]);
            }
        })
        .catch((err)=>{console.error(err)})
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
                    <button className="admin-btn primary" onClick={() => loadData(1, key, sortField, sortDir)}>검색</button>
                    <button className="admin-btn" onClick={()=>{setAdmin(2)}}>관리자 추가</button>
                    <button className="admin-btn" onClick={()=>{setAdmin(1)}}>관리자 해제</button>
                </div>
            </div>

            {/* 테이블 */}
            <table className="admin-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" onChange={handleSelectAll} checked={selected.length === memberList.length && memberList.length > 0} /></th>
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
                            전화번호 {sortField === "phone" && (sortDir === "ASC" ? "▲" : "▼")}
                        </th>
                        <th onClick={() => handleSort("address1")}>
                            주소 {sortField === "address1" && (sortDir === "ASC" ? "▲" : "▼")}
                        </th>
                        <th onClick={() => handleSort("provider")}>
                            가입경로 {sortField === "provider" && (sortDir === "ASC" ? "▲" : "▼")}
                        </th>
                        <th onClick={() => handleSort("indate")}>
                            가입일 {sortField === "indate" && (sortDir === "ASC" ? "▲" : "▼")}
                        </th>
                        <th>권한</th>
                    </tr>
                </thead>

                <tbody>
                    {memberList.length > 0 ? (
                        memberList.map((member, idx) => (
                            <tr key={idx}>
                                <td><input type="checkbox" checked={selected.includes(member.midx)} onChange={() => handleSelectOne(member.midx)} /></td>
                                <td>{member.name}</td>
                                <td>{member.nickname}</td>
                                <td>{member.email}</td>
                                <td>{member.phone}</td>
                                <td>{member.address1} {member.address2}</td>
                                <td>{member.provider}</td>
                                <td>{member.indate.substring(2, 10)}</td>
                                <td>{member.role === 1 ? "일반" : "관리자"}</td>
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
