import { useEffect, useState, useRef } from "react";
import jaxios from "../../util/JWTUtil";
import ReviewCard from "./ReviewCard";
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";

function TitleReview() {
  const loginUser = useSelector( state=>state.user );
  const {userMidx} = useParams();
  const userId = Number(userMidx);
//   const {writeridx: paramMidx} = useParams();
//   const targetMidx = paramMidx ? Number(paramMidx) : loginUser?.midx;
  const [chkMember, setChkMember] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loader = useRef(null);

  useEffect(
    ()=>{
      fetchReview(1)
    },[]
  )

  const fetchReview = async (pageNum) => {
      if (loading || !hasMore) {return};

      setLoading(true);
      let targetMidx;
      console.log('리뷰 유저아이디 : ',userId);
      try{
          if( userId !== loginUser.midx ){
            targetMidx = userId;
            const res = await jaxios.post('/api/member/getCheckMember', null, {params:{midx:targetMidx}})
            setChkMember(res.data.checkMember);
          }else{
            targetMidx = loginUser.midx;
            setChkMember(loginUser);
          }
          console.log('해당 midx : ', targetMidx)
          const result = await jaxios.get('/api/member/getReviewList', {params:{page: page, midx:targetMidx}})
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

  useEffect(
      ()=>{
          fetchReview(page);
      },[page]
  )
  useEffect(() => {
      const observer = new IntersectionObserver(
      entries => {
          if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
          }
      },
      { threshold: 0.7 }
      );

      if (loader.current) observer.observe(loader.current);
      return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <div style={{ paddingTop: "40px" }}>
        <h2 style={{ color: "white", textAlign: "center" }}>후기 목록</h2>

        {reviews.length === 0 && (
            <p style={{ color: "white", textAlign: "center", marginTop: "40px" }}>작성한 후기가 없습니다.</p>
        )}

        {reviews.map(review => (
            review.content != '' && (
                <ReviewCard key={review.ridx} review={review} user={chkMember} />
            )
        ))}

        <div ref={loader} className="scroll-loader">
            {loading && "Loading..."}
        </div>
    </div>
  )
}

export default TitleReview
