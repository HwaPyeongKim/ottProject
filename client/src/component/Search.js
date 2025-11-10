import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";

import "../style/list.css";

function Search() {
  const {keyword} = useParams();

  const [movieList, setMovieList] = useState([]);
  const [tvList, setTvList] = useState([]);

  async function findMovies (keyword) {
    const baseUrl = "https://api.themoviedb.org/3";
    try {
      const result = await axios.get(`${baseUrl}/search/movie?language=ko-KR&page=1&api_key=${process.env.REACT_APP_KEY}&query=${keyword}`);
      if (result.data) {
        setMovieList(result.data);
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
        setTvList(result.data);
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
        
      </div>
    </div>
  )
}

export default Search