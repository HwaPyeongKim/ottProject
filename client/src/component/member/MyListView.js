import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/JWTUtil';
import AddTitle from './AddTitle';
import "../../style/myListView.css";

function MyListView() {
  const { listidx } = useParams();
  const numericListidx = Number(listidx);
  const loginUser = useSelector(state => state.user);

  const [myListView, setMyListView] = useState({});
  const [movieList, setMovieList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [reload, setReload] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const loader = useRef(null);

  const baseUrl = "https://api.themoviedb.org/3";

  // -----------------------------
  // TMDB + DB 데이터 로딩 함수
  // -----------------------------
  const fetchMovies = async (pageNum) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      console.log("listidx : " + numericListidx);

      const result = await jaxios.get('/api/member/getMyListDetailView', {
        params: { page: pageNum, listidx: numericListidx }
      });

      console.log('fetchMovies : ', result.data.dbList);

      if (result.data.dbList.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      if (pageNum === 1) {
        setMovieList(result.data.dbList);   // 첫 페이지면 완전히 덮어쓰기
      } else {
        setMovieList(prev => [...prev, ...result.data.dbList]);
      }

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
      // 1) 상태 초기화
      setMovieList([]);
      setHasMore(true);

      // 2) page를 강제로 변경하여 useEffect(page)가 반드시 실행되도록 함
      setPage(0);
      setTimeout(() => setPage(1), 0);

      // 3) 종료
      setReload(false);
    }
  }, [reload]);

  // -----------------------------
  // AddTitle 닫기 버튼 이벤트
  // -----------------------------
  const handleAddTitleClose = () => {
    setOpen(false);
    setReload(true);   // reload 트리거
  };

  function deleteList() {
    jaxios.delete("/api/member/deleteList", { data: { midx: loginUser.midx, listidx: numericListidx } })
      .then(res => {
        if (res.data.msg === "ok") {
          alert("리스트가 삭제되었습니다");
          setIsDeleteModalOpen(false);
          navigate('/mylist');
        } else {
          alert('리스트 삭제에 실패했습니다');
        }
      })
      .catch(err => console.error(err));
  }

  return (
    <div className="list-page">
      <div className="list-header">
        <h1>{myListView.listname}</h1>
        <div className="list-menu">
          <button onClick={() => setOpen(true)}>추가</button>
          <button
            className="deleteButton"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            리스트 삭제
          </button>
        </div>
      </div>

      {/* AddTitle 모달 */}
      {open && (
        <AddTitle
          listidx={numericListidx}
          onClose={handleAddTitleClose}
        />
      )}

      <div className="content-grid">
        {movieList.map(movie => (
          <div className="card" key={movie.dbidx}>
            <Link to={`/movie/detail/${movie.dbidx}`}>
              <img
                src={`https://image.tmdb.org/t/p/w342/${movie.posterpath}`}
                alt={movie.title}
              />
            </Link>
          </div>
        ))}
      </div>

      {/* 무한스크롤 트리거 */}
      <div ref={loader} className="scroll-loader">
        {loading && "Loading..."}
      </div>

      {isDeleteModalOpen && (
        <div className="mlv-modalOverlay" onClick={() => setOpen(false)}>
          <div
            className="mlv-modalContent"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>리스트 삭제</h3>
            <p>이 작업은 취소할 수 없습니다. 정말 리스트를 삭제하시겠습니까?</p>

            <div className="mlv-buttonWrap">
              <button
                className="mlv-cancelButton"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                취소
              </button>
              <button
                className="mlv-deleteConfirmButton"
                onClick={deleteList}
              >
                삭제
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default MyListView;
