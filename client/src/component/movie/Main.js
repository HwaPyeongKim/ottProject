import { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import ListCard from '../ListCard';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

function Main() {
  const baseUrl = "https://api.themoviedb.org/3";

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

  const ottInfos = [
    {key: 8, label: "netflix", link: "https://www.netflix.com/search?q="},
    {key: 1796, label: "netflixbasicwithads", link: "https://www.netflix.com/search?q="},
    {key: 356, label: "wavve", link: "https://www.wavve.com/search?searchWord="},
    {key: 97, label: "watcha", link: "https://watcha.com/search?query="},
    {key: 337, label: "disneyplus", link: "https://www.disneyplus.com/ko-kr/search?q="}, // 디즈니는 검색이 안됨
    {key: 2, label: "appletvplus", link: "https://tv.apple.com/kr/search?term="},
    {key: 350, label: "appletvplus", link: "https://tv.apple.com/kr/search?term="},
    {key: 9, label: "amazonprimevideo", link: "https://www.primevideo.com/-/ko/s?k="},
    {key: 10, label: "amazonprimevideo", link: "https://www.primevideo.com/-/ko/s?k="},
    {key: 119, label: "amazonprimevideo", link: "https://www.primevideo.com/-/ko/s?k="},
    {key: 3, label: "play", link: "https://play.google.com/store/search?q="}, // 구글플레이는 우리나라에서 안된다는데 다시 확인 필요
    {key: 1883, label: "tving", link: "https://www.tving.com/search?query="},
    {key: 283, label: "crunchyroll", link: "https://www.crunchyroll.com/search?from=search&q="}
  ]

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

  useEffect(
    ()=>{
      findMovies("now_playing");
      findTrending();
      findMovies("popular");
      findMovies("top_rated");
      // findMovies("upcoming"); // 메인으로 빠질것

      fetchAllGenres();
    },[]
  )

  return (
    <div>
      <Slider {...settings} className="lists popular">
        {
          now.map((item, idx)=>{
            return (
              <div className="list">
                <a href={`/movie/detail/${item.id}`} key={idx}>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.overview}</p>
                  </div>
                  <img src={`https://image.tmdb.org/t/p/w342${item.poster_path}`} alt={`${item.title} 포스터`} />
                </a>
              </div>
            )
          })
        }
      </Slider>

      <h3>주간 인기 급상승 영화</h3>
      <ListCard lists={trending} target="movie" />

      <h3>인기 영화</h3>
      <ListCard lists={popular} target="movie" />

      <h3>액션 영화</h3>
      <ListCard lists={action} target="movie" />

      <h3>모험 영화</h3>
      <ListCard lists={adventure} target="movie" />

      <h3>코미디 영화</h3>
      <ListCard lists={comedy} target="movie" />

      <h3>로맨스 영화</h3>
      <ListCard lists={romance} target="movie" />

      <h3>드라마 영화</h3>
      <ListCard lists={drama} target="movie" />

      <h3>다큐멘터리 영화</h3>
      <ListCard lists={documentary} target="movie" />

      <h3>공포 영화</h3>
      <ListCard lists={horror} target="movie" />

      <h3>스릴러 영화</h3>
      <ListCard lists={thriller} target="movie" />

      <h3>SF 영화</h3>
      <ListCard lists={SF} target="movie" />

      <h3>음악 영화</h3>
      <ListCard lists={music} target="movie" />

      <h3>평점 높은 영화</h3>
      <ListCard lists={topRated} target="movie" />

      <h3>개봉 예정작</h3>
      <ListCard lists={coming} target="movie" />
    </div>
  )
}

export default Main