import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Slider from "react-slick";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

function Main() {
  const baseUrl = "https://api.themoviedb.org/3";
  
  const [sliderShow, setSliderShow] = useState(8);
  const [popular, setPopular] = useState([]);
  const [now, setNow] = useState([]);
  const [coming, setComing] = useState([]);

  const mainSettings = {
    dots: true,               // 밑에 점 표시 여부
    infinite: true,           // 무한 루프
    speed: 500,               // 슬라이드 전환 속도 (ms)
    slidesToShow: 1,          // 한 번에 보여줄 슬라이드 개수
    slidesToScroll: 1,        // 한 번에 넘어갈 슬라이드 개수
    autoplay: true,           // 자동 슬라이드
    autoplaySpeed: 5000,      // 자동 전환 간격
    arrows: true 
  }

  const settings = {
    dots: true,
    speed: 500,
    slidesToShow: sliderShow,
    slidesToScroll: sliderShow,
    arrows: true
  };

  const setters = {
    "popular": setPopular,
    "now_playing": setNow,
    "upcoming": setComing,
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

  async function findMovies(target) {
    try {
      const result = await axios.get(`${baseUrl}/movie/${target}?language=ko-KR&region=KR&page=1&api_key=${process.env.REACT_APP_KEY}`);
      const movieDatas = result.data.results;
      if (movieDatas) {
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

  useEffect(
    ()=>{
      findMovies("popular");
      findMovies("now_playing");
      findMovies("upcoming");
    },[]
  )

  return (
    <div>
      <Slider {...mainSettings} className="lists popular">
        {
          popular.map((item, idx)=>{
            return (
              <div className="list">
                <a href={`/movie/Detail/${item.id}`} key={idx}>
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

      <h3>상영중인 영화</h3>
      <Slider {...settings} className="lists">
        {
          now.map((item, idx)=>{
            return (
              <div className="list" key={idx}>
                <div className="cover">
                  <img src={`https://image.tmdb.org/t/p/w185${item.poster_path}`} alt={`${item.title} 포스터`} />
                  <a href={`/movie/Detail/${item.id}`}>
                    <div>
                      <button><FontAwesomeIcon icon={faBookmark} /></button>
                      <button><FontAwesomeIcon icon={faThumbsUp} /></button>
                    </div>
                    {
                      item.providers ? (
                        <ul>
                          {item.providers.map((provider, pidx)=>{
                            const ott = ottInfos.find(info => info.key === provider.provider_id);
                            if (!ott) return null;
                            
                            return (
                              <li key={pidx}>
                                <img src={`/images/${ott.label}.jpeg`} alt={`${ott.label} 로고`} />
                              </li>
                            )
                          })}
                        </ul>
                      )
                      : null
                    }
                  </a>
                </div>
              </div>
            )
          })
        }
      </Slider>

      <h3>개봉 예정작</h3>
      <Slider {...settings} className="lists">
        {
          coming.map((item, idx)=>{
            return (
              <div className="list" key={idx}>
                <div className="cover">
                  <img src={`https://image.tmdb.org/t/p/w185${item.poster_path}`} alt={`${item.title} 포스터`} />
                  <a href={`/movie/Detail/${item.id}`}>
                    <div>
                      <button><FontAwesomeIcon icon={faBookmark} /></button>
                      <button><FontAwesomeIcon icon={faThumbsUp} /></button>
                    </div>
                    {
                      item.providers ? (
                        <ul>
                          {item.providers.map((provider, pidx)=>{
                            const ott = ottInfos.find(info => info.key === provider.provider_id);
                            if (!ott) return null;
                            
                            return (
                              <li key={pidx}>
                                <img src={`/images/${ott.label}.jpeg`} alt={`${ott.label} 로고`} />
                              </li>
                            )
                          })}
                        </ul>
                      )
                      : null
                    }
                  </a>
                </div>
              </div>
            )
          })
        }
      </Slider>
    </div>
  )
}

export default Main