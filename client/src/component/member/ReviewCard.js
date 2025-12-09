import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import jaxios from "../../util/JWTUtil";

import "../../style/reviewCard.css";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar, faStarHalfAlt, faEllipsis, } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

function StarRating({ score, setScore }) {
  const [hover, setHover] = useState(0);
const loginUser = useSelector( state=>state.user );
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
    <div style={{ display: "flex", fontSize: "24px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <div key={star} style={{ position: "relative", marginRight: "4px" }}>
          {/* 왼쪽 반 */}
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

          {/* 오른쪽 반 */}
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

          <FontAwesomeIcon icon={getStarIcon(star)} />
        </div>
      ))}
    </div>
  );
}

function ReviewCard({ review, getReviews, refreshAverage }) {
  const loginUser = useSelector((state) => state.user);

  const date = new Date(review.writedate);
  const timeAgo = formatDistanceToNow(date, {
    addSuffix: true,
    locale: ko,
  });

  const [openMenuId, setOpenMenuId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewObj, setReviewObj] = useState({});
  const [editScore, setEditScore] = useState(0);
  const [editContent, setEditContent] = useState("");

  function deleteReview(ridx) {
    if (!window.confirm("해당 댓글을 삭제하시겠습니까?")) return;

    jaxios.delete(`/api/review/delete/${ridx}`)
      .then((result) => {
        if (result.data.msg === "ok") {
          alert("댓글이 삭제되었습니다.");
          getReviews(1, true);
          refreshAverage();
        }
      })
      .catch((err) => console.error(err));

    setOpenMenuId(null);
  }

  function editReview(ridx) {
    if (!editScore) return alert("별점을 선택해주세요.");

    jaxios.post("/api/review/editReview", {
      ridx,
      content: editContent,
      score: editScore,
    })
      .then((result) => {
        if (result.data.msg === "ok") {
          alert("후기가 수정되었습니다.");
          setIsModalOpen(false);
          getReviews(1, true);
          refreshAverage();
        } else {
          alert("수정 실패");
        }
      })
      .catch((err) => console.error(err));
  }

  return (
    <>
      <div className="rc-review-card">
        <div className="rc-review-header">
          <img src={`https://image.tmdb.org/t/p/w342/${review.posterpath}`} className="rc-poster-img" alt="poster"/>

          <div className="rc-review-info">
            <div className="rc-review-title">{review.title}</div>
            <div className="rc-review-date">{timeAgo}</div>
          </div>

          <div className="rc-review-rating-top">
            <FontAwesomeIcon icon={solidStar} className="rc-star-icon"/>
            <div>{review.score}</div>
          </div>
        </div>

        <div className="rc-review-content-wrap">
          <div className="rc-review-content">{review.content}</div>

          <div className="rc-menu-wrap">
              <button
              className="menuButton"
              onClick={() =>
                  setOpenMenuId(openMenuId === review.ridx ? null : review.ridx)
              }
              >
              <FontAwesomeIcon icon={faEllipsis} />
              </button>

              <ul className={openMenuId === review.ridx ? "on" : ""}>
              {review.member.midx === loginUser.midx && (
                  <>
                  <li>
                      <button onClick={() => {
                      setIsModalOpen(true);
                      setReviewObj(review);
                      setEditScore(review.score);
                      setEditContent(review.content);
                      setOpenMenuId(null);
                      }}>
                      수정하기
                      </button>
                  </li>
                  <li>
                    <button onClick={() => deleteReview(review.ridx)}>
                    삭제하기
                    </button>
                  </li>
                  </>
              )}
              <li>
                  <button onClick={() => setOpenMenuId(null)}>닫기</button>
              </li>
              </ul>
          </div>
        </div>
      </div>

      {isModalOpen && reviewObj && (
        <div className="modalOverlay" onClick={() => setIsModalOpen(false)}>
          <div className="modalContent modalReview" onClick={(e) => e.stopPropagation()}>
            <h3>수정하기</h3>

            <div className="rating">
              <StarRating score={editScore} setScore={setEditScore} />
            </div>

            <div className="textBox">
              <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)}/>
            </div>

            <div className="buttonWrap">
              <button className="mainButton" onClick={() => editReview(reviewObj.ridx)}>
                수정하기
              </button>
              <button className="mainButton" onClick={() => setIsModalOpen(false)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReviewCard;
