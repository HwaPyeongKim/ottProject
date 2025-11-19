import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import jaxios from "../util/JWTUtil";

import "../style/list.css";
import "../style/search.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

function Discover() {
  const {keyword} = useParams();
  const loginUser = useSelector(state=>state.user);

  const [filters, setFilters] = useState({sortBy: "popularity.desc", genre: "", year: ""});
  const [searchResultsMovie, setSearchResultsMovie] = useState([]);
  const [searchResultsTV, setSearchResultsTV] = useState([]);
  const [discoverResultsMovie, setDiscoverResultsMovie] = useState([]);
  const [discoverResultsTV, setDiscoverResultsTV] = useState([]);
  const [combinedResults, setCombinedResults] = useState([]);

  const [likes, setLikes] = useState([]);

  const isFiltering = filters.genre !== "" || filters.year !== "" || filters.sortBy !== "popularity.desc";

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

  useEffect(
    () => {
      if (!keyword) return;
      const fetchSearchMovie = async () => {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?language=ko-KR&page=1&region=KR&query=${keyword}&api_key=${process.env.REACT_APP_KEY}`);
        const data = await res.json();
        const resultsWithType = (data.results || []).map(item => ({ ...item, media_type: 'movie' }));
        setSearchResultsMovie(resultsWithType);
      };
      fetchSearchMovie();
    }, [keyword]
  );

  useEffect(
    () => {
      if (!keyword) return;
      const fetchSearchTV = async () => {
        const res = await fetch(`https://api.themoviedb.org/3/search/tv?language=ko-KR&page=1&query=${keyword}&api_key=${process.env.REACT_APP_KEY}`);
        const data = await res.json();
        const resultsWithType = (data.results || []).map(item => ({ ...item, media_type: 'tv' }));
        setSearchResultsTV(resultsWithType);
      };
      fetchSearchTV();
    }, [keyword]
  );

  useEffect(
    () => {
      const fetchDiscoverMovie = async () => {
        const params = new URLSearchParams({api_key: process.env.REACT_APP_KEY, language: "ko-KR", region: "KR", sort_by: filters.sortBy});
        if (filters.genre) params.append("with_genres", filters.genre);
        if (filters.year) params.append("primary_release_year", filters.year);
        const res = await fetch(`https://api.themoviedb.org/3/discover/movie?${params.toString()}`);
        const data = await res.json();
        const resultsWithType = (data.results || []).map(item => ({ ...item, media_type: 'movie' }));
        setDiscoverResultsMovie(resultsWithType);
      };
      fetchDiscoverMovie();
    }, [filters]
  );

  useEffect(
    () => {
      const fetchDiscoverTV = async () => {
        const params = new URLSearchParams({api_key: process.env.REACT_APP_KEY, language: "ko-KR", sort_by: filters.sortBy});
        if (filters.genre) params.append("with_genres", filters.genre);
        if (filters.year) params.append("first_air_date_year", filters.year);
        const res = await fetch(`https://api.themoviedb.org/3/discover/tv?${params.toString()}`);
        const data = await res.json();
        const resultsWithType = (data.results || []).map(item => ({ ...item, media_type: 'tv' }));
        setDiscoverResultsTV(resultsWithType);
      };
      fetchDiscoverTV();
    }, [filters]
  );

  useEffect(
    () => {
      if (!keyword) {
        setCombinedResults([...discoverResultsMovie, ...discoverResultsTV]);
        return;
      }
      if (!isFiltering) {
        setCombinedResults([...searchResultsMovie, ...searchResultsTV]);
        return;
      }
      const movieIds = new Set(searchResultsMovie.map(m => m.id));
      const tvIds = new Set(searchResultsTV.map(t => t.id));
      const mergedMovie = discoverResultsMovie.filter(d => movieIds.has(d.id));
      const mergedTV = discoverResultsTV.filter(d => tvIds.has(d.id));
      setCombinedResults([...mergedMovie, ...mergedTV]);
    }, [searchResultsMovie, searchResultsTV, discoverResultsMovie, discoverResultsTV, keyword, filters]
  );

  async function like(id) {
    if (!loginUser || loginUser.midx === undefined) {
      alert("로그인 후 이용해주세요");
      return;
    }
    
    try {
        await jaxios.post("/api/main/like", {midx: loginUser.midx, dbidx: id});
        await getMyLikes(); 
    } catch (err) {
        console.error("좋아요 처리 중 에러 발생:", err);
        alert("좋아요 처리 중 오류가 발생했습니다.");
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

  return (
    <div>
      <ul className="filter">
        <li>개봉 년도</li>
        <li>장르</li>
        <li>평점</li>
        <li>연령 등급</li>
        <li className="reset"><button>초기화</button></li>
      </ul>

      <div className="lists searchList grid-8">
        {
          combinedResults.map((item,idx)=>{
            console.log(item);
            return (
              <div className="list" key={idx}>
                <div className="cover">
                  <img src={`https://image.tmdb.org/t/p/w185${item.poster_path}`} alt={`${item.title} 포스터`} onError={(e)=>{e.target.src="/images/noposter.png"}} />
                  <a href={`/${item.media_type}/detail/${item.id}`}>
                    <div>
                      {
                        loginUser && loginUser.midx ?
                        <>
                          <button onClick={()=>{}}><FontAwesomeIcon icon={faBookmark} /></button>
                          <button className={`like${likes.includes(item.id) ? " on" : ""}`} onClick={(e)=>{e.preventDefault(); like(item.id);}}><FontAwesomeIcon icon={faThumbsUp} /></button>
                        </>
                        : null
                      }
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
      </div>
    </div>
  )
}

export default Discover