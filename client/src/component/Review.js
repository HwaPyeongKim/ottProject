import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Navigation } from 'swiper/modules';
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from "axios";
import jaxios from "../util/JWTUtil";
import dayjs from "dayjs";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faStar, faEllipsis, faCheck } from "@fortawesome/free-solid-svg-icons";

const Review = ({ dbidx, season, refreshAverage, title, posterpath, type }) => {
  const loginUser = useSelector(state=>state.user);
  const [page, setPage] = useState(1);
  const [hover, setHover] = useState(0);
  const [view, setView] = useState(false);
  const [reviewList, setReviewList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [displayRow, setDisplayRow] = useState(5);
  const [average, setAverage] = useState(0);
  const [score, setScore] = useState(0);
  const [editScore, setEditScore] = useState(0); 
  const [editContent, setEditContent] = useState("");
  const [content, setContent] = useState("");
  const [isSpoil, setIsSpoil] = useState("N");

  const [openMenuId, setOpenMenuId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewObj, setReviewObj] = useState({});
  const [openedSpoilIds, setOpenedSpoilIds] = useState([]);

  function StarRating({ score, setScore }) {
    const [hover, setHover] = useState(0);

    const getStarIcon = (starIndex) => {
      const current = hover || score;
      if (current >= starIndex) return solidStar;
      if (current >= starIndex - 0.5) return faStarHalfAlt;
      return regularStar;
    };

    const handleClick = (starIndex, isHalf) => {
      const newScore = isHalf ? starIndex - 0.5 : starIndex;
      setScore(newScore);
    };

    return (
      <div style={{ display: "flex", flexDirection: "row", fontSize: "24px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} style={{ position: "relative", marginRight: "4px" }}>
            
            <div
              onMouseEnter={() => setHover(star - 0.5)}
              onMouseLeave={() => setHover(0)}
              onClick={() => handleClick(star, true)}
              style={{
                position: "absolute",
                width: "50%",
                height: "100%",
                left: 0,
                top: 0,
                cursor: "pointer",
                zIndex: 1,
              }}
            />

            <div
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => handleClick(star, false)}
              style={{
                position: "absolute",
                width: "50%",
                height: "100%",
                right: 0,
                top: 0,
                cursor: "pointer",
                zIndex: 1,
              }}
            />

            <FontAwesomeIcon icon={getStarIcon(star)} style={{ color: "#f39c12" }} />
          </div>
        ))}
      </div>
    );
  }

  async function getReviews(p, reset=false) {
    try {
      const result = await axios.get(`/api/review/getReviews/${p}`, {params: {dbidx, season, displayRow}});
      const newList = [...reviewList, ...result.data.list];

      if (reset) {
        setReviewList(result.data.list);
      } else {
        setReviewList(prev => [...prev, ...result.data.list]);
      }
      setTotalCount(result.data.totalCount);
      setPage(prev => prev + 1);
      if ((p * displayRow) < result.data.totalCount) {
        setView(true);
      } else {
        setView(false);
      }
      getAverage();
    } catch (err) {
      console.error(err);
    }
  }
  
  function saveReview() {
    if (!score) {return alert("별점을 체크해주세요")}

    jaxios.post("/api/review/saveReview", {midx:loginUser.midx, content, dbidx, score, season, title, posterpath, type, isspoil: isSpoil})
    .then((result)=>{
      if (result.data.msg === "ok") {
        alert("후기가 등록되었습니다");
        setScore(0);
        setHover(0);
        setContent("");
        setIsSpoil("N");
        getReviews(1, true);
        if (refreshAverage) refreshAverage();
      } else {
        alert(result.data.msg);
      }
    })
    .catch((err)=>{console.error(err);})
  }

  function deleteReview(ridx) {
    if (window.confirm("해당 댓글을 삭제하시겠습니까?")) {
      jaxios.delete(`/api/review/delete/${ridx}`)
      .then((result)=>{
        if (result.data.msg === "ok") {
          alert("댓글을 삭제했습니다");
          getReviews(1,true);
          if (refreshAverage) refreshAverage();
        }
      })
      .catch((err)=>{console.error(err);});
      setOpenMenuId(null);
    }
  }

  function editReview(ridx) {
    if (!editScore) {return alert("별점을 체크해주세요")}

    jaxios.post("/api/review/editReview", {ridx, content: editContent, score: editScore})
    .then((result)=>{
      if (result.data.msg === "ok") {
        alert("후기가 수정되었습니다");
        setEditScore(0);
        setEditContent("");
        getReviews(1, true);
        if (refreshAverage) refreshAverage();
      } else {
        alert("후기 수정이 실패했습니다");
      }
      setIsModalOpen(false);
      setOpenMenuId(null);
    })
    .catch((err)=>{console.error(err);})
  }

  function spoilReview(ridx) {
    if (window.confirm("해당 후기를 스포일러 신고하시겠습니까?")) {
      jaxios.post("/api/review/spoilReview", null, {params: {ridx, midx:loginUser.midx}})
      .then((result) => {
        if (result.data.msg === "ok") {
          alert("스포일러 신고가 되었습니다");
          getReviews(1, true);
        } else {
          alert(result.data.msg);
        }
      })
      .catch((err) => {console.error(err);});
      setOpenMenuId(null);
    }
  }

  async function getAverage() {
    try {
      const result = await axios.get("/api/review/getAverage", {params: {dbidx, season}});
      if (result.data !== undefined && result.data.average !== undefined) {
        setAverage(result.data.average);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(
    ()=>{
      getReviews(1, season);
    },[]
  )

  return (
    <>
      <h3>후기 {totalCount ? <small>({totalCount.toLocaleString()})</small> : null}</h3>
      <div className="write">
        <h4>내 별점</h4>
        <div className="rating">
          <StarRating score={score} setScore={setScore} />
          <div className="spoiler">
            <input type="checkbox" checked={isSpoil === "Y"} onChange={(e) => setIsSpoil(e.target.checked ? "Y" : "N")} id="checkbox_spoiler" />
            <label htmlFor="checkbox_spoiler"><p>스포일러 포함 <b><FontAwesomeIcon icon={faCheck} /></b></p></label>
          </div>
        </div>
        <div className="textBox">
          <textarea value={content} onChange={(e)=>{setContent(e.currentTarget.value)}} placeholder="리뷰를 입력해주세요" ></textarea>
          <button onClick={()=>{saveReview()}} className="mainButton">작성완료</button>
        </div>
      </div>
      <ul className="reviewList">
        {
          reviewList && reviewList.length > 0 ?
          reviewList.map((review, idx)=>{
            const formattedDate = review.writedate ? dayjs(review.writedate).format("YYYY-MM-DD HH:mm") : null;
            const toggleSpoilReview = (ridx) => {setOpenedSpoilIds(prev => prev.includes(ridx) ? prev.filter(id => id !== ridx) : [...prev, ridx] );};
            
            return (
              <li key={idx}>
                <div>
                  <div><span>{review.member.nickname}</span> <span><FontAwesomeIcon icon={faStar} /> {review.score}</span> <small>({formattedDate})</small></div>
                  <div>
                    <button className="menuButton" onClick={()=>setOpenMenuId(review.ridx)}><FontAwesomeIcon icon={faEllipsis} /></button>
                    <ul className={openMenuId === review.ridx ? "on" : ""}>
                      {
                        review.member.midx == loginUser.midx ?
                        <>
                          <li><button onClick={()=>{setIsModalOpen(true); setReviewObj(review); setEditScore(review.score); setEditContent(review.content);}}>수정하기</button></li>
                          <li><button onClick={()=>{deleteReview(review.ridx)}}>삭제하기</button></li>
                        </>
                        : null
                      }
                      {
                        review.member.midx != loginUser.midx ?
                        <>
                          <li><button onClick={()=>{spoilReview(review.ridx)}}>스포일러 신고</button></li>
                        </>
                        : null
                      }
                      <li><button onClick={()=>setOpenMenuId(null)}>닫기</button></li>
                    </ul>
                  </div>
                </div>
                <div>
                  {
                    review.isspoil === "N" ? (
                      <pre>{review.content}</pre>
                    ) : (
                      openedSpoilIds.includes(review.ridx) ? (
                        <pre>{review.content}</pre>
                      ) : (
                        <>
                          <div className="spoiler-container">
                            <div className="spoiler-blur">
                              <pre>{review.content}</pre>
                            </div>
                            <div className="spoiler-overlay" onClick={()=>toggleSpoilReview(review.ridx)}>
                                ⚠️ 스포일러가 포함된 게시글입니다<br/>
                                (클릭하여 보기)
                            </div>
                          </div>
                        </>
                      )
                    )
                  }
                </div>
              </li>
            )
          })
          :
          <li className="noFind">작성된 리뷰가 없습니다</li>
        }
        {view ? <div className="more"><button className="mainButton" onClick={()=>{getReviews(page)}}>더보기</button></div> : null}
      </ul>
      {isModalOpen && reviewObj && (
        <div className="modalOverlay" onClick={() => setIsModalOpen(false)}>
          <div className="modalContent modalReview" onClick={(e) => e.stopPropagation()}>
            <h3>수정하기</h3>
            <div className="rating">
              <StarRating score={editScore} setScore={setEditScore} />
            </div>
            <div className="textBox">
              <textarea value={editContent} onChange={(e)=>setEditContent(e.target.value)}></textarea>
            </div>
            <div className="buttonWrap">
              <button className="mainButton" onClick={() => {editReview(reviewObj.ridx)}}>수정하기</button>
              <button className="mainButton" onClick={() => setIsModalOpen(false)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Review