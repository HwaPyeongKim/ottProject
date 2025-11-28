import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Navigation } from 'swiper/modules';
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from "axios";
import jaxios from "../../util/JWTUtil";
import Review from "../Review";
import { ottInfos } from "../../constants/ottInfos";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faBookmark, faThumbsUp, faArrowLeft, faArrowRight, faPlay, faCheck } from "@fortawesome/free-solid-svg-icons";

import "../../style/detail.css";

function Season() {
  const baseUrl = "https://api.themoviedb.org/3/tv";
  
  const loginUser = useSelector(state=>state.user);
  const {id} = useParams();
  const {snum} = useParams();
  const [item, setItem] = useState({});
  const [season, setSeason] = useState({});
  const [average, setAverage] = useState(0);
  const [imdb, setImdb] = useState("");
  const [likeCount , setLikeCount] = useState(0);
  const [likeOn, setLikeOn] = useState(false);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [isIncludeList, setIsIncludeList] = useState(false);
  const [myList, setMyList] = useState([]);
  const [selectedLists, setSelectedLists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddListModal, setIsAddListModal] = useState(false);
  const [listTitle, setListTitle] = useState("");
  const [security, setSecurity] = useState("N");

  function AverageRating({ avgScore }) {
    const stars = [1, 2, 3, 4, 5];

    // 별 아이콘 결정 함수
    const getStarIcon = (star) => {
      if (avgScore >= star) return solidStar;
      else if (avgScore >= star - 0.5) return faStarHalfAlt;
      else return regularStar;
    };

    return (
      <>
        {stars.map((star) => (
          <FontAwesomeIcon key={star} icon={getStarIcon(star)} />
        ))}
        <small> ({avgScore.toFixed(1)} / 5)</small>
      </>
    );
  };

  const countryMap = {
    "KR": "한국",
    "JP": "일본",
    "US": "미국",
    "GB": "영국",
    "FR": "프랑스",
    "DE": "독일",
    "CN": "중국",
    "IT": "이탈리아",
    "CA": "캐나다",
    "AU": "호주",
    "ES": "스페인",
    "IN": "인도",
    "RU": "러시아",
    "BR": "브라질",
    "MX": "멕시코",
    "SE": "스웨덴",
    "NL": "네덜란드",
    "BE": "벨기에",
    "DK": "덴마크",
    "FI": "핀란드",
    "NO": "노르웨이",
    "NZ": "뉴질랜드",
    "AR": "아르헨티나",
    "TR": "터키",
    "TH": "태국",
    "SG": "싱가포르"
  };

  const YouTubeVideo = ({videoKey}) => (
    <iframe
      height="180"
      src={`https://www.youtube.com/embed/${videoKey}`}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );

  function formatRuntime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins}분`;
    if (mins === 0) return `${hours}시간`;
    return `${hours}시간 ${mins}분`;
  }

  function getOttUrl(link, title) {
    if (!link) return null;
    const query = encodeURIComponent(title);
    return `${link}${query}`;
  };

  async function findItem() {
    try {
      const {data} = await axios.get(`${baseUrl}/${id}`, {
        params: {
          api_key: process.env.REACT_APP_KEY,
          language: "ko-KR",
          region: "KR",
          append_to_response: "videos,similar,recommendations,content_ratings,watch/providers,external_ids"
        }
      });

      const omdbData = await axios.get(`http://www.omdbapi.com/?i=${data.external_ids.imdb_id}&apikey=${process.env.REACT_APP_OMDB_KEY}`);
      const ratingData = omdbData.data?.Ratings || [];
      setImdb(ratingData.find(r => r.Source === "Internet Movie Database")?.Value || "Unknown");

      // 연령 등급
      data.age = "Unknown"
      if (data.content_ratings?.results) {
        const krRelease = data.content_ratings.results.find(r => r.iso_3166_1 === "KR");
        if (krRelease) {
          data.age = krRelease.rating;
        }
      }

      setItem(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function findSeason() {
    try {
      const {data} = await axios.get(`${baseUrl}/${id}/season/${snum}`, {
        params: {
          api_key: process.env.REACT_APP_KEY,
          language: "ko-KR",
          watch_region: "KR",
          append_to_response: "videos,credits,watch/providers"
        }
      });

      // OTT 정보
      data.providers = [];
      if (data["watch/providers"]?.results?.KR) {
        data.providers = data["watch/providers"].results.KR;
      }

      // 출연진 및 감독
      data.cast = [];
      data.writing = [];
      if (data.credits) {
        const sortedCast = data.credits.cast.sort((a, b) => a.order - b.order);
        for (let i = 0; i < sortedCast.length && i < 20; i++) {
          if (sortedCast[i].known_for_department === "Acting") {
            data.cast.push(sortedCast[i]);
          }
        }

        if (data.writing.length === 0) {
          for (let crew of data.credits.crew) {
            if (crew.job === "Executive Producer" || crew.department === "Writing") {
              data.writing.push(crew);
            }
          }
        }
      }

      // 예고편
      if (data.videos?.results?.length > 0) {
        data.videos = data.videos.results.filter(v => v.site === "YouTube");
      }
      
      console.log(data);

      setSeason(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function getAverage() {
    try {
      const result = await axios.get("/api/review/getAverage", {params: {dbidx: id, season: snum}});
      if (result.data !== undefined && result.data.average !== undefined) {
        setAverage(result.data.average);
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

  async function getMyDblists() {
    try {
      const result = await jaxios.get("/api/main/getMyDblists", {params: {midx: loginUser.midx}});
      if (result.data !== undefined && result.data.list !== undefined) {
        setIsIncludeList(result.data.list.some(item => item.dbidx === Number(id)));
      }
    } catch (err) {
      console.error(err);
    }
  }

  function addMyList(item) {
    if (selectedLists.length === 0) {
      alert("추가할 리스트를 선택해주세요.");
      return;
    }

    jaxios.post("/api/main/addLists", {listidxs: selectedLists, dbidx: item.id, posterpath: item.poster_path, title: item.name, type: "tv"})
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

  function like() {
    if (!loginUser?.midx) {
      alert("로그인이 필요한 서비스 입니다");
      return;
    }

    jaxios.post("/api/main/like", {midx: loginUser.midx, dbidx: id, season: snum})
    .then((result)=>{
      getLikes();
    })
    .catch((err)=>{console.error(err);})
  }

  async function getLikes() {
    try {
      if (!loginUser || loginUser.midx === undefined) {
        const likes = await axios.get("/api/main/getLikes", {params: {dbidx: id, season: snum}});
        setLikeCount(likes.data.count);
      } else {
        const likes = await axios.get("/api/main/getLikes", {params: {dbidx: id, midx: loginUser.midx, season: snum}});
        setLikeCount(likes.data.count);
        if (likes.data.likes) {
          setLikeOn(true);
        } else {
          setLikeOn(false);
        }
      }

    } catch (err) {
      console.error(err);
    }
  }

  useEffect(
    ()=>{
      findItem();
      findSeason();
      getAverage();
      getLikes();
    },[]
  )

  useEffect(
    () => {
      if (loginUser?.midx) {
        getMyLists();
        getMyDblists();
      }
    }, [loginUser]
  );

  return (
    <section className="content_info">
      <div className="top" style={{backgroundImage: `linear-gradient(to right, rgba(6, 13, 23, 1) 0%, rgba(6, 13, 23, 1) 58%, rgba(6, 13, 23, 0) 100%), url(https://image.tmdb.org/t/p/w780${item.backdrop_path})`}}>
        <h2>{item.name} - {season.name} <span>[{season.air_date ? season.air_date.substr(0,4) : null}]</span></h2>
        <p>원제 : {item.original_name}</p>
        <div>
          <span className="star">평점 : <AverageRating avgScore={average} /></span>
          <ul>
            {
              item.genres ?
              item.genres.map((genre, gidx)=>{
                return (
                  <li key={gidx}>{genre.name}</li>
                )
              })
              : null
            }
          </ul>
          <p className="oneline">{item.tagline}</p>
        </div>
      </div>

      <div className="bottom">
        <div className="left">

          <div className="synop_pro">
            <div className="synopsis">
              <h3>시놉시스</h3>
              {
                season.overview ? <p>{season.overview}</p> : <div className="noFind">시놉시스 정보를 찾을 수 없습니다.</div>
              }
            </div>

            <div className="providers">
              <h3>지금 시청하기</h3>
              {
                season.providers ? (
                  (() => {
                    const types = [
                      { key: "buy", label: "구매" },
                      { key: "rent", label: "대여" },
                      { key: "flatrate", label: "구독" },
                    ];

                    const providerMap = {};

                    types.forEach((type) => {
                      const list = season.providers[type.key] ?? [];
                      list.forEach((provider) => {
                        const id = provider.provider_id;

                        if (!providerMap[id]) {
                          providerMap[id] = {
                            provider,
                            types: []
                          };
                        }

                        providerMap[id].types.push(type.label); // 구매/대여/구독 추가
                      });
                    });

                    const providerList = Object.values(providerMap);

                    if (providerList.length === 0) {
                      return <div className="noFind">시청할 수 있는 OTT가 없습니다.</div>;
                    }

                    return (
                      <ul className="providerList">
                        {providerList.map((entry, idx) => {
                          const provider = entry.provider;
                          const typesText = entry.types.join(" / ");

                          const ottInfo = ottInfos.find((o) => o.key === provider.provider_id);
                          const url = ottInfo ? getOttUrl(ottInfo.link, item.title) : "#";

                          return (
                            <li key={idx} className="providerItem">
                              {ottInfo ? (
                                <img src={`/images/${ottInfo.label}.jpeg`} alt={`${provider.provider_name} 로고`} />
                              ) : (
                                <span>{provider.provider_name}</span>
                              )}
                              <span className="types">{typesText}</span>
                              <a href={url} target="_blank" className="mainButton"><FontAwesomeIcon icon={faPlay} /> 지금 시청하기</a>
                            </li>
                          );
                        })}
                      </ul>
                    );
                  })()
                ) : (
                  <div className="noFind">시청할 수 있는 OTT가 없습니다.</div>
                )
              }
            </div>
          </div>

          <div className="episodes">
            <h3>에피소드</h3>
            <div>
              {
                season.episodes && season.episodes.length > 0 ?
                (
                  <>
                    {!expanded && (
                      <p className="episodeCount">총 {season.episodes.length}개의 에피소드가 있습니다.</p>
                    )}
                     <ul className={`${expanded ? "show" : "hide"}`}>
                      {season.episodes.map((episode, eidx) => (
                        <li key={eidx}>
                          <img src={`https://image.tmdb.org/t/p/w185${episode.still_path}`} alt={`${episode.episode_number} 스틸컷`} onError={(e)=>{e.target.src="/images/noStill.png"}} />
                          <div>
                            <p>시즌 {snum} {episode.episode_number}화 - {episode.name} <span>({formatRuntime(episode.runtime)})</span></p>
                            <p>{episode.overview}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="expand mainButton" onClick={()=>setExpanded(prev => !prev)}>{expanded ? "접기" : "펼쳐보기"}</div>
                  </>
                ) : (
                  <div className="noFind">관련 영상이 없습니다.</div>
                )
              }
            </div>
          </div>

          <div className="video">
            <h3>영상</h3>
            <div>
              {season.videos && season.videos.length > 0 ? (
                <>
                  <Swiper
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView={4}
                    slidesPerGroup={4}
                    onInit={(swiper) => {
                      // 커스텀 버튼 연결
                      swiper.params.navigation.prevEl = prevRef.current;
                      swiper.params.navigation.nextEl = nextRef.current;
                      swiper.navigation.init();
                      swiper.navigation.update();
                    }}
                  >
                    {season.videos.map((video, idx) => (
                      <SwiperSlide key={idx}><YouTubeVideo videoKey={video.key} /></SwiperSlide>
                    ))}
                    <button className="swiper-button-prev" ref={prevRef}><FontAwesomeIcon icon={faArrowLeft} /></button>
                    <button className="swiper-button-next" ref={nextRef}><FontAwesomeIcon icon={faArrowRight} /></button>
                  </Swiper>
                </>
              ) : (
                <div className="noFind">관련 영상이 없습니다.</div>
              )}
            </div>
          </div>

          <div className="cast">
            <h3>출연진</h3>
            <div>
              {
                season.cast && season.cast.length > 0 ? (
                  <>
                    <Swiper
                      modules={[Navigation]}
                      spaceBetween={10}
                      slidesPerView={5}
                      slidesPerGroup={5}
                      onInit={(swiper) => {
                        // 커스텀 버튼 연결
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                        swiper.navigation.init();
                        swiper.navigation.update();
                      }}
                    >
                      {season.cast.map((cast, idx) => (
                        <SwiperSlide className="profile" key={idx}>
                          <div>
                            <div className="image_wrapper">
                              <img src={`https://image.tmdb.org/t/p/w92${cast.profile_path}`} alt={`${cast.name} 프로필 사진`} onError={(e)=>{e.target.src="/images/noImage.png"}} />
                            </div>
                            <p>{cast.name}</p>
                            <p>{cast.character} 역</p>
                          </div>
                        </SwiperSlide>
                      ))}
                      <button className="swiper-button-prev" ref={prevRef}><FontAwesomeIcon icon={faArrowLeft} /></button>
                      <button className="swiper-button-next" ref={nextRef}><FontAwesomeIcon icon={faArrowRight} /></button>
                    </Swiper>
                  </>
                ) : (
                  <div className="noFind">출연진 정보를 조회할 수 없습니다.</div>
                )
              }
            </div>
          </div>

          <div className="review">
            <Review dbidx={id} season={snum} refreshAverage={getAverage} title={item.name} posterpath={item.poster_path} type="tv" />
          </div>
        </div>

        <div className="right">
          <div className="movieInfo">
            <h3>영화 정보</h3>
            <ul>
              <li className="poster">
                <div>
                  <img src={`https://image.tmdb.org/t/p/w154${season.poster_path}`} alt={`${item.name} 포스터`} />
                  <div className="ratings">
                    <h4>평점</h4>
                    <p><AverageRating avgScore={average} /></p>
                    <p><img src="/images/imdb.png" alt="imdb 점수" /><small>{imdb}</small></p>
                  </div>
                </div>
                <div>
                  <button className={`buttonHover ${isIncludeList ? "on" : ""}`} onClick={()=>{favorite()}}><FontAwesomeIcon icon={faBookmark} /></button>
                  <button className={`buttonHover ${likeOn ? "on" : ""}`} onClick={()=>{like()}}><FontAwesomeIcon icon={faThumbsUp} /><small>{likeCount}</small></button>
                </div>
              </li>
              <li className="directors">
                <h4>감독</h4>
                {
                  season.writing && season.writing.length > 0 ?
                  season.writing.map((writing, didx)=> {
                    return (
                      <p key={didx}>{writing.name}</p>
                    )
                  })
                  : <p>Unknown</p>
                }
              </li>
              <li>
                <h4>장르</h4>
                {
                  item.genres && item.genres.length > 0 ?
                  item.genres.map((genre, gidx)=>{
                    return (
                      <span key={gidx}>{gidx > 0 && ', '}{genre.name}</span>
                    )
                  })
                  : null
                }
              </li>
              <li>
                <h4>연령 등급</h4>
                <p>{item.age}</p>
              </li>
              <li>
                <h4>제작 국가</h4>
                <p>
                  {
                      item.production_countries && item.production_countries.length > 0 ? 
                      item.production_countries.map((production_countrie, pidx)=>{
                        return (
                          <span key={pidx}>{pidx > 0 && ', '}{countryMap[production_countrie.iso_3166_1]}</span>
                        )
                      })
                      : <span>Unknown</span>
                    }
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modalOverlay" onClick={() => setIsModalOpen(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>리스트에 추가</h3>
            <ul>
              {
                myList.length > 0 ? 
                  myList.map((mylist, lidx) => {
                    return (
                      <li key={lidx} className="checkboxWrap selectList">
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
              <button className="mainButton" onClick={()=>{addMyList(item)}}>추가하기</button>
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
    </section>
  )
}

export default Season