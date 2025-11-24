import React, { useEffect, useState } from "react";
// import parse from 'html-react-parser';
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

  return (
    <div className="admin-container">

      <ul className="tabMenu">
        <li><button onClick={()=>{setActiveTab("community")}} className={activeTab === "community" ? "on" : ""} >커뮤니티</button></li>
        <li><button onClick={()=>{setActiveTab("review")}} className={activeTab === "review" ? "on" : ""} >후기</button></li>
      </ul>
      
      {
        activeTab === "community" ? (
          <table className="admin-table spoiler">
            <thead>
              <tr>
                <th className="content">제목</th>
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
                <th className="content">내용</th>
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
                      <img src="" alt="" />
                    </div>
                    <p>{content.boardMember?.nickname ?? "Unknown"}</p>
                  </div>
                  <div className="content">
                    <img src={content.imgSrc} alt="게시글 사진" />
                    <div>
                      <h3>{content.title}</h3>
                      <p>{content.content}</p>
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