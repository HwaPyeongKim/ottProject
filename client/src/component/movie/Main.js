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
                <a href={`/detail/movie/${item.id}`} key={idx}>
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
            console.log(item.providers);
            return (
              <div className="list" key={idx}>
                <div className="cover">
                  <img src={`https://image.tmdb.org/t/p/w185${item.poster_path}`} alt={`${item.title} 포스터`} />
                  <a href={`/detail/movie/${item.id}`}>
                    <div>
                      <button><FontAwesomeIcon icon={faBookmark} /></button>
                      <button><FontAwesomeIcon icon={faThumbsUp} /></button>
                    </div>
                    {
                      item.providers ? (
                        <ul>
                          {item.providers.map((provider)=>(
                            <li>
                              {provider.provider_id === 8 ? <button>넷플릭스</button> : null}
                              {provider.provider_id === 1796 ? <button>넷플릭스 ad</button> : null}
                              {provider.provider_id === 356 ? <button>웨이브</button> : null}
                              {provider.provider_id === 97 ? <button>왓챠</button> : null}
                              {provider.provider_id === 337 ? <button>디즈니</button> : null}
                              {provider.provider_id === 2 ? <button>애플</button> : null}
                              {provider.provider_id === 9 ? <button>아마존 프라임 비디오</button> : null}
                              {provider.provider_id === 10 ? <button>아마존 비디오</button> : null}
                              {provider.provider_id === 3 ? <button>구글</button> : null}
                              {provider.provider_id === 1883 ? <button>TVING</button> : null}
                            </li>
                          ))}
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
                  <a href={`/detail/movie/${item.id}`}>
                    <div>
                      <button><FontAwesomeIcon icon={faBookmark} /></button>
                      <button><FontAwesomeIcon icon={faThumbsUp} /></button>
                    </div>
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