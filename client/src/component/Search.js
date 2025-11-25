import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import jaxios from "../util/JWTUtil";

import "../style/list.css";
import "../style/search.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faThumbsUp, faCheck } from "@fortawesome/free-solid-svg-icons";

function Search() {
  const {keyword} = useParams();
  const loginUser = useSelector(state=>state.user);
  const [filters, setFilters] = useState({sortBy: "popularity.desc", genre: "", year: "", certification: ""});
  const [tempFilters, setTempFilters] = useState({sortBy: "popularity.desc", genre: "", year: "", certification: ""});
  const [searchResultsMovie, setSearchResultsMovie] = useState([]);
  const [searchResultsTV, setSearchResultsTV] = useState([]);
  const [discoverResultsMovie, setDiscoverResultsMovie] = useState([]);
  const [discoverResultsTV, setDiscoverResultsTV] = useState([]);
  const [combinedResults, setCombinedResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [likes, setLikes] = useState([]);

  const [favorites, setFavorites] = useState([]);
  const [selectedLists, setSelectedLists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddListModal, setIsAddListModal] = useState(false);
  const [listTitle, setListTitle] = useState("");
  const [security, setSecurity] = useState("N");
  const [myList, setMyList] = useState([]);
  const [selected, setSelected] = useState({});

  const [pageMovie, setPageMovie] = useState(1);
  const [pageTV, setPageTV] = useState(1);
  const [hasMoreMovie, setHasMoreMovie] = useState(true);
  const [hasMoreTV, setHasMoreTV] = useState(true);

  const isFiltering = filters.genre !== "" || filters.year !== "" || filters.certification !== "" || filters.sortBy !== "popularity.desc";
  
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

  useEffect(() => {
    if (!keyword) return;

    const fetchMovie = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?language=ko-KR&page=${pageMovie}&region=KR&query=${keyword}&api_key=${process.env.REACT_APP_KEY}`);
        const data = await res.json();
        if (data.results?.length === 0) setHasMoreMovie(false);

        const resultsWithType = (data.results || []).map((item) => ({ ...item, media_type: "movie" }));
        setSearchResultsMovie(prev => pageMovie === 1 ? resultsWithType : [...prev, ...resultsWithType]);
      } catch (err) {
        console.error("영화 검색 실패:", err);
      }
    };

    fetchMovie();
  }, [keyword, pageMovie]);

  useEffect(() => {
    if (!keyword) return;

    const fetchTV = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/search/tv?language=ko-KR&page=${pageTV}&query=${keyword}&api_key=${process.env.REACT_APP_KEY}`);
        const data = await res.json();
        if (data.results?.length === 0) setHasMoreTV(false);

        const resultsWithType = (data.results || []).map((item) => ({ ...item, media_type: "tv" }));
        setSearchResultsTV(prev => pageTV === 1 ? resultsWithType : [...prev, ...resultsWithType]);
      } catch (err) {
        console.error("TV 검색 실패:", err);
      }
    };

    fetchTV();
  }, [keyword, pageTV]);

  useEffect(
    () => {
      const fetchDiscoverMovie = async () => {
        try {
          const params = new URLSearchParams({api_key: process.env.REACT_APP_KEY, language: "ko-KR", region: "KR", sort_by: filters.sortBy});
          if (filters.genre) params.append("with_genres", filters.genre);
          if (filters.year) params.append("primary_release_year", filters.year);
          if (filters.certification) {
            params.append("certification_country", "KR");
            params.append("certification.lte", filters.certification);
          }
          const res = await fetch(`https://api.themoviedb.org/3/discover/movie?${params.toString()}`);
          const data = await res.json();
          const resultsWithType = (data.results || []).map((item) => ({...item, media_type: "movie"}));
          setDiscoverResultsMovie(resultsWithType);
        } catch (err) {
          console.error("Discover 영화 실패:", err);
        }
      };
      fetchDiscoverMovie();
    }, [filters]
  );

  useEffect(
    () => {
      const fetchDiscoverTV = async () => {
        try {
          const params = new URLSearchParams({api_key: process.env.REACT_APP_KEY, language: "ko-KR", sort_by: filters.sortBy});
          if (filters.genre) params.append("with_genres", filters.genre);
          if (filters.year) params.append("first_air_date_year", filters.year);
          const res = await fetch(`https://api.themoviedb.org/3/discover/tv?${params.toString()}`);
          const data = await res.json();
          const resultsWithType = (data.results || []).map((item) => ({...item, media_type: "tv"}));
          setDiscoverResultsTV(resultsWithType);
        } catch (err) {
          console.error("Discover TV 실패:", err);
        }
      };
      fetchDiscoverTV();
    }, [filters]
  );

  useEffect(
    () => {
      let results = [];
      if (!keyword) {
        results = [...discoverResultsMovie, ...discoverResultsTV];
      } else {
        results = [...searchResultsMovie, ...searchResultsTV];
        if (isFiltering) {
          results = results.filter((item) => {
            // 장르 필터
            if (filters.genre) {
              const genres = filters.genre.split(",").map(Number);
              if (!item.genre_ids?.some((g) => genres.includes(g))) return false;
            }
            // 연도 필터
            if (filters.year) {
              const year = item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4);
              if (year !== filters.year) return false;
            }
            // 인증 등급 필터
            if (filters.certification && item.media_type === "movie") {
              if (filters.certification === "19" && !item.adult) return false; // 청불 필터
              if (filters.certification !== "19" && item.adult) return false; // 미청불 필터
            }
            return true;
          });
        }
      }
      setCombinedResults(results);
    }, [searchResultsMovie, searchResultsTV, discoverResultsMovie, discoverResultsTV, filters, keyword, isFiltering]
  );

  useEffect(() => {
    const handleScroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        if (hasMoreMovie) setPageMovie(prev => prev + 1);
        if (hasMoreTV) setPageTV(prev => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMoreMovie, hasMoreTV]);

  async function like(id) {
    if (!loginUser?.midx) {
      alert("로그인이 필요한 서비스 입니다");
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

  function favorite() {
    if (!loginUser?.midx) {
      alert("로그인이 필요한 서비스 입니다");
      return;
    }
    
    setIsModalOpen(true);
  }

  async function getMyLists() {
    try {
      const result = await jaxios.get("/api/member/getList", {params: {midx: loginUser.midx}});
      setMyList(result.data.myList);
    } catch (err) {
      console.error(err);
    }
  }

  function addList() {
    jaxios.post("/api/main/addList", {title: listTitle, security, midx: loginUser.midx})
    .then((result) => {
      if (result.data.msg === "ok") {
        alert("리스트가 추가되었습니다");
        setIsAddListModal(false);
        setIsModalOpen(false);
        setListTitle("");
        setSecurity("N");
        getMyLists();
      } else {
        alert(result.data.msg);
      }
    })
    .catch((err) => {
      console.error(err);
    });
  }

  function addMyList(item) {
    if (selectedLists.length === 0) {
      alert("추가할 리스트를 선택해주세요");
      return;
    }

    if (item == null) {
      alert("추가할 콘텐츠를 선택해주세요");
      return;
    }

    jaxios.post("/api/main/addLists", {listidxs: selectedLists, dbidx: item.id})
    .then((result)=>{
      if (result.data.msg === "ok") {
        alert("리스트를 추가했습니다");
        getMyDblists();
      } else {
        alert(result.data.msg);
      }
    })
    .catch((err)=>{console.error(err);})

    setIsModalOpen(false);
    setSelectedLists([]);
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

  const handleGenreChange = () => {
    const genreCheckboxes = document.querySelectorAll(".genre:checked");

    const genreValues = Array.from(genreCheckboxes)
      .flatMap((checkbox) => checkbox.value.split(","))
      .filter((v) => v !== "");
    const uniqueGenres = [...new Set(genreValues)];
    const genreString = uniqueGenres.join(",");

    setTempFilters((prev) => ({ ...prev, genre: genreString }));
  };

  const handlePClick = (index) => {setActiveIndex(prev => (prev === index ? null : index));};

  const resetFilters = () => {
    setTempFilters({
      sortBy: "popularity.desc",
      genre: "",
      year: "",
      certification: "",
      minRating: "",
      maxRating: ""
    });

    // 체크박스 초기화
    const checkboxes = document.querySelectorAll(".genre");
    checkboxes.forEach(cb => cb.checked = false);

    // 라디오 초기화
    const radios = document.querySelectorAll('input[name="certification"]');
    radios.forEach(radio => radio.checked = radio.value === "");
  };

  const applyFilter = () => {
    setFilters(tempFilters); // 여기서만 실제 필터 적용
    setPageMovie(1);
    setPageTV(1);
  };

  useEffect(() => {
    setPageMovie(1);
    setPageTV(1);
  }, [keyword]);

  useEffect(
    () => {
      if (loginUser?.midx) {
        getMyLikes();
        getMyLists();
        getMyDblists();
      }
    }, [loginUser]
  );
  

  return (
    <div>
      <h2>{keyword} 검색 결과</h2>
      <ul className="filter">
        <li>
          <p className={activeIndex === 0 ? "on" : ""} onClick={() => handlePClick(0)}>개봉 년도</p>
          <div className={`yearWrap ${activeIndex === 0 ? "on" : ""}`}>
            <label htmlFor="yearFilter">개봉년도</label>
            <input type="number" min="1900" max="2100" onChange={(e) =>setTempFilters(prev => ({ ...prev, year: e.target.value }))} id="yearFilter" />
          </div>
        </li>
        <li>
          <p className={activeIndex === 1 ? "on" : ""} onClick={() => handlePClick(1)}>장르</p>
          <div className={activeIndex === 1 ? "on" : ""}>
            <ul className="grid-2 genreWrap" onChange={handleGenreChange}>
              {[
                { id: "genre_ani", label: "애니메이션", value: "16" },
                { id: "genre_comedy", label: "코미디", value: "35" },
                { id: "genre_crime", label: "범죄", value: "80" },
                { id: "genre_docu", label: "다큐멘터리", value: "99" },
                { id: "genre_drama", label: "드라마", value: "18" },
                { id: "genre_family", label: "가족", value: "10751" },
                { id: "genre_mystery", label: "미스터리", value: "9648" },
                { id: "genre_western", label: "서부", value: "37" },
                { id: "genre_action", label: "액션", value: "28,12,10759" },
                { id: "genre_fantasy", label: "판타지", value: "14,10765" },
                { id: "genre_history", label: "역사", value: "36" },
                { id: "genre_horror", label: "호러", value: "27" },
                { id: "genre_music", label: "음악", value: "10402" },
                { id: "genre_romance", label: "로맨스", value: "10749" },
                { id: "genre_sf", label: "SF", value: "878" },
                { id: "genre_thriller", label: "스릴러", value: "53" },
                { id: "genre_war", label: "전쟁", value: "10752,10768" },
                { id: "genre_kids", label: "키즈", value: "10762" },
                { id: "genre_news", label: "뉴스", value: "10763" },
                { id: "genre_reality", label: "리얼리티", value: "10764" },
                { id: "genre_talk", label: "토크쇼", value: "10767" }
              ].map((genre) => (
                <li key={genre.id}>
                  <input type="checkbox" className="genre" id={genre.id} value={genre.value} />
                  <label htmlFor={genre.id}>{genre.label} <span><FontAwesomeIcon icon={faCheck} /></span></label>
                </li>
              ))}
            </ul>
          </div>
        </li>
        <li>
          <p className={activeIndex === 2 ? "on" : ""} onClick={() => handlePClick(2)}>연령 등급</p>
          <div className={activeIndex === 2 ? "on" : ""}>
            <ul className="certificationWrap">
              {[
                { id: "cert_all", label: "전체", value: "" },
                { id: "cert_7", label: "7세 관람가", value: "7" },
                { id: "cert_12", label: "12세 관람가", value: "12" },
                { id: "cert_15", label: "15세 관람가", value: "15" },
                { id: "cert_19", label: "청소년 관람불가", value: "19" }
              ].map((cert) => (
                <li key={cert.id}>
                  <input type="radio" id={cert.id} name="certification" value={cert.value} checked={filters.certification === cert.value} onChange={(e) => setTempFilters((prev) => ({ ...prev, certification: e.target.value }))} />
                  <label htmlFor={cert.id}>{cert.label} <span><FontAwesomeIcon icon={faCheck} /></span></label>
                </li>
              ))}
            </ul>
          </div>
        </li>
        {/* <li>
          <p className={activeIndex === 3 ? "on" : ""} onClick={() => handlePClick(3)}>평점</p>
          <div className={activeIndex === 3 ? "on" : ""}></div>
        </li> */}
        <li className="applyFilter"><button onClick={applyFilter} className="reset">필터적용</button></li>
        <li className="reset"><button onClick={resetFilters}>초기화</button></li>
      </ul>

      <div className="lists searchList grid-8">
        {
          combinedResults.map((item,idx)=>{
            return (
              <div className="list" key={idx}>
                <div className="cover">
                  <img src={`https://image.tmdb.org/t/p/w185${item.poster_path}`} alt={`${item.title} 포스터`} onError={(e)=>{e.target.src="/images/noposter.png"}} />
                  <a href={`/${item.media_type}/detail/${item.id}`}>
                    <div>
                      {
                        loginUser && loginUser.midx ?
                        <>
                          <button className={`favorite${favorites.includes(item.id) ? " on" : ""}`} onClick={(e)=>{e.preventDefault(); favorite(); setSelected(item)}}><FontAwesomeIcon icon={faBookmark} /></button>
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

      {isModalOpen && (
        <div className="modalOverlay" onClick={() => setIsModalOpen(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>리스트에 추가 <small>({selected.title ? selected.title : (selected.name ? selected.name : "")})</small></h3>
            <ul>
              {
                myList.length > 0 ? 
                  myList.map((mylist, lidx) => {
                    return (
                      <li key={lidx} className="checkboxWrap">
                        <input type="checkbox" value={mylist.listidx} id={`mylist_${mylist.listidx}`} onChange={(e)=>{const value = parseInt(e.target.value); if (e.target.checked) {setSelectedLists(prev => [...prev, value]);} else {setSelectedLists(prev => prev.filter(id => id !== value));}}} />
                        <label className="flex" htmlFor={`mylist_${mylist.listidx}`}><p>{mylist.title}</p> <b><FontAwesomeIcon icon={faCheck} /></b></label>
                      </li>
                    )
                  })
                : null
              }
              <li className="flex"><p>리스트 새로 만들기</p><button onClick={()=>{setIsAddListModal(true)}}>+</button></li>
            </ul>
            <div className="buttonWrap">
              <button className="mainButton" onClick={()=>{addMyList(selected)}}>추가하기</button>
              <button className="mainButton" onClick={()=>setIsModalOpen(false)}>닫기</button>
            </div>
          </div>
        </div>
      )}

      {isAddListModal && (
        <div className="modalOverlay" onClick={() => setIsAddListModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>리스트 추가</h3>
            <div>
              <input type="text" value={listTitle} onChange={(e)=>{setListTitle(e.currentTarget.value)}} />
              <div className="checkboxWrap">
                <input type="checkbox" value={security} onChange={(e)=>setSecurity(e.target.checked ? "Y" : "N")} id="checkbox_security" />
                <label htmlFor="checkbox_security" className="flex"><p>리스트 노출 여부</p> <b><FontAwesomeIcon icon={faCheck} /></b></label>
              </div>
            </div>
            <div className="buttonWrap">
              <button className="mainButton" onClick={()=>{addList()}}>추가하기</button>
              <button className="mainButton" onClick={()=>setIsAddListModal(false)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search