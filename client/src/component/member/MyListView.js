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
    const [page, setPage] = useState(-1);
    const [hasMore, setHasMore] = useState(true);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const loader = useRef(null);

    // 리스트 정보 가져오기
    useEffect(() => {
        const fetchListInfo = async () => {
            let res = await jaxios.get('/api/member/getMyListView', {
                params: { listidx: numericListidx }
            });
            setMyListView(res.data.myListView);
        };
        fetchListInfo();
    }, [numericListidx]);

    // 영화 데이터 paginate 불러오기
    const loadMovies = async () => {
        if(loading || !hasMore) return;
        setLoading(true);

        const baseUrl = "https://api.themoviedb.org/3";

        let res = await jaxios.get(`/api/member/getMyListDetailView/${page}`, {
            params: { listidx: numericListidx }
        });

        if(res.data.dbList.length === 0){
            setHasMore(false);
            setLoading(false);
            return;
        }

        const movies = await Promise.all(
            res.data.dbList.map(async movie => {
                const detail = await axios.get(`${baseUrl}/movie/${movie.dbidx}?api_key=${process.env.REACT_APP_KEY}&language=ko-KR`);
                return {
                    ...movie,
                    poster_path: detail.data.poster_path,
                    title: detail.data.title
                };
            })
        );

        setMovieList(prev => [...prev, ...movies]);
    };

    useEffect(() => {
        if (page !== 0) {
            loadMovies();
        }
    }, [page]);

    // IntersectionObserver로 무한스크롤
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 1 }
        );
        if (loader.current) observer.observe(loader.current);
        return () => observer.disconnect();
    }, [hasMore]);

    // 타이틀 추가 완료 시 reload
    const handleAddTitleClose = async () => {
        setOpen(false);
        setMovieList([]);
        setHasMore(true);

        setPage(0);
        await loadMovies();
    };

    return (
        <div className="list-page">
            <div className="list-header">
                <h1>{myListView.listname}</h1>

                <div className="menu">
                    <button onClick={() => setOpen(true)}>추가</button>
                </div>
            </div>

            {open && <AddTitle listidx={numericListidx} onClose={handleAddTitleClose} />}

            <div className="content-grid">
                {movieList.map((movie, idx) => (
                    <div className="card" key={idx}>
                        <a href={`/movie/detail/${movie.dbidx}`}>
                            <img
                                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                                alt={movie.title}
                            />
                        </a>
                        <p className="title">{movie.title}</p>
                    </div>
                ))}
            </div>

            <div ref={loader} className="scroll-loader">Loading...</div>
        </div>
    );
}
export default MyListView;
