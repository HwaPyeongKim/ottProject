import React, { useEffect, useState } from "react"
import jaxios from "../../util/JWTUtil";

function SpoilerList() {

  const [activeTab, setActiveTab] = useState("community");
  const [page, setPage] = useState(1);
  const [paging, setPaging] = useState({});
  const [beginEnd, setBeginEnd] = useState([]);
  const [lists, setLists] = useState([]);
  const [key, setKey] = useState("");

  function getLists(tab, page, key) {
    jaxios.get("/api/admin/getReports", {params: { page, key, tab }})
    .then((result) => {
      console.log(result);
      setLists(result.data.list);
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

  async function cancelReport (tab, idx) {
    try {
      const result = await jaxios.post("/api/admin/cancelReport", null, {params: {tab, idx}});
      console.log(result.data);
      if (result.data.msg === "ok") {
        alert("블라인드가 해제되었습니다");
        setLists([]);
        getLists(activeTab, page);
      } else {
        alert(result.data.msg);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(
    ()=>{
      setPage(1);
      setLists([]);
      getLists(activeTab, page);
    },[activeTab]
  )

  function onPageMove(p) {
    getLists(activeTab, p, key);
  }

  return (
    <div className="admin-container">

      <ul className="tabMenu">
        <li><button onClick={()=>{setActiveTab("community")}} className={activeTab === "community" ? "on" : ""} >커뮤니티</button></li>
        <li><button onClick={()=>{setActiveTab("review")}} className={activeTab === "review" ? "on" : ""} >후기</button></li>
      </ul>
      
      {
        activeTab === "community" ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>제목</th>
                <th>작성자</th>
                <th>신고건수</th>
                <th>작성일</th>
                <th>블라인드 해제</th>
              </tr>
            </thead>
            <tbody>
              {
                lists && lists.length > 0 ?
                lists.map((list,lidx)=>{

                  return (
                    <tr key={lidx}>
                      <td><button onClick={()=>{}}>{list.title}</button></td>
                      <td>{list.boardMember?.nickname ?? "Unknown"}</td>
                      <td>{list.reportcount}</td>
                      <td>{list.writedate ? list.writedate.substring(2, 10) : null}</td>
                      <td><button onClick={()=>{cancelReport(activeTab, list.bidx)}}>해제하기</button></td>
                    </tr>
                  )
                })
                : <tr><td colSpan="5">블라인드된 게시물이 존재하지 않습니다</td></tr>
              }
            </tbody>
          </table>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>내용</th>
                <th>작성자</th>
                <th>신고건수</th>
                <th>작성일</th>
                <th>블라인드 해제</th>
              </tr>
            </thead>
            <tbody>
              {
                lists && lists.length > 0 ?
                lists.map((list,lidx)=>{

                  return (
                    <tr key={lidx}>
                      <td><button onClick={()=>{}}>{list.content}</button></td>
                      <td>{list.member?.nickname ?? "Unknown"}</td>
                      <td>{list.reportcount}</td>
                      <td>{list.writedate ? list.writedate.substring(2, 10) : null}</td>
                      <td><button onClick={()=>{cancelReport(activeTab, list.ridx)}}>해제하기</button></td>
                    </tr>
                  )
                })
                : <tr><td colSpan="5">블라인드된 게시물이 존재하지 않습니다</td></tr>
              }
            </tbody>
          </table>
        )
      }

      <div className="pagination">
        {paging.prev && (<span className="page-btn" onClick={() => onPageMove(paging.beginPage - 1)}>◀</span>)}
        {beginEnd.map((p, idx) => (
            <span key={idx} className={`page-btn ${p === paging.page ? "active" : ""}`} onClick={() => onPageMove(p)}>{p}</span>
        ))}
        {paging.next && (<span  className="page-btn"  onClick={() => onPageMove(paging.endPage + 1)}>▶</span>)}
      </div>
    </div>
  )
}

export default SpoilerList