import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import jaxios from "../util/JWTUtil";
import Slider from "react-slick";
import ListCard from "./ListCard";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

import "../style/list.css";

function Search() {
  const {keyword} = useParams();
  const loginUser = useSelector(state=>state.user);

  const [sliderShow, setSliderShow] = useState(8);
  const [movieList, setMovieList] = useState([]);
  const [tvList, setTvList] = useState([]);
  const [likes, setLikes] = useState([]);

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

  useEffect(
    ()=>{
      findMovies(keyword);
      findTvs(keyword);
      if (loginUser && loginUser.midx > 0) {
        getMyLikes();
      }
    },[keyword]
  )

  return (
    <div>
      <h2>{keyword} 검색 결과</h2>
      <div className="movie_wrapper">
        <h3>영화</h3>
        <ListCard lists={movieList} target="movie" likes={likes} setLikes={setLikes} />
      </div>

      <div className="tv_wrapper">
        <h3>TV 프로그램</h3>
        <ListCard lists={tvList} target="tv" likes={likes} setLikes={setLikes} />
      </div>
    </div>
  )
}

export default Search