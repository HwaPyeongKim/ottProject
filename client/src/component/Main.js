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
            <button className="subject-btn">→&nbsp;&nbsp;챗봇 문의하기</button>
          </div>
          <span className="intro-sub">모든 작품을 한곳에서</span>
          <h2 className="intro-title">전체 스트리밍 가이드</h2>
          <p className="intro-desc">
            좋아하는 모든 스트리밍 서비스에 대한 맞춤 추천을 받아보세요.
            영화, TV 시리즈, 스포츠를 감상할 수 있는 곳을 알려드립니다.
          </p><br /><br />
          <span className="intro-sub">한 번에 검색</span>
          <h2 className="intro-title">모든 플랫폼을 한 번에 검색</h2>
          <p className="intro-desc">
            영화 또는 TV 시리즈를 확인하기 위해 여러 스트리밍 서비스를
            이용할 필요가 없습니다. 한 번의 검색으로 모두 찾으세요.
          </p><br /><br />
          <span className="intro-sub">하나의 리스트</span>
          <h2 className="intro-title">모든 리스트 통합</h2>
          <p className="intro-desc">
            시청하려는 모든 영화와 TV 시리즈를 하나의 리스트로 만들어
            다양한 기기에서 모든 스트리밍 서비스를 이용할 수 있습니다.
          </p><br /><br />
        </div>

        <div className="intro-card">
          <div className="intro-subject-wrap">
            <h2 className="intro-subject">인기 커뮤니티</h2>
            <button className="subject-btn">→&nbsp;&nbsp;더보기</button>
          </div>
          <img className="intro-thumb" src="/images/severance.png" alt="" />
          <span className="intro-sub">커뮤니티</span>
          <h2 className="intro-title">커뮤니티</h2>
          <p className="intro-desc">
            커뮤니티
          </p>
        </div>

        <div className="intro-card">
          <div className="intro-subject-wrap">
            <h2 className="intro-subject">인기 리스트</h2>
            <button className="subject-btn">→&nbsp;&nbsp;리스트에 담기</button>
          </div>
          <img className="intro-thumb" src="/images/lotr.png" alt="" />
          <span className="intro-sub">인기 리스트</span>
          <h2 className="intro-title">인기 리스트</h2>
          <p className="intro-desc">
            인기 리스트
          </p>
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
