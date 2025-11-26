import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import { Cookies } from "react-cookie";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

import "../../style/addTitle.css";
import jaxios from "../../util/JWTUtil";

function AddTitle({ onClose, listidx }) {
    console.log('listidx : ', listidx)

    const [keyword, setKeyword] = useState('')

    //const [sliderShow, setSliderShow] = useState(8);
    const [movieList, setMovieList] = useState([]);
    const [tvList, setTvList] = useState([]);
    const [combineList, setCombineList] = useState([]);
    const [popular, setPopular] = useState([])
    const cookies = new Cookies()
    const navigate = useNavigate()

    // 서버에서 저장된 항목을 먼저 불러옴
    const [selected, setSelected] = useState({});

    const settings = {
    dots: true,
    speed: 500,
    //slidesToShow: sliderShow,
    //slidesToScroll: sliderShow,
    arrows: true
    };

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

    async function findMovies (keyword) {
    const baseUrl = "https://api.themoviedb.org/3";
        try {
            const result = await axios.get(`${baseUrl}/search/movie?language=ko-KR&page=1&api_key=${process.env.REACT_APP_KEY}&query=${keyword}`);
            console.log('영화 검색 : ', result.data)
            if (result.data) {
                const movieDatas = result.data.results;
                if (movieDatas) {
                    const moviesWithProviders = await Promise.all(
                    movieDatas.map(async (movie) => {
                        const providerRes = await axios.get(`${baseUrl}/movie/${movie.id}/watch/providers?api_key=${process.env.REACT_APP_KEY}`);
                        return {
                            ...movie, 
                            media_type: 'movie',
                            providers: providerRes.data.results["KR"]?.flatrate || []
                        }
                    })
                    )
                    setMovieList(moviesWithProviders);
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function findTvs (keyword) {
    const baseUrl = "https://api.themoviedb.org/3";
        try {
            const result = await axios.get(`${baseUrl}/search/tv?language=ko-KR&page=1&api_key=${process.env.REACT_APP_KEY}&query=${keyword}`);
            console.log('TV검색 : ', result.data)
            if (result.data) {
                const movieDatas = result.data.results;
                if (movieDatas) {
                    const moviesWithProviders = await Promise.all(
                    movieDatas.map(async (tv) => {
                        const providerRes = await axios.get(`${baseUrl}/tv/${tv.id}/watch/providers?api_key=${process.env.REACT_APP_KEY}`);
                        return {
                            ...tv, 
                            media_type: 'tv',
                            providers: providerRes.data.results["KR"]?.flatrate || []
                        }
                    })
                    )
                    setTvList(moviesWithProviders);
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(
        ()=>{
            findMovies(keyword);
            findTvs(keyword);
        },[keyword]
    )

    useEffect(
        ()=>{
            const combine = [...movieList, ...tvList]
            combine.sort((a,b)=>b.popularity - a.popularity);
            setCombineList(combine);
        },[movieList, tvList]
    )

    useEffect(() => {
        const baseUrl = "https://api.themoviedb.org/3";
        const popularLoad = async () => {
            try {
                const movieResult = await axios.get(
                `${baseUrl}/movie/popular?language=ko-KR&api_key=${process.env.REACT_APP_KEY}`
                );
                console.log('리스트추가 인기 영화 : ', movieResult.data.results)

                const tvResult = await axios.get(
                `${baseUrl}/tv/popular?language=ko-KR&api_key=${process.env.REACT_APP_KEY}`
                );
                
                const popularMovie = movieResult.data.results.map((item)=>({
                    ...item,
                    media_type: 'moive'
                }));
                const popularTv = tvResult.data.results.map((item)=>({
                    ...item,
                    media_type: 'tv'
                }));

                const combinePopular = [...popularMovie, ...popularTv]
                combinePopular.sort((a, b) => b.popularity - a.popularity);
                setPopular(combinePopular);
            } catch (err) {
                console.error(err);
            }
        };
        popularLoad();
        }, []
    );

    useEffect(() => {
        async function loadSelected() {
            try {
                // 예: GET /api/member/titleList?listidx=3
                const result = await jaxios.get("/api/member/titleList", {
                    params: { listidx: Number(listidx) }
                });
                console.log("타이틀리스트 : ", result.data.titleList);
                const tl = result.data.titleList;
                // res.data = [dbidx, dbidx, ...]
                let obj = {};
                tl.forEach( (id) => {
                    obj[id] = true;
                });

                setSelected(obj);

            } catch (err) {
                console.error(err);
            }
        }

        if (listidx) loadSelected();
    }, [listidx]);

    async function handleToggle(item) {
        try{
            const result = await jaxios.post(`/api/member/toggleTitle`, { 
                listidx: Number(listidx),
                dbidx: item.id,
                posterpath: item.poster_path,
                title: item.title || item.name
            });

            setSelected(prev => ({
                ...prev,
                [item.id]: result.data.saved   // true 저장 / false 삭제
            }));
        }catch(err){
            console.error(err)
        }
    }

    async function onSubmit(){
        onClose();
        navigate(`/myListView/${listidx}`);
    }

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                
                <button className="close-btn" style={{display:"flex", justifyContent:"flex-end", color:"orange"}} onClick={onClose}>X</button>
                <div className="modal-title">타이틀 추가하기</div>
                <div className="divider" />

                <div className="modal-subtitle">영화 또는 TV 프로그램 검색</div>

                <div className="modal-search">
                    <input className="search-input" placeholder="영화 또는 TV 프로그램 검색" value={keyword} onChange={(e) => {setKeyword(e.currentTarget.value)}}/>
                </div>

                {keyword.trim() === "" && (
                    <div className="item-list">
                        {popular.map((item, idx) => {
                            const title = item.title || item.name;
                            const date = item.release_date || item.first_air_date;
                            const mediaType = item.media_type === 'movie' ? '영화' : 'TV';

                            return(
                                <div className={`item ${selected[item.id] ? "checked" : ""}`} 
                                    onClick={() => handleToggle(item)} key={idx}>
                                    <img
                                        src={`https://image.tmdb.org/t/p/w185${item.poster_path}`} alt={`${title} 포스터`}
                                        className="item-img"
                                    />
                                    <div className="item-info">
                                        <div className="item-title">{title}</div>
                                        <div className="item-desc">{mediaType}, {date}</div>
                                    </div>
                                    {selected[item.id] && (<div className="add-check-icon">✔</div>)}
                                </div>
                            )
                        })}
                    </div>
                )}

                {keyword.trim() !== "" && (
                    <>
                        {combineList.length > 0 && (
                            <div className="item-list">
                                {combineList.map((item, idx) => {
                                    const title = item.title || item.name;
                                    const date = item.release_date || item.first_air_date;
                                    const mediaType = item.media_type === 'movie' ? '영화' : 'TV';

                                    return (
                                        <div
                                            className={`item ${selected[item.id] ? "checked" : ""}`}
                                            onClick={() => handleToggle(item)} 
                                            key={idx}
                                        >
                                            <img
                                                src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
                                                alt={`${title} 포스터`}
                                                className="item-img"
                                            />
                                            <div className="item-info">
                                                <div className="item-title">{title}</div>
                                                <div className="item-desc">{mediaType}, {date}</div>
                                            </div>
                                            {selected[item.id] && <div className="add-check-icon">✔</div>}
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* 검색 결과가 아무것도 없을 때 */}
                        {movieList.length === 0 && tvList.length === 0 && (
                            <div className="no-result">검색 결과가 없습니다.</div>
                        )}
                    </>
            )}

                <button className="submit-btn" onClick={ ()=>{onSubmit()}}>완료</button>
            </div>
        </div>
    );
}

export default AddTitle;