import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import jaxios from '../../util/JWTUtil';
import AddTitle from './AddTitle';
import "../../style/myListView.css";

function MyListView() {
  const { listidx } = useParams();
  const numericListidx = Number(listidx);

  const [myListView, setMyListView] = useState({});
  const [movieList, setMovieList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [reload, setReload] = useState(false);   // AddTitle 닫힐 때 재로드용 상태

  const loader = useRef(null);

  const baseUrl = "https://api.themoviedb.org/3";

  // -----------------------------
  // TMDB + DB 데이터 로딩 함수
  // -----------------------------
  const fetchMovies = async (pageNum) => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      console.log("listidx : " + numericListidx)
      const result = await jaxios.get('/api/member/getMyListDetailView', {
        params: { page: pageNum, listidx: numericListidx }
      });
      console.log('fetchMovies : ' + result.data.dbList)

      if (result.data.dbList.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }
      setMovieList(result.data.dbList);

      // const movies = await Promise.all(
      //   result.data.dbList.map(async (movie) => {
      //     const detail = await axios.get(
      //       `${baseUrl}/movie/${movie.dbidx}?api_key=${process.env.REACT_APP_KEY}&language=ko-KR`
      //     );

      //     return {
      //       ...movie,
      //       poster_path: detail.data.poster_path,
      //       title: detail.data.title
      //     };
      //   })
      // );

      // setMovieList(prev => [...prev, ...movies]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // -----------------------------
  // page 값 바뀔 때 자동 로딩
  // -----------------------------
  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  // -----------------------------
  // IntersectionObserver 무한 스크롤
  // -----------------------------
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.7 }
    );

    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  // -----------------------------
  // AddTitle 닫힌 후 강제 리로드 처리
  // -----------------------------
  useEffect(() => {
    if (reload) {
      // 1) 모든 리스트 초기화
      setMovieList([]);
      setPage(1);
      setHasMore(true);

      // 2) 첫 페이지를 강제로 단 1번만 로드
      fetchMovies(1);

      // 3) 다시 false
      setReload(false);
    }
  }, [reload]);

  // -----------------------------
  // AddTitle 닫기 버튼 이벤트
  // -----------------------------
  const handleAddTitleClose = () => {
    setOpen(false);

    // ★ 여기서 setPage 또는 fetchMovies 직접 호출 ❌
    // 오직 reload만 true로 → 자동 리로드만 수행되도록
    setReload(true);
  };

  return (
    <div className="list-page">
      <div className="list-header">
        <h1>{myListView.listname}</h1>
        <div className="list-menu">
          <button onClick={() => setOpen(true)}>추가</button>
        </div>
      </div>

      {/* AddTitle 모달 */}
      {open && (
        <AddTitle listidx={numericListidx} onClose={handleAddTitleClose} />
      )}

      <div className="content-grid">
        {movieList.map(movie => (
          <div className="card" key={movie.dbidx}>
            <a href={`/movie/detail/${movie.dbidx}`}>
              <img
                src={`https://image.tmdb.org/t/p/w342/${movie.posterpath}`}
                alt={movie.title}
              />
            </a>
          </div>
        ))}
      </div>

      {/* 무한스크롤 트리거 */}
      <div ref={loader} className="scroll-loader">
        {loading && "Loading..."}
      </div>
    </div>
  );
}

export default MyListView;
