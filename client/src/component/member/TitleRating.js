import {useState, useEffect, useRef} from 'react'
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/JWTUtil';
import Slider from "react-slick";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import '../../style/titleRating.css'
import RatingSlider from './RatingSlider'

function TitleRating() {
    
    const loginUser = useSelector( state=>state.user );
    const [movies, setMovies] = useState([]);
    const [sort, setSort] = useState("scoreDesc");
    const [listTab, setListTab] = useState('tab1')
    const [isAddListModal, setIsAddListModal] = useState(false);
    const [reviewList, setReviewList] = useState([]);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const loader = useRef(null);
    
    useEffect(
        () => {
            fetchReview()
        }, []
    );

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
                setReviewList(result.data.reviewList.reviewList)
            } else {
                setReviewList(prev => [...prev, ...result.data.reviewList.reviewList]);
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

    const groupByRating = (items) => {
        const groups = {};

        // 5.0 → 0.5 까지 미리 0.5 단위로 모든 평점을 생성
        for (let score = 5.0; score >= 0.5; score -= 0.5) {
            groups[score.toFixed(1)] = [];
        }

        // 실제 데이터를 해당 평점 그룹에 넣기
        items.forEach((m) => {
            const key = Number(m.score).toFixed(1);
            if (groups[key]) {
                groups[key].push(m);
            }
        });

        return groups;
    };

    const grouped = groupByRating(reviewList);
    const ratingOrder = Object.keys(grouped).sort((a, b) => b - a); 
    // const sortedMovies = [...movies].sort((a, b) => {
    //     if (sort === "scoreDesc") return b.score - a.score;
    //     if (sort === "scoreAsc") return a.score - b.score;
    //     return 0;
    // });

    return (
        <div className="tr-container">
            <div className="tr-tabs">
                <button className={listTab === 'tab1' ? "active" : ""}  
                onClick={()=>{setListTab('tab1')}}>전체</button>
                <button className={listTab === 'tab2' ? "active" : ""} 
                onClick={()=>{setListTab('tab2')}}>별점 순</button>
            </div>
            {/* <div className="header-container">
                <select value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="scoreDesc">별점 높은 순</option>
                    <option value="scoreAsc">별점 낮은 순</option>
                </select>
            </div> */}

            {
                reviewList.length === 0 ? (
                    <div className="lists noFind">목록을 찾을 수 없습니다</div>
                ) : (
                    listTab === 'tab1' ? (
                        <div className="tr-content-grid">
                            {reviewList.map(review => (
                                <div className="card" key={review.dbidx}>
                                    <a href={`/movie/detail/${review.dbidx}`}>
                                        <img
                                            src={`https://image.tmdb.org/t/p/w342/${review.posterpath}`}
                                            alt={review.title}
                                        />
                                    </a>
                                    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                                        <div>평가함</div>&nbsp;
                                        <FontAwesomeIcon icon={solidStar} style={{ color: "gold" }} />&nbsp;
                                        <div>{review.score}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {ratingOrder.map(rating => (
                                grouped[rating] && grouped[rating].length > 0
                                    ? ( // 조건이 참일 때: RatingSlider 렌더링
                                        <RatingSlider
                                            key={rating}
                                            title={`${rating} 평점`}
                                            movies={grouped[rating]}
                                        />
                                    )
                                    : ( // 조건이 거짓일 때: 목록 없음 메시지 렌더링
                                        <div className="lists noFind" key={rating}>
                                            {rating}점 목록을 찾을 수 없습니다
                                        </div>
                                    )
                            ))}
                        </>
                    )
                )
            }

            <div ref={loader} className="scroll-loader">
                {loading && "Loading..."}
            </div>
        </div>
    )
}

export default TitleRating