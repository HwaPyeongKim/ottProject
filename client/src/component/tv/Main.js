import { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import ListCard from '../ListCard';

function Main() {
  const baseUrl = "https://api.themoviedb.org/3";

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
    "10751": setFamily,
    "10762": setKids
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
    "10759", // 액션
    "16", // 애니메이션
    "35", // 코미디
    "80", // 범죄
    "18", // 드라마
    "10765", // SF
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

  useEffect(
    ()=>{
      findTvs("on_the_air");
      findTrending();
      findTvs("popular");
      findTvs("top_rated");

      fetchAllGenres();
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
                  <img src={`https://image.tmdb.org/t/p/w342${item.poster_path}`} alt={`${item.title} 포스터`} />
                </a>
              </div>
            )
          })
        }
      </Slider>
  
      <h3>주간 인기 급상승 TV 시리즈</h3>
      <ListCard lists={trending} target="tv" />

      <h3>인기 TV 시리즈</h3>
      <ListCard lists={popular} target="tv" />

      <h3>평점 높은 TV 시리즈</h3>
      <ListCard lists={topRated} target="tv" />

      <h3>액션 & 어드밴쳐</h3>
      <ListCard lists={action} target="tv" />

      <h3>애니메이션</h3>
      <ListCard lists={animation} target="tv" />

      <h3>코미디</h3>
      <ListCard lists={comedy} target="tv" />

      <h3>범죄</h3>
      <ListCard lists={crime} target="tv" />

      <h3>드라마</h3>
      <ListCard lists={drama} target="tv" />

      <h3>SF</h3>
      <ListCard lists={SF} target="tv" />

      <h3>가족</h3>
      <ListCard lists={family} target="tv" />

      <h3>어린이</h3>
      <ListCard lists={kids} target="tv" />
    </div>
  )
}

export default Main