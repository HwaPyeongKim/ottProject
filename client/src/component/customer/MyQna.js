import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/JWTUtil';
import { useSelector } from 'react-redux';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

import "../../style/qna.css";


function MyQna () {
  const [qnaList, setQnaList] = useState([]);
  const [paging, setPaging] = useState({});
  const [key, setKey] = useState('');
  const [beginEnd, setBeginEnd] = useState([]);
  const navigate = useNavigate();
  const loginUser = useSelector(state => state.user);

  useEffect(() => {

    jaxios
      .get('/api/admin/getMyQnaList', { params: { page: 1, key, midx:loginUser.midx } })
      .then((result) => {
        setQnaList(result.data.qnaList);
        setPaging(result.data.paging);
        setKey(result.data.key);

        const arr = [];
        for (let i = result.data.paging.beginPage; i <= result.data.paging.endPage; i++) {
          arr.push(i);
        }
        setBeginEnd([...arr]);
      })
      .catch((err) => console.error(err));
  }, []);

  function onPageMove(page) {
    jaxios
      .get(`/api/admin/getMyQnaList`, { params: { page, key } })
      .then((result) => {
        setQnaList([...result.data.qnaList]);
        setPaging(result.data.paging);
        setKey(result.data.key);
        const pageArr = [];
        for (let i = result.data.paging.beginPage; i <= result.data.paging.endPage; i++) {
          pageArr.push(i);
        }
        setBeginEnd([...pageArr]);
      })
      .catch((err) => console.error(err));
  }

  return (
    <div className="main-container">
      <div className="section-title">Q&A 게시판</div>

      <div className="filter-bar">
        <button className="btn btn-success" onClick={() => navigate('/qnaWrite')}>
          문의하기
        </button>
        <button className="btn btn-success" onClick={() => navigate(`/myQna`)}>
          나의 Q&A 조회&nbsp; &gt;
        </button>
      </div>
      {/* 검색 바 */}
      <div className="filter-bar">
        <input
          className="search-input"
          type="text"
          placeholder="검색어를 입력하세요"
          value={key}
          onChange={(e) => setKey(e.currentTarget.value)}
        />
        <button className="btn btn-primary" onClick={() => onPageMove(1)}>
          검색
        </button>
      </div>

      {/* Q&A 리스트 테이블 */}
      <div className="qna-table">
        <div className="qna-header">
          <div className="col">번호</div>
          <div className="col flex3 title" style={{textAlign:"center"}}>제목</div>
          <div className="col flex1.5 title">작성자</div>
          <div className="col">답변</div>
          <div className="col">작성일</div>
        </div>

        {qnaList && qnaList.length > 0 ? (
          qnaList.map((qna, idx) => (
            <div
              className="qna-row"
              key={idx}
              onClick={() => navigate(`/qnaView/${qna.qidx}`)}
            >
              <div className="col">{qna.qidx}</div>
              <div className="col flex3 title"
                onClick={() => navigate(`/qnaView/${qna.qidx}`)}>
                {qna.security === 'Y'
                    ? (
                        <>
                          <FontAwesomeIcon icon={faLock} />
                          &nbsp;&nbsp;{qna.title}
                        </>
                      )
                    : qna.title
                }
              </div>
              <div className="col flex1.5 title">
                {qna.member.nickname.length > 6
                  ? `${qna.member.nickname.slice(0, 6)}...`
                  : qna.member.nickname
                }
              </div>
              <div className="col">{qna.reply ? 'Y' : 'N'}</div>
              <div className="col">{qna.writedate.substring(2, 10)}</div>
            </div>
          ))
        ) : (
          <div className="no-data">등록된 글이 없습니다.</div>
        )}
      </div>

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
  );
}

export default MyQna;
