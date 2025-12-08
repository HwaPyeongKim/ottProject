import { useEffect, useState, useRef } from "react";
import jaxios from "../../util/JWTUtil";
import ReviewCard from "./ReviewCard";
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";

function TitleReview() {
  const loginUser = useSelector( state=>state.user );
  const {userMidx} = useParams();
  const userId = Number(userMidx);
    const [targetMidx, setTargetMidx] = useState(userId);
        useEffect(() => {
        if (loginUser?.midx) {
            setTargetMidx(
            userId === loginUser.midx ? loginUser.midx : userId
            );
        }
        }, [loginUser, userId]);
  const [chkMember, setChkMember] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");

  const loader = useRef(null);

  useEffect(
    ()=>{
      fetchReview(1)
    },[]
  )

  const fetchReview = async (pageNum) => {
      if (loading || !hasMore) {return};

        setLoading(true);
        console.log('리뷰 유저아이디 : ',userId);
        try{
            if( targetMidx !== loginUser.midx ){
                const res = await jaxios.post('/api/member/getCheckMember', null, {params:{midx:targetMidx}})
                setChkMember(res.data.checkMember);
            }else{
                setChkMember(loginUser);
            }
            console.log('해당 midx : ', targetMidx)
            const result = await jaxios.get('/api/member/getReviewList', {params:{page: pageNum, midx:targetMidx, type: typeFilter}})
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
        setReviews([]);  // 기존 데이터를 비움
        setPage(1);
        setHasMore(true);
        fetchReview(1);
    }, [typeFilter]);  // type 변경 시 초기화

    
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
        {
            (targetMidx === loginUser.midx)?
            (<h2 style={{ color: "white", textAlign: "center" }}>나의 후기 목록</h2>):
            (<h2 style={{ color: "white", textAlign: "center" }}>{chkMember.nickname} 님의 후기 목록</h2>)
        }
        
        <div className="type-filter" style={{paddingLeft: "27.5%"}}>
            <button 
                className={typeFilter === "all" ? "active" : ""} 
                onClick={() => { setTypeFilter("all"); setPage(1); setHasMore(true); }}
            >전체</button>

            <button 
                className={typeFilter === "movie" ? "active" : ""} 
                onClick={() => { setTypeFilter("movie"); setPage(1); setHasMore(true); }}
            >영화</button>

            <button 
                className={typeFilter === "tv" ? "active" : ""} 
                onClick={() => { setTypeFilter("tv"); setPage(1); setHasMore(true); }}
            >티비</button>
        </div>
        {reviews.length === 0 && (
            <p style={{ color: "white", textAlign: "center", marginTop: "40px" }}>작성한 후기가 없습니다.</p>
        )}

        {reviews.map(review => (
            review.content != '' && (
                <ReviewCard key={review.ridx} review={review} getReviews={ (page = 1) => {
                    setPage(1);
                    setReviews([]);
                    setHasMore(true);
                    fetchReview(1);
                }}
                refreshAverage={() => {}}
                />
            )
        ))}

        <div ref={loader} className="scroll-loader">
            {loading && "Loading..."}
        </div>
    </div>
  )
}

export default TitleReview
