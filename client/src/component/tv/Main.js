import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import jaxios from "../../util/JWTUtil";
import axios from "axios";
import Slider from "react-slick";
import ListCard from '../ListCard';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

function Main() {
  const baseUrl = "https://api.themoviedb.org/3";
  const loginUser = useSelector(state=>state.user);
  const [likes, setLikes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [onAir, setOnAir] = useState([]);
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [action, setAction] = useState([]);
  const [animation, setAnimation] = useState([]);
  const [comedy, setComedy] = useState([]);
  const [crime, setCrime] = useState([]);
  const [drama, setDrama] = useState([]);
  const [SF, setSF] = useState([]);
  const [reality, setReality] = useState([]);
  const [family, setFamily] = useState([]);
  const [kids, setKids] = useState([]);

  const settings = {
    dots: true,               // 밑에 점 표시 여부
    infinite: true,           // 무한 루프
    speed: 500,               // 슬라이드 전환 속도 (ms)
    slidesToShow: 1,          // 한 번에 보여줄 슬라이드 개수
    slidesToScroll: 1,        // 한 번에 넘어갈 슬라이드 개수
    autoplay: true,           // 자동 슬라이드
    autoplaySpeed: 5000,      // 자동 전환 간격
    arrows: true 
  }

  const setters = {
    "on_the_air": setOnAir,
    "popular": setPopular,
    "top_rated": setTopRated,
    "10759": setAction,
    "16": setAnimation,
    "35": setComedy,
    "80": setCrime,
    "18": setDrama,
    "10765": setSF,
    "10764": setReality,
    "10751": setFamily,
    "10762": setKids
  };

  const genreIds = [
    "10759", // 액션
    "16", // 애니메이션
    "35", // 코미디
    "80", // 범죄
    "18", // 드라마
    "10765", // SF
    "10764", // 리얼리티
    "10751", // 가족
    "10762" // 키드
  ];

  async function findTvs(target) {
    try {
      const result = await axios.get(`${baseUrl}/tv/${target}?language=ko-KR&region=KR&page=1&api_key=${process.env.REACT_APP_KEY}`);
      const tvDatas = result.data.results;
      if (tvDatas.length > 0) {
        const tvsWithProviders = await Promise.all(
          tvDatas.map(async (tv) => {
            const providerRes = await axios.get(`${baseUrl}/tv/${tv.id}/watch/providers?api_key=${process.env.REACT_APP_KEY}`);
            return {
              ...tv, providers: providerRes.data.results["KR"]?.flatrate || []
            }
          })
        )
        setters[target]?.(tvsWithProviders);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function findGenres(target) {
    try {
      const result = await axios.get(`${baseUrl}/discover/tv?with_genres=${target}&language=ko-KR&region=KR&sort_by=popularity.desc&page=1&api_key=${process.env.REACT_APP_KEY}`);
      const tvDatas = result.data.results;
      if (tvDatas.length > 0) {
        const tvsWithProviders = await Promise.all(
          tvDatas.map(async (tv) => {
            const providerRes = await axios.get(`${baseUrl}/tv/${tv.id}/watch/providers?api_key=${process.env.REACT_APP_KEY}`);
            return {
              ...tv, providers: providerRes.data.results["KR"]?.flatrate || []
            }
          })
        )
        setters[target]?.(tvsWithProviders);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchAllGenres() {
    try {
      await Promise.all(genreIds.map(id => findGenres(id)));
    } catch (err) {
      console.error(err);
    }
  }

  async function findTrending() {
    try {
      const result = await axios.get(`${baseUrl}/trending/tv/week?language=ko-KR&region=KR&sort_by=popularity.desc&page=1&api_key=${process.env.REACT_APP_KEY}`);
      const tvDatas = result.data.results;
      if (tvDatas.length > 0) {
        const tvsWithProviders = await Promise.all(
          tvDatas.map(async (tv) => {
            const providerRes = await axios.get(`${baseUrl}/tv/${tv.id}/watch/providers?api_key=${process.env.REACT_APP_KEY}`);
            return {
              ...tv, providers: providerRes.data.results["KR"]?.flatrate || []
            }
          })
        )
        setTrending?.(tvsWithProviders);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function getMyLikes() {
    try {
      const result = await jaxios.get("/api/main/getMyLikes", {params: {midx: loginUser.midx}});
      if (result.data !== undefined && result.data.list !== undefined) {
        const dbidxList = result.data.list.map(like => like.dbidx);
        setLikes(dbidxList);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function getMyDblists() {
    try {
      const result = await jaxios.get("/api/main/getMyDblists", {params: {midx: loginUser.midx}});
      if (result.data !== undefined && result.data.list !== undefined) {
        const dbidxList = result.data.list.map(favorite => favorite.dbidx);
        setFavorites(dbidxList);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(
    ()=>{
      findTvs("on_the_air");
      findTrending();
      findTvs("popular");
      findTvs("top_rated");

      fetchAllGenres();

      if (loginUser && loginUser.midx > 0) {
        getMyLikes();
        getMyDblists();
      }
    },[]
  )

  return (
    <div>
      <Slider {...settings} className="lists popular">
        {
          onAir.map((item, idx)=>{
            return (
              <div className="list">
                <a href={`/tv/Detail/${item.id}`} key={idx}>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.overview}</p>
                  </div>
                  <img src={`https://image.tmdb.org/t/p/w342${item.poster_path}`} alt={`${item.title} 포스터`} onError={(e)=>{e.target.src="/images/noposter.png"}} />
                </a>
              </div>
            )
          })
        }
      </Slider>
  
      <h3 className="genre_title">주간 인기 급상승 TV 시리즈</h3>
      <ListCard lists={trending} target="tv" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">인기 TV 시리즈</h3>
      <ListCard lists={popular} target="tv" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">평점 높은 TV 시리즈</h3>
      <ListCard lists={topRated} target="tv" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">액션 &amp; 어드밴쳐 <a href="/tv/genre/10759">모두 보기<FontAwesomeIcon icon={faAngleRight} /></a></h3>
      <ListCard lists={action} target="tv" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">애니메이션 <a href="/tv/genre/16">모두 보기<FontAwesomeIcon icon={faAngleRight} /></a></h3>
      <ListCard lists={animation} target="tv" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">코미디 <a href="/tv/genre/35">모두 보기<FontAwesomeIcon icon={faAngleRight} /></a></h3>
      <ListCard lists={comedy} target="tv" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">범죄 <a href="/tv/genre/80">모두 보기<FontAwesomeIcon icon={faAngleRight} /></a></h3>
      <ListCard lists={crime} target="tv" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">드라마 <a href="/tv/genre/18">모두 보기<FontAwesomeIcon icon={faAngleRight} /></a></h3>
      <ListCard lists={drama} target="tv" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">SF &amp; 판타지 <a href="/tv/genre/10765">모두 보기<FontAwesomeIcon icon={faAngleRight} /></a></h3>
      <ListCard lists={SF} target="tv" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">리얼리티 <a href="/tv/genre/10764">모두 보기<FontAwesomeIcon icon={faAngleRight} /></a></h3>
      <ListCard lists={reality} target="tv" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">가족 <a href="/tv/genre/10751">모두 보기<FontAwesomeIcon icon={faAngleRight} /></a></h3>
      <ListCard lists={family} target="tv" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">키즈 <a href="/tv/genre/10762">모두 보기<FontAwesomeIcon icon={faAngleRight} /></a></h3>
      <ListCard lists={kids} target="tv" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />
    </div>
  )
}

export default Main