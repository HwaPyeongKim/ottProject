import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/JWTUtil';

function MemberList() {
    const [memberList, setMemberList] = useState([]);
    const [paging, setPaging] = useState({});
    const [beginEnd, setBeginEnd] = useState([]);
    const [key, setKey] = useState("");

    useEffect(() => {
        loadData(1, key);
    }, []);

    function loadData(page, key) {
        jaxios.get('/api/admin/getMemberList', { params: { page, key } })
            .then((result) => {
                setMemberList(result.data.memberList);
                setPaging(result.data.paging);
                setKey(result.data.key);

                let arr = [];
                for (let i = result.data.paging.beginPage; i <= result.data.paging.endPage; i++) {
                    arr.push(i);
                }
                setBeginEnd(arr);
            })
            .catch((err) => console.error(err));
    }

    function onPageMove(p) {
        loadData(p, key);
    }

    function changeAdmin(userid, checked) {
        const url = checked
            ? '/api/admin/changeRoleAdmin'
            : '/api/admin/changeRoleUser';

        jaxios.post(url, null, { params: { userid } })
            .then((result) => {
                if (result.data.msg === 'ok') {
                    alert(
                        checked
                            ? `${userid} 님이 관리자로 변경되었습니다.`
                            : `${userid} 님이 일반유저로 변경되었습니다.`
                    );
                }
            });
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
                        placeholder="검색어 입력"
                        onChange={(e) => setKey(e.target.value)}
                    />
                    <button
                        className="admin-btn primary"
                        onClick={() => onPageMove(1)}
                    >
                        검색
                    </button>
                </div>
            </div>

            {/* 테이블 */}
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>권한</th>
                        <th>User ID</th>
                        <th>성명</th>
                        <th>Phone</th>
                        <th>주소</th>
                        <th>Provider</th>
                        <th>가입일</th>
                    </tr>
                </thead>

                <tbody>
                    {memberList.length > 0 ? (
                        memberList.map((member, idx) => (
                            <tr key={idx}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={member.memberRoleList?.includes("ADMIN")}
                                        onChange={(e) =>
                                            changeAdmin(member.userid, e.target.checked)
                                        }
                                    />
                                </td>
                                <td>{member.userid}</td>
                                <td>{member.name}</td>
                                <td>{member.phone}</td>
                                <td>{member.address1} {member.address2}</td>
                                <td>{member.provider}</td>
                                <td>{member.indate.substring(2, 10)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">데이터가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 페이징 */}
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
                {paging.prev && (
                    <span
                        style={{ cursor: "pointer", margin: "0 5px" }}
                        onClick={() => onPageMove(paging.beginPage - 1)}
                    >
                        ◀
                    </span>
                )}

                {beginEnd.map((p) => (
                    <span
                        key={p}
                        style={{ cursor: "pointer", margin: "0 5px" }}
                        onClick={() => onPageMove(p)}
                    >
                        {p}
                    </span>
                ))}

                {paging.next && (
                    <span
                        style={{ cursor: "pointer", margin: "0 5px" }}
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
