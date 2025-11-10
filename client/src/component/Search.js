import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

import "../style/list.css";

function Search() {
  const {keyword} = useParams();

  const [sliderShow, setSliderShow] = useState(8);
  const [movieList, setMovieList] = useState([]);
  const [tvList, setTvList] = useState([]);

  const settings = {
    dots: true,
    speed: 500,
    slidesToShow: sliderShow,
    slidesToScroll: sliderShow,
    arrows: true
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

  async function findMovies (keyword) {
    const baseUrl = "https://api.themoviedb.org/3";
    try {
      const result = await axios.get(`${baseUrl}/search/movie?language=ko-KR&page=1&api_key=${process.env.REACT_APP_KEY}&query=${keyword}`);
      if (result.data) {
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
          setMovieList(moviesWithProviders);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function findTvs (keyword) {
    const baseUrl = "https://api.themoviedb.org/3";
    try {
      const result = await axios.get(`${baseUrl}/search/tv?language=ko-KR&page=1&api_key=${process.env.REACT_APP_KEY}&query=${keyword}`);
      if (result.data) {
        const movieDatas = result.data.results;
        if (movieDatas) {
          const moviesWithProviders = await Promise.all(
            movieDatas.map(async (tv) => {
              const providerRes = await axios.get(`${baseUrl}/tv/${tv.id}/watch/providers?api_key=${process.env.REACT_APP_KEY}`);
              return {
                ...tv, providers: providerRes.data.results["KR"]?.flatrate || []
              }
            })
          )
          setTvList(moviesWithProviders);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(
    ()=>{
      findMovies(keyword);
      findTvs(keyword);
    },[]
  )

  return (
    <div>
      <h2>{keyword} 검색 결과</h2>
      <div className="movie_wrapper">
        <h3>영화</h3>
        {
          movieList && movieList.length > 0 ? (
            <Slider {...settings} className="lists">
              {movieList.map((item, idx) => (
                <div className="list" key={idx}>
                  <div className="cover">
                    <img src={`https://image.tmdb.org/t/p/w185${item.poster_path}`} alt={`${item.title} 포스터`}/>
                    <a href={`/movieDetail/${item.id}`}>
                      <div>
                        <button><FontAwesomeIcon icon={faBookmark} /></button>
                        <button><FontAwesomeIcon icon={faThumbsUp} /></button>
                      </div>
                      {item.providers && (
                        <ul>
                          {item.providers.map((provider, pidx) => {
                            const ott = ottInfos.find(info => info.key === provider.provider_id);
                            if (!ott) return null;

                            return (
                              <li key={pidx}>
                                <img src={require(`../images/${ott.label}.jpeg`)} alt={`${ott.label} 로고`} />
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </a>
                  </div>
                </div>
              ))}

              {/* 빈 슬롯 채우기 */}
              {
                movieList.length < sliderShow &&
                Array(sliderShow - movieList.length).fill(null).map((_, i) => (
                  <div className="list empty" key={`empty-${i}`}>
                    <div className="cover empty-cover"></div>
                  </div>
                ))
              }
            </Slider>
          ) : (
            <div className="lists noFind">검색 결과가 없습니다.</div>
          )
        }
      </div>

      <div className="tv_wrapper">
        <h3>TV 프로그램</h3>
        {
          tvList && tvList.length > 0 ? (
            <Slider {...settings} className="lists">
              {tvList.map((item, idx) => (
                <div className="list" key={idx}>
                  <div className="cover">
                    <img src={`https://image.tmdb.org/t/p/w185${item.poster_path}`} alt={`${item.title} 포스터`}/>
                    <a href={`/tvDetail/${item.id}`}>
                      <div>
                        <button><FontAwesomeIcon icon={faBookmark} /></button>
                        <button><FontAwesomeIcon icon={faThumbsUp} /></button>
                      </div>
                      {item.providers && (
                        <ul>
                          {item.providers.map((provider, pidx) => {
                            const ott = ottInfos.find(info => info.key === provider.provider_id);
                            if (!ott) return null;

                            return (
                              <li key={pidx}>
                                <img src={require(`../images/${ott.label}.jpeg`)} alt={`${ott.label} 로고`} />
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </a>
                  </div>
                </div>
              ))}

              {/* 빈 슬롯 채우기 */}
              {
                tvList.length < sliderShow &&
                Array(sliderShow - tvList.length).fill(null).map((_, i) => (
                  <div className="list empty" key={`empty-${i}`}>
                    <div className="cover empty-cover"></div>
                  </div>
                ))
              }
            </Slider>
          ) : (
            <div className="lists noFind">검색 결과가 없습니다.</div>
          )
        }
      </div>
    </div>
  )
}

export default Search