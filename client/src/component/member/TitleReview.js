import { useEffect, useState } from "react";
import jaxios from "../../util/JWTUtil";
import ReviewCard from "./ReviewCard";
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";

function TitleReview() {
  const loginUser = useSelector( state=>state.user );
//   const {writeridx: paramMidx} = useParams();
//   const targetMidx = paramMidx ? Number(paramMidx) : loginUser?.midx;

  const [reviews, setReviews] = useState([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(
    ()=>{
      fetchReview()
    },[]
  )

  const fetchReview = async (pageNum) => {
      if (loading || !hasMore) {return};

      setLoading(true);

      try{
          const result = await jaxios.get('/api/member/getReviewList', {params:{page: page, midx:loginUser.midx}})
          console.log('타이틀평점 : ', result.data.reviewList.reviewList)
          if (result.data.reviewList.reviewList.length === 0) {
              setHasMore(false);
              setLoading(false);
              return;
          }
          if (pageNum === 1) {
              setReviews(result.data.reviewList.reviewList)
          } else {
              setReviews(prev => [...prev, ...result.data.reviewList.reviewList]);
          }
      }catch(err){
          console.error(err)
      }
      setLoading(false);
  }

  return (
    <div style={{ paddingTop: "40px" }}>
        <h2 style={{ color: "white", textAlign: "center" }}>후기 목록</h2>

        {reviews.length === 0 && (
            <p style={{ color: "white", textAlign: "center", marginTop: "40px" }}>작성한 후기가 없습니다.</p>
        )}

        {reviews.map(review => (
            review.content != '' && (
                <ReviewCard key={review.ridx} review={review} user={loginUser} />
            )
        ))}
    </div>
  )
}

export default TitleReview
