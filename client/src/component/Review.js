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
import { faStar, faEllipsis } from "@fortawesome/free-solid-svg-icons";

const Review = ({ dbidx, season, refreshAverage  }) => {
  const loginUser = useSelector(state=>state.user);
  const [page, setPage] = useState(1);
  const [hover, setHover] = useState(0);
  const [view, setView] = useState(false);
  const [reviewList, setReviewList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [displayRow, setDisplayRow] = useState(5);
  const [average, setAverage] = useState(0);
  const [score, setScore] = useState(0);
  const [content, setContent] = useState("");

  const [openMenuId, setOpenMenuId] = useState(null);

  const handleClick = (starIndex, isHalf) => {
    const newScore = isHalf ? starIndex - 0.5 : starIndex;
    setScore(newScore);
  };

  const getStarIcon = (starIndex) => {
    const current = hover || score;
    if (current >= starIndex) return solidStar;
    if (current >= starIndex - 0.5) return faStarHalfAlt;
    return regularStar;
  };

  function StarRating() {
    return (
      <div style={{ display: "flex", flexDirection: "row", fontSize: "24px" }}>
        {[1,2,3,4,5].map((star) => (
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
  };

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
    jaxios.post("/api/review/saveReview", {midx:loginUser.midx, content, dbidx, score, season})
    .then((result)=>{
      if (result.data.msg === "ok") {
        alert("후기가 등록되었습니다");
        setScore(0);
        setHover(0);
        setContent("");
        getReviews(1, true);
        if (refreshAverage) refreshAverage();
      } else {
        alert("후기 등록이 실패했습니다");
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
      .catch((err)=>{console.error(err);})
    }
  }

  function editReview(ridx) {

  }

  function spoilReview(ridx) {

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
                          <li><button onClick={()=>{editReview(review.ridx)}}>수정하기</button></li>
                          <li><button onClick={()=>{deleteReview(review.ridx)}}>삭제하기</button></li>
                        </>
                        : null
                      }
                      <li><button onClick={()=>{spoilReview(review.ridx)}}>스포일러 신고</button></li>
                      <li><button onClick={()=>setOpenMenuId(null)}>닫기</button></li>
                    </ul>
                  </div>
                </div>
                <div>
                  <pre>{review.content}</pre>
                </div>
              </li>
            )
          })
          :
          <li className="noFind">작성된 리뷰가 없습니다</li>
        }
        {view ? <div className="more"><button className="mainButton" onClick={()=>{getReviews(page)}}>더보기</button></div> : null}
      </ul>
    </>
  )
}

export default Review