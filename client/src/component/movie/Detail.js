import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Navigation } from 'swiper/modules';
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from "axios";
import jaxios from "../../util/JWTUtil";
import dayjs from "dayjs";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faBookmark, faThumbsUp, faArrowLeft, faArrowRight, faPlay, faStar } from "@fortawesome/free-solid-svg-icons";

import "../../style/detail.css";


function Detail() {
  const baseUrl = "https://api.themoviedb.org/3/movie";

  const loginUser = useSelector(state=>state.user);
  const {id} = useParams();
  const [item, setItem] = useState({});
  const [content, setContent] = useState("");
  const [reviewLists, setReviewLists] = useState([]);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(0);

  const handleClick = (starIndex, isHalf) => {
    const newScore = isHalf ? starIndex - 0.5 : starIndex;
    setScore(newScore);
  };

  const getStarIcon = (starIndex) => {
    const current = hover || score;
    if (current >= starIndex) return solidStar;
    if (current >= starIndex - 0.5) return faStarHalfAlt;
    return regularStar;
  };

  function StarRating() {
    return (
      <div style={{ display: "flex", flexDirection: "row", fontSize: "24px" }}>
        {[1,2,3,4,5].map((star) => (
          <div key={star} style={{ position: "relative", marginRight: "4px" }}>
            <div
              onMouseEnter={() => setHover(star - 0.5)}
              onMouseLeave={() => setHover(0)}
              onClick={() => handleClick(star, true)}
              style={{
                position: "absolute",
                width: "50%",
                height: "100%",
                left: 0,
                top: 0,
                cursor: "pointer",
                zIndex: 1,
              }}
            />

            <div
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => handleClick(star, false)}
              style={{
                position: "absolute",
                width: "50%",
                height: "100%",
                right: 0,
                top: 0,
                cursor: "pointer",
                zIndex: 1,
              }}
            />
            <FontAwesomeIcon icon={getStarIcon(star)} style={{ color: "#f39c12" }} />
          </div>
        ))}
      </div>
    );
  }

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
  }

  // async function findItem (id) {
  //   try {
  //     const result = await axios.get(`${baseUrl}/${id}?language=ko-KR&region=KR&api_key=${process.env.REACT_APP_KEY}`);
  //     if (result.data.adult === true) {
        
  //     }
  //     // OTT 정보
  //     result.data.providers = [];
  //     const providers = await axios.get(`${baseUrl}/${id}/watch/providers?api_key=${process.env.REACT_APP_KEY}`);
  //     if (providers.data.results && providers.data.results["KR"]) {
  //       result.data.providers = providers.data.results["KR"];
  //     }
  //     // 출연진 및 제작진
  //     const credits = await axios.get(`${baseUrl}/${id}/credits?api_key=${process.env.REACT_APP_KEY}`);
  //     result.data.director = {};
  //     result.data.cast = [];
  //     // 주연배우
  //     const sorted = credits.data.cast.sort(
  //       (a, b) => new Date(a.order) - new Date(b.order)
  //     );
  //     for (let i=0; i<credits.data.cast.length; i++) {
  //       let data = credits.data.cast[i];
  //       if (data.known_for_department === "Acting") {
  //         result.data.cast.push(data);
  //       }
  //       if (i === 19) break;
  //     }
  //     // 감독
  //     for (let i=0; i<credits.data.crew.length; i++) {
  //       let data = credits.data.crew[i];
  //       if (data.job === "Director") {
  //         result.data.director = data;
  //         break;
  //       }
  //     }

  //     // 예고편 및 관련 비디오 정보
  //     result.data.videos = [];
  //     const videos = await axios.get(`${baseUrl}/${id}/videos?api_key=${process.env.REACT_APP_KEY}`);
  //     for (let i=0; i<videos.data.results.length; i++) {
  //       let data = videos.data.results[i];
  //       if (data.site === "YouTube") {
  //         result.data.videos.push(data);
  //       }
  //     }

  //     //연령 등급
  //     result.data.release_dates = {};
  //     const release_dates = await axios.get(`${baseUrl}/${id}/release_dates?api_key=${process.env.REACT_APP_KEY}`);
  //     for (let i=0; i<release_dates.data.results.length; i++) {
  //       let data = release_dates.data.results[i];
  //       if (data.iso_3166_1 === "KR") {
  //         const sorted = data.release_dates.sort(
  //           (a, b) => new Date(b.release_date) - new Date(a.release_date)
  //         );
  //         result.data.release_dates = data.release_dates;
  //         break;
  //       }
  //     }

  //     result.data.recommendations = [];
  //     const recommendations = await axios.get(`${baseUrl}/${id}/recommendations?language=ko-KR&region=KR&api_key=${process.env.REACT_APP_KEY}`);
  //     if (recommendations.data && recommendations.data.results.length > 0) {
  //       result.data.recommendations = recommendations.data.results;
  //     }

  //     setItem(result.data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  async function findItem() {
    try {
      const {data} = await axios.get(`${baseUrl}/${id}`, {
        params: {
          api_key: process.env.REACT_APP_KEY,
          language: "ko-KR",
          region: "KR",
          append_to_response: "videos,credits,recommendations,release_dates,watch/providers"
        }
      });

      // 성인 여부 체크
      if (data.adult === true) {

      }

      // OTT 정보
      data.providers = [];
      if (data["watch/providers"]?.results?.KR) {
        data.providers = data["watch/providers"].results.KR;
      }

      // 출연진 및 감독
      data.cast = [];
      data.director = {};
      if (data.credits) {
        const sortedCast = data.credits.cast.sort((a, b) => a.order - b.order);
        for (let i = 0; i < sortedCast.length && i < 20; i++) {
          if (sortedCast[i].known_for_department === "Acting") {
            data.cast.push(sortedCast[i]);
          }
        }

        for (let crew of data.credits.crew) {
          if (crew.job === "Director") {
            data.director = crew;
            break;
          }
        }
      }

      // 예고편
      if (data.videos?.results?.length > 0) {
        data.videos = data.videos.results.filter(v => v.site === "YouTube");
      }

      // 연령 등급
      if (data.release_dates?.results) {
        const krRelease = data.release_dates.results.find(r => r.iso_3166_1 === "KR");
        if (krRelease) {
          data.release_dates = krRelease.release_dates.sort(
            (a, b) => new Date(b.release_date) - new Date(a.release_date)
          );
        }
      }

      // 추천 영화
      data.recommendations = data.recommendations?.results || [];

      setItem(data);
    } catch (error) {
      console.error(error);
    }
  }

  function saveReview() {
    jaxios.post("/api/review/saveReview", {midx:loginUser.midx, content, dbidx:id, score})
    .then((result)=>{
      if (result.data.msg === "ok") {
        alert("후기가 등록되었습니다");
      } else {
        alert("후기 등록이 실패했습니다");
      }
    })
    .catch((err)=>{console.error(err);})
  }

  async function getReviews() {
    try {
      const result = await axios.get("/api/review/getReviews", {params: {dbidx: id}});
      setReviewLists([...result.data.list]);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(
    ()=>{
      findItem(id);
    },[]
  )

  useEffect(
    ()=>{
      getReviews();
    },[]
  )

  return (
    <section className="content_info">
      <div className="top" style={{backgroundImage: `linear-gradient(to right, rgba(6, 13, 23, 1) 0%, rgba(6, 13, 23, 1) 58%, rgba(6, 13, 23, 0) 100%), url(https://image.tmdb.org/t/p/w780${item.backdrop_path})`,backgroundSize: "auto",backgroundPosition: "center right",backgroundRepeat: "no-repeat"}}>
        <h2>{item.title} <span>[{item.release_date ? item.release_date.substr(0,4) : null}]</span></h2>
        <p>원제 : {item.original_title}</p>
        <div>
          <span>평점 : <FontAwesomeIcon icon={faStar} /></span>
          <span>재생시간 : {formatRuntime(item.runtime)}</span>
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
        </div>
      </div>

      <div className="bottom">
        <div className="left">
          <div className="providers">
            <h3>지금 시청하기</h3>
            {
              item.providers ? (
                (() => {
                  const types = [
                    { key: "buy", label: "구매" },
                    { key: "rent", label: "대여" },
                    { key: "flatrate", label: "구독" },
                  ];

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

                  const available = types.filter(
                    (type) => item.providers[type.key]?.length > 0
                  );

                  if (available.length === 0) {
                    return <div className="noFind">시청할 수 있는 OTT가 없습니다.</div>;
                  }

                  return available.map((type) => (
                    <div key={type.key}>
                      <h4>{type.label}</h4>
                      <ul>
                        {item.providers[type.key].map((provider, idx) => {
                          const ottInfo = ottInfos.find((l) => l.key === provider.provider_id);
                          const url = getOttUrl(ottInfo.link, item.title);

                          return (
                            <li key={`${type.key}-${idx}`}>
                              {ottInfo ? (
                                <img src={require(`../../images/${ottInfo.label}.jpeg`)} alt={`${provider.provider_name} 로고`} />
                              ) : (
                                <span>{provider.provider_name}</span>
                              )}
                              <a href={url} target="_blank"><FontAwesomeIcon icon={faPlay} /> 지금 시청하기</a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ));
                })()
              ) : (
                <div className="noFind">시청할 수 있는 OTT가 없습니다.</div>
              )
            }
          </div>

          <div className="synopsis">
            <h3>시놉시스</h3>
            {
              item.overview ? <p>{item.overview}</p> : <div className="noFind">시놉시스 정보를 찾을 수 없습니다.</div>
            }
          </div>

          <div className="video">
            <h3>영상</h3>
            <div>
              {item.videos && item.videos.length > 0 ? (
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
                    {item.videos.map((video, idx) => (
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
                item.cast && item.cast.length > 0 ? (
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
                      {item.cast.map((cast, idx) => (
                        <SwiperSlide className="profile" key={idx}>
                          <div>
                            <div className="image_wrapper">
                              <img src={`https://image.tmdb.org/t/p/w92${cast.profile_path}`} alt={`${cast.name} 프로필 사진`} />
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

          <div className="recommendations">
            <h3>{item.title} 과 유사한 영화</h3>
            <div>
              {item.recommendations && item.recommendations.length > 0 ? (
                <>
                  <Swiper
                    className="lists"
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView={6}
                    slidesPerGroup={6}
                    onInit={(swiper) => {
                      // 커스텀 버튼 연결
                      swiper.params.navigation.prevEl = prevRef.current;
                      swiper.params.navigation.nextEl = nextRef.current;
                      swiper.navigation.init();
                      swiper.navigation.update();
                    }}
                  >
                    {item.recommendations.map((recommendation, idx) => (
                      <SwiperSlide className="list" key={idx}>
                        <div className="cover">
                          <img src={`https://image.tmdb.org/t/p/w185${recommendation.poster_path}`} alt={`${recommendation.title} 포스터`} />
                          <a href={`/movie/Detail/${recommendation.id}`}>
                            <div>
                              <button><FontAwesomeIcon icon={faBookmark} /></button>
                              <button><FontAwesomeIcon icon={faThumbsUp} /></button>
                            </div>
                          </a>
                        </div>
                      </SwiperSlide>
                    ))}
                    <button className="swiper-button-prev" ref={prevRef}><FontAwesomeIcon icon={faArrowLeft} /></button>
                    <button className="swiper-button-next" ref={nextRef}><FontAwesomeIcon icon={faArrowRight} /></button>
                  </Swiper>
                </>
              ) : (
                <div className="noFind">유사한 영상이 없습니다.</div>
              )}
            </div>
          </div>

          <div className="review">
            <h3>후기</h3>
            <div className="write">
              <h4>내 별점</h4>
              <div className="rating">
                <StarRating score={score} setScore={setScore} />
              </div>
              <div className="textBox">
                <textarea value={content} onChange={(e)=>{setContent(e.currentTarget.value)}} placeholder="리뷰를 입력해주세요" ></textarea>
                <button onClick={saveReview}>작성완료</button>
              </div>
            </div>
            <ul className="reviewLists">
              {
                reviewLists && reviewLists.length > 0 ?
                reviewLists.map((review, idx)=>{
                  const formattedDate = review.writedate ? dayjs(review.writedate).format("YYYY-MM-DD HH:mm") : null;
                  
                  return (
                    <li key={idx}>
                      <p><span>{review.member.nickname}</span> <span><FontAwesomeIcon icon={faStar} /> {review.score}</span> <small>({formattedDate})</small></p>
                      <div>
                        <pre>{review.content}</pre>
                        {
                          review.member.midx == loginUser.midx ?
                          <>
                            <button>수정하기</button>
                            <button>삭제하기</button>
                          </>
                          : null
                        }
                      </div>
                    </li>
                  )
                })
                :
                <li className="noFind">작성된 리뷰가 없습니다</li>
              }
            </ul>
          </div>
        </div>
        <div className="right">
          <div className="movieInfo">
            <h3>영화 정보</h3>
            <ul>
              <li>
                <div>
                  <img src={`https://image.tmdb.org/t/p/w154${item.poster_path}`} alt={`${item.title} 포스터`} />
                </div>
                <div>
                  <button><FontAwesomeIcon icon={faBookmark} /></button>
                  <button><FontAwesomeIcon icon={faThumbsUp} /></button>
                </div>
              </li>
              <li>
                <h4>감독</h4>
                {
                  item.director ?
                  <>
                    {/* <img src={`https://image.tmdb.org/t/p/w154${item.director.profile_path}`} alt={`${item.director.name} 사진`} /> */}
                    <p>{item.director ? item.director.name : "Unknown"}</p>
                  </>
                  : <p>Unknown</p>
                }
              </li>
              <li>
                <h4>평점</h4>
                
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
                <h4>재생 시간</h4>
                <p>{formatRuntime(item.runtime)}</p>
              </li>
              <li>
                <h4>연령 등급</h4>
                {
                  item.release_dates && item.release_dates.length > 0 ?
                  <p>{item.release_dates[0].certification}</p>
                  : <p>Unknown</p>
                }
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
    </section>
  )
}

export default Detail