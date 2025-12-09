import React , {useState, useEffect} from 'react'
import axios from 'axios'
import {Cookies, useCookies} from 'react-cookie'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../store/userSlice';
// 아래는 기존 Main 컴포넌트에 "신작 영화", "신작 TV" 섹션을 추가한 완성 코드입니다.
// 기존 구조를 유지하며 fetchList와 ListCard 재사용합니다.

import Slider from "react-slick";
import "../style/main.css";

function Main() {
  const baseUrl = "https://api.themoviedb.org/3";

  const [topMovie, setTopMovie] = useState([]);
  const [topTv, setTopTv] = useState([]);
  const [movieTrending, setMovieTrending] = useState([]);
  const [tvTrending, setTvTrending] = useState([]);

  // ★ 신작 영화 & 신작 TV 추가
  const [movieUpcoming, setMovieUpcoming] = useState([]);
  const [tvUpcoming, setTvUpcoming] = useState([]);

  const [topBoard, setTopBoard] = useState(null);
  const [topBoardImg, setTopBoardImg] = useState(null);

  const [mostSavedTitles, setMostSavedTitles] = useState([]);
  const navigate = useNavigate();

  const [chatView, setChatView] = useState(false)
  const [chatStyle, setChatStyle] = useState({display:'none'})

  const settings = {
    dots: false,
    infinite: false,
    speed: 700,
    slidesToShow: 5,
    slidesToScroll: 5,
    arrows: true,
  };

  async function attachProviders(items, type) {
    return Promise.all( 
      items.map(async (item) => {
        const provider = await axios.get(
          `${baseUrl}/${type}/${item.id}/watch/providers?api_key=${process.env.REACT_APP_KEY}`
        );
        return {
          ...item,
          providers: provider.data.results["KR"]?.flatrate || [],
        };
      })
    );
  }

  async function attachTopProvider(items) {
    return Promise.all(
      items.map(async (item) => {
        try {
          const provider = await axios.get(
            `${baseUrl}/${item.type}/${item.id}/watch/providers?api_key=${process.env.REACT_APP_KEY}`
          );
          const flatrate = provider.data?.results?.KR?.flatrate || [];
          return { ...item, providers: flatrate };
        } catch (err) {
          console.warn("provider fetch failed:", item.type, item.id);
          return { ...item, providers: [] };
        }
      })
    );
  }

  async function fetchList(url, setter, type) {
    try {
      const result = await axios.get(url);
      const datas = result.data.results.slice(0, 10);
      const withProviders = await attachProviders(datas, type);
      setter(withProviders);
    } catch (err) {
      console.error(err);
    }
  }

  function ListCard({ lists, target, top10 }) {
    const posterWidth = top10 ? "200px" : "200px";
    const rankOverflow = top10 ? "0px" : "0px";

    return (
      <div
        className="top10-slider"
        style={{
          "--poster-w": posterWidth,
          "--rank-overflow": rankOverflow,
        }}
      >
        <Slider {...settings}>
          {lists.slice(0, 10).map((item, idx) => (
            <div className="top10-card" key={item.id}>
              <Link to={`/${target}/detail/${item.id}`}>
                {top10 && <div className="rank-number">{idx + 1}</div>}
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title || item.name}
                  className="top10-poster"
                />
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    );
  }

  useEffect(() => {
    axios.get("/api/member/getMostAddedTitles")
      .then(async (res) => {
        const datas = res.data.titles?.slice(0, 5) || [];

        // 🔥 fetched data mapping
        const mapped = datas.map(item => ({
          id: item.dbidx,
          poster_path: item.posterpath,
          title: item.title,
          type: item.type   // movie | tv
        }));

        // 🔥 type에 맞게 providers 조회하기
        const final = await Promise.all(
          mapped.map(async (item) => {
            const provider = await attachProviders([{ id: item.id }], item.type);
            return {
              ...item,
              providers: provider[0]?.providers || []
            };
          })
        );

        setMostSavedTitles(final);
      })
      .catch(err => console.error(err));
  }, []);


  useEffect(() => {
    axios.get("/api/board/getTopBoard")
      .then(async res => {
        setTopBoard(res.data.board);

        // 이미지 가져오기
        if (res.data.board?.fidx) {
          try {
            const imgRes = await axios.get(`/api/file/url/${res.data.board.fidx}`);
            setTopBoardImg(imgRes.data.image);
          } catch (err) {
            console.error(err);
          }
        }
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
          if (chatView) {
              setChatStyle({display: 'flex', flexDirection: 'column'});
          } else {
              setChatStyle({display:'none'});
          }
      }, [chatView]);


  useEffect(() => {


    fetchList(
      `${baseUrl}/movie/popular?language=ko-KR&region=KR&page=1&api_key=${process.env.REACT_APP_KEY}`,
      setTopMovie,
      "movie"
    );
    fetchList(
      `${baseUrl}/tv/popular?language=ko-KR&region=KR&page=1&api_key=${process.env.REACT_APP_KEY}`,
      setTopTv,
      "tv"
    );

    fetchList(
      `${baseUrl}/trending/movie/week?language=ko-KR&api_key=${process.env.REACT_APP_KEY}`,
      setMovieTrending,
      "movie"
    );
    fetchList(
      `${baseUrl}/trending/tv/week?language=ko-KR&api_key=${process.env.REACT_APP_KEY}`,
      setTvTrending,
      "tv"
    );

    // ★ 신작 영화 (upcoming)
    fetchList(
      `${baseUrl}/movie/upcoming?language=ko-KR&region=KR&page=1&api_key=${process.env.REACT_APP_KEY}`,
      setMovieUpcoming,
      "movie"
    );

    // ★ 신작 TV (on the air - 현재 방영중)
    fetchList(
      `${baseUrl}/tv/on_the_air?language=ko-KR&region=KR&page=1&api_key=${process.env.REACT_APP_KEY}`,
      setTvUpcoming,
      "tv"
    );
  }, []);

  return (
    <div className="home-wrap">
      <section className="hero-section">
        <h1 className="hero-title">영화, TV 시리즈 스트리밍 통합 안내 가이드</h1>

        <p className="hero-desc">
          "신작, 인기작, 개봉예정 콘텐츠를 바로 볼 수 있는 곳을<br />
          오늘 뭐보지? 와 함께 찾아보세요."
        </p>
        </section>
      {/* 🔥 메인 상단 안내 카드 섹션 */}
      <section className="intro-section">
        <div className="intro-card">
          <div className="intro-subject-wrap">
            <h2 className="intro-subject">이용 방법</h2>
            <button className="subject-btn" onClick={()=>{setChatView( !chatView )}}>→&nbsp;&nbsp;챗봇 문의하기</button>
          </div>
          <br />
          <span className="intro-sub">모든 작품을 한곳에서 검색</span>
          <h2 className="intro-title">스트리밍 플랫폼 가이드</h2>
          <p className="intro-desc">
            좋아하는 모든 콘텐츠에 대한 맞춤 검색을 해보세요.<br />
            영화, TV 시리즈를 감상할 수 있는 곳을 알려드립니다.
          </p><br /><br />
          <span className="intro-sub">하나의 리스트로 정리</span>
          <h2 className="intro-title">리스트 저장 및 공유</h2>
          <p className="intro-desc">
            시청하려는 모든 콘텐츠를 하나의 리스트로 만들어보세요.<br />
            공유하거나 비공개로 이용할 수 있습니다.
          </p><br />
        </div>

        <div className="intro-card">
          <div className="intro-subject-wrap">
            <h2 className="intro-subject">인기 커뮤니티</h2>
            <button className="subject-btn" onClick={()=>{navigate("/community")}}>→&nbsp;&nbsp;더보기</button>
          </div>

          {topBoard ? (
            <>
              {topBoardImg && (
                <img className="intro-thumb"
                    src={topBoardImg}
                    alt="community thumbnail"
                    style={{ borderRadius: "18px", marginBottom: "12px" }} />
              )}

              <h2 className="intro-title">{topBoard.title}</h2>

              <p className="intro-desc">
                {(topBoard.content || "").replace(/<[^>]+>/g, "").slice(0, 55)}
              </p>

              <span className="intro-c-sub">By. {topBoard.boardMember.nickname || ""}</span>
            </>
          ) : (
            <p className="intro-desc">로딩 중...</p>
          )}
        </div>



       <div className="intro-card">
        <div className="intro-subject-wrap">
          <h2 className="intro-subject">인기 리스트</h2>
          <button className="subject-btn"></button>
        </div>

        <div className="intro-slider-wrap">
          <Slider
            dots={true}
            infinite={true}
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            arrows={false}
            autoplay={true}
            autoplaySpeed={3400}
          >
            {mostSavedTitles.map((item) => (
              <div key={item.id} className="intro-slide">
                <Link to={`/${item.type}/detail/${item.id}`}>
                  <img
                    className="intro-Lthumb"
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt=""
                  />
                </Link>
                <h2 className="intro-title">{item.title}</h2>
              </div>
            ))}

          </Slider>
        </div>
      </div>
      </section>

      <div className="top10-textrow">
        <h2>신작, 인기작, 출시예정 영화 및 TV 시리즈 둘러보기</h2>
      </div>

      {/* 🎬 이번 주 Top 10 영화 */}
      <div className="top10-row">
        <div className="top10-text">
          <h2><br/>이번 주 탑 10 영화</h2>
          <p><br/><br/>이번 주 최고 인기 영화를 검색하여 어디에서 스트리밍할 수 있는지 알아보세요.</p>
        </div>

        <div className="top10-slider-wrap">
          <ListCard lists={movieTrending} target="movie" top10 />
        </div>
      </div>

      {/* 📺 이번 주 Top 10 TV */}
      <div className="top10-row">
        <div className="top10-text">
          <h2><br/>이번 주 탑 10 TV 시리즈</h2>
          <p><br/><br/>이번 주 최고 인기 TV 시리즈를 검색하여 어디에서 스트리밍할 수 있는지 알아보세요.</p>
        </div>

        <div className="top10-slider-wrap">
          <ListCard lists={tvTrending} target="tv" top10 />
        </div>
      </div>

      {/* 🎬 신작 영화 */}
      <div className="top10-row">
        <div className="top10-text">
          <h2><br/>신작 영화</h2>
          <p><br/><br/>이번 달 개봉 예정이거나 새롭게 등록된 영화들을 확인하세요.</p>
        </div>

        <div className="top10-slider-wrap">
          <ListCard lists={movieUpcoming} target="movie" />
        </div>
      </div>

      {/* 📺 신작 TV */}
      <div className="top10-row">
        <div className="top10-text">
          <h2><br/>신작 TV 시리즈</h2>
          <p><br/><br/>새롭게 방영 중이거나 곧 시작될 TV 프로그램을 확인하세요.</p>
        </div>

        <div className="top10-slider-wrap">
          <ListCard lists={tvUpcoming} target="tv" />
        </div>
      </div>
    </div>
  );
}

export default Main;
