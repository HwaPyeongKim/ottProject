import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import jaxios from "../../util/JWTUtil";
import axios from "axios";
import Slider from "react-slick";
import ListCard from '../ListCard';
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

function Main() {
  const baseUrl = "https://api.themoviedb.org/3";
  const loginUser = useSelector(state=>state.user);
  const [likes, setLikes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [now, setNow] = useState([]);
  const [popular, setPopular] = useState([]);
  const [trending, setTrending] = useState([]);
  const [coming, setComing] = useState([]);
  const [action, setAction] = useState([]);
  const [adventure, setAdventure] = useState([]);
  const [comedy, setComedy] = useState([]);
  const [romance, setRomance] = useState([]);
  const [drama, setDrama] = useState([]);
  const [documentary, setDocumentary] = useState([]);
  const [horror, setHorror] = useState([]);
  const [thriller, setThriller] = useState([]);
  const [SF, setSF] = useState([]);
  const [music, setMusic] = useState([]);
  const [topRated, setTopRated] = useState([]);

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
    "now_playing": setNow,
    "popular": setPopular,
    "top_rated": setTopRated,
    "upcoming": setComing,
    "28" : setAction,
    "12" : setAdventure,
    "35" : setComedy,
    "10749" : setRomance,
    "18" : setDrama,
    "99" : setDocumentary,
    "27" : setHorror,
    "53" : setThriller,
    "878" : setSF,
    "10402" : setMusic
  };

  const genreIds = [
    "28", // 액션
    "12", // 모험
    "35", // 코미디
    "10749", // 로맨스
    "18", // 드라마
    "99", // 다큐멘터리
    "27", // 공포
    "53", // 스릴러
    "878", // SF
    "10402" // 음악
  ];

  async function findMovies(target) {
    try {
      const result = await axios.get(`${baseUrl}/movie/${target}?language=ko-KR&region=KR&page=1&api_key=${process.env.REACT_APP_KEY}`);
      const movieDatas = result.data.results;
      if (movieDatas.length > 0) {
        const moviesWithProviders = await Promise.all(
          movieDatas.map(async (movie) => {
            const providerRes = await axios.get(`${baseUrl}/movie/${movie.id}/watch/providers?api_key=${process.env.REACT_APP_KEY}`);
            return {
              ...movie, providers: providerRes.data.results["KR"]?.flatrate || []
            }
          })
        )
        setters[target]?.(moviesWithProviders);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function findGenres(target) {
    try {
      const result = await axios.get(
        `${baseUrl}/discover/movie?with_genres=${target}&language=ko-KR&region=KR&sort_by=popularity.desc&page=1&api_key=${process.env.REACT_APP_KEY}`
      );
      const movieDatas = result.data.results;

      if (movieDatas.length > 0) {
        const moviesWithProviders = await Promise.all(
          movieDatas.map(async (movie) => {
            const providerRes = await axios.get(
              `${baseUrl}/movie/${movie.id}/watch/providers?api_key=${process.env.REACT_APP_KEY}`
            );
            return {
              ...movie,
              providers: providerRes.data.results["KR"]?.flatrate || [],
            };
          })
        );

        setters[target]?.(moviesWithProviders);
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
      const result = await axios.get(`${baseUrl}/trending/movie/week?language=ko-KR&region=KR&sort_by=popularity.desc&page=1&api_key=${process.env.REACT_APP_KEY}`);
      const movieDatas = result.data.results;
      if (movieDatas.length > 0) {
        const moviesWithProviders = await Promise.all(
          movieDatas.map(async (movie) => {
            const providerRes = await axios.get(`${baseUrl}/movie/${movie.id}/watch/providers?api_key=${process.env.REACT_APP_KEY}`);
            return {
              ...movie, providers: providerRes.data.results["KR"]?.flatrate || []
            }
          })
        )
        setTrending?.(moviesWithProviders);
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
      findMovies("now_playing");
      findTrending();
      findMovies("popular");
      findMovies("top_rated");
      // findMovies("upcoming"); // 메인으로 빠질것

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
          now.map((item, idx)=>{
            return (
              <div className="list">
                <Link to={`/movie/detail/${item.id}`} key={idx}>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.overview}</p>
                  </div>
                  <img src={`https://image.tmdb.org/t/p/w342${item.poster_path}`} alt={`${item.title} 포스터`} onError={(e)=>{e.target.src="/images/noposter.png"}} />
                </Link>
              </div>
            )
          })
        }
      </Slider>

      <h3 className="genre_title">주간 인기 급상승 영화</h3>
      <ListCard lists={trending} target="movie" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">인기 영화</h3>
      <ListCard lists={popular} target="movie" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">액션 영화 <Link to="/movie/genre/28">모두 보기<FontAwesomeIcon icon={faAngleRight} /></Link></h3>
      <ListCard lists={action} target="movie" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">모험 영화 <Link to="/movie/genre/12">모두 보기<FontAwesomeIcon icon={faAngleRight} /></Link></h3>
      <ListCard lists={adventure} target="movie" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">코미디 영화 <Link to="/movie/genre/35">모두 보기<FontAwesomeIcon icon={faAngleRight} /></Link></h3>
      <ListCard lists={comedy} target="movie" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">로맨스 영화 <Link to="/movie/genre/10749">모두 보기<FontAwesomeIcon icon={faAngleRight} /></Link></h3>
      <ListCard lists={romance} target="movie" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">드라마 영화 <Link to="/movie/genre/18">모두 보기<FontAwesomeIcon icon={faAngleRight} /></Link></h3>
      <ListCard lists={drama} target="movie" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">다큐멘터리 영화 <Link to="/movie/genre/99">모두 보기<FontAwesomeIcon icon={faAngleRight} /></Link></h3>
      <ListCard lists={documentary} target="movie" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">공포 영화 <Link to="/movie/genre/27">모두 보기<FontAwesomeIcon icon={faAngleRight} /></Link></h3>
      <ListCard lists={horror} target="movie" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">스릴러 영화 <Link to="/movie/genre/53">모두 보기<FontAwesomeIcon icon={faAngleRight} /></Link></h3>
      <ListCard lists={thriller} target="movie" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">SF 영화 <Link to="/movie/genre/878">모두 보기<FontAwesomeIcon icon={faAngleRight} /></Link></h3>
      <ListCard lists={SF} target="movie" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">음악 영화 <Link to="/movie/genre/10402">모두 보기<FontAwesomeIcon icon={faAngleRight} /></Link></h3>
      <ListCard lists={music} target="movie" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">평점 높은 영화</h3>
      <ListCard lists={topRated} target="movie" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />

      <h3 className="genre_title">개봉 예정작</h3>
      <ListCard lists={coming} target="movie" likes={likes} setLikes={setLikes} favorites={favorites} setFavorites={setFavorites} />
    </div>
  )
}

export default Main