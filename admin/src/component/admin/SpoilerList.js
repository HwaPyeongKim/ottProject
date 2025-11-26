import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import jaxios from "../../util/JWTUtil";
import axios from "axios";

function SpoilerList() {

  const [activeTab, setActiveTab] = useState("community");
  const [page, setPage] = useState(1);
  const [paging, setPaging] = useState({});
  const [beginEnd, setBeginEnd] = useState([]);
  const [lists, setLists] = useState([]);
  const [key, setKey] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [content, setContent] = useState({});

  const [sortField, setSortField] = useState("writedate");
  const [sortDir, setSortDir] = useState("desc");

  function getLists(tab, page, key) {
    jaxios.get("/api/admin/getReports", {params: { page, key, tab, sort: sortField, dir: sortDir }})
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

  async function viewContent(b, bidx=0) {
    if (b) {
      setModalOpen(true);

      try {
        const result = await jaxios.get(`/api/board/getBoard/${bidx}`);
        const board = result.data.board;
        board.imgSrc = "";
        if (board.fidx) {
          const file = await axios.get(`/api/file/url/${board.fidx}`);
          board.imgSrc = file.data.image;
        }
        if (board.boardMember.profileimg !== undefined && board.boardMember.profileimg > 0) {
          const profileimg = await axios.get(`/api/file/url/${board.boardMember.profileimg}`);
          board.profileimg = profileimg.data.image;
        }
        console.log(board);
        setContent(board);
      } catch (err) {
        console.error(err);
      }

    } else {
      setModalOpen(false);
      setContent({});
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

  function handleSort(field) {
    let direction = "asc";
    if (sortField === field && sortDir === "asc") direction = "desc";

    setSortField(field);
    setSortDir(direction);

    onPageMove(1, key);
  }

  return (
    <div className="admin-container">

      <div className="admin-card">
          <h2 className="admin-title">스포일러 신고 관리</h2>

          <div style={{ display: "flex", gap: "1rem" }}>
              <input type="text" className="admin-input" value={key} placeholder="검색어 입력 (제목, 내용)" onChange={(e) => setKey(e.currentTarget.value)}/>
              <button className="admin-btn primary" style={{ marginLeft: "auto" }} onClick={() => onPageMove(1)}>검색</button>
          </div>
      </div>

      <ul className="tabMenu">
        <li><button onClick={()=>{setActiveTab("community")}} className={activeTab === "community" ? "on" : ""} >커뮤니티</button></li>
        <li><button onClick={()=>{setActiveTab("review")}} className={activeTab === "review" ? "on" : ""} >후기</button></li>
      </ul>
      
      {
        activeTab === "community" ? (
          <table className="admin-table spoiler">
            <thead>
              <tr>
                <th onClick={() => handleSort("title")} className="content">제목 {sortField === "title" && (sortDir === "asc" ? "▲" : "▼")}</th>
                <th onClick={() => handleSort("nickname")}>작성자 {sortField === "nickname" && (sortDir === "asc" ? "▲" : "▼")}</th>
                <th onClick={() => handleSort("reportcount")}>신고건수 {sortField === "reportcount" && (sortDir === "asc" ? "▲" : "▼")}</th>
                <th onClick={() => handleSort("writedate")}>작성일 {sortField === "writedate" && (sortDir === "asc" ? "▲" : "▼")}</th>
                <th>블라인드 해제</th>
              </tr>
            </thead>
            <tbody>
              {
                lists && lists.length > 0 ?
                lists.map((list,lidx)=>{

                  return (
                    <tr key={lidx}>
                      <td className="content"><button onClick={()=>{viewContent(true, list.bidx)}}>{list.title}</button></td>
                      <td>{list.boardMember?.nickname ?? "Unknown"}</td>
                      <td>{list.reportcount}</td>
                      <td>{list.writedate ? list.writedate.substring(2, 10) : null}</td>
                      <td className="buttons"><button className="mainButton" onClick={()=>{cancelReport(activeTab, list.bidx)}}>해제하기</button></td>
                    </tr>
                  )
                })
                : <tr><td colSpan="5">블라인드된 게시물이 존재하지 않습니다</td></tr>
              }
            </tbody>
          </table>
        ) : (
          <table className="admin-table spoiler">
            <thead>
              <tr>
                <th onClick={() => handleSort("content")} className="content">내용 {sortField === "content" && (sortDir === "asc" ? "▲" : "▼")}</th>
                <th onClick={() => handleSort("nickname")}>작성자 {sortField === "nickname" && (sortDir === "asc" ? "▲" : "▼")}</th>
                <th onClick={() => handleSort("reportcount")}>신고건수 {sortField === "reportcount" && (sortDir === "asc" ? "▲" : "▼")}</th>
                <th onClick={() => handleSort("writedate")}>작성일 {sortField === "writedate" && (sortDir === "asc" ? "▲" : "▼")}</th>
                <th>블라인드 해제</th>
              </tr>
            </thead>
            <tbody>
              {
                lists && lists.length > 0 ?
                lists.map((list,lidx)=>{

                  return (
                    <tr key={lidx}>
                      <td className="content"><button onClick={()=>{}} className="textWrap">{list.content}</button></td>
                      <td>{list.member?.nickname ?? "Unknown"}</td>
                      <td>{list.reportcount}</td>
                      <td>{list.writedate ? list.writedate.substring(2, 10) : null}</td>
                      <td className="buttons"><button className="mainButton" onClick={()=>{cancelReport(activeTab, list.ridx)}}>해제하기</button></td>
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

      {modalOpen && content && (
        <div className="modalOverlay" onClick={() => viewContent(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            {
              content ?
              (
                <div className="contentWrap">
                  <div className="userinfo">
                    <div>
                      <img src={content.profileimg} alt="프로필 사진" />
                    </div>
                    <p>{content.boardMember?.nickname ?? "Unknown"}</p>
                  </div>
                  <div className="content">
                    <img src={content.imgSrc} alt="게시글 사진" />
                    <div>
                      <h3>{content.title}</h3>
                      <div dangerouslySetInnerHTML={{ __html: content.content }}></div>
                    </div>
                  </div>
                </div>
              ) :
              <p>데이터를 불러올 수 없습니다</p>
            }
            <div className="buttonWrap">
              <button className="mainButton" onClick={()=>viewContent(false)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SpoilerList