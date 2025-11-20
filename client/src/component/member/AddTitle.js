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
    const [popular, setPopular] = useState([])
    const cookies = new Cookies()
    const navigate = useNavigate()

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
                    ...movie, providers: providerRes.data.results["KR"]?.flatrate || []
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
                    ...tv, providers: providerRes.data.results["KR"]?.flatrate || []
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

    useEffect(() => {
        const baseUrl = "https://api.themoviedb.org/3";
        const popularLoad = async () => {
            try {
                const result = await axios.get(
                `${baseUrl}/movie/popular?language=ko-KR&api_key=${process.env.REACT_APP_KEY}`
                );
                // if(result.data){
                //     const popularData = result.data.results
                //     if(popularData){
                //         const popularWithProviders = await Promise.all(
                //             popularData.map()
                //         )
                //     }
                // }
                console.log('리스트추가 인기 : ', result.data.results)
                setPopular(result.data.results);
            } catch (err) {
                console.error(err);
            }
        };
        popularLoad();
        }, []
    );

    const [checklist, setChecklist] = useState([]);
    async function onSubmit(){
        if( checklist.length === 0 ){
            return;
        }else{
            for( let i = 0; i<checklist.length; i++ ){
                const result = await jaxios.get(`/api/member/addTitleList/${checklist[i]}`, {params:{listidx: Number(listidx)}})
            }
            // cookies.set('currentOrder', JSON.stringify(checklist), {path:'/'})
            console.log("navigate 직전 listidx =", listidx);
            //navigate(`/myListView/${listidx}`)
        }
    }

    function onCheck(id, checked){
        if (checked) {
        setChecklist(prev => [...prev, Number(id)]);
        } else {
            setChecklist(prev => prev.filter(item => item !== Number(id)));
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                
                <div className="modal-title">추가하기</div>
                <button className="close-btn" onClick={onClose}>X</button>
                <div className="divider" />

                <div className="modal-subtitle">영화 또는 TV 프로그램 검색</div>

                <input className="search-input" placeholder="영화 또는 TV 프로그램 검색" value={keyword} onChange={(e) => {setKeyword(e.currentTarget.value)}}/>
                <button onClick={findMovies}>검색</button>

                <div className="item-list">
                    {popular.map((item, idx) => (
                        <div className="item" key={idx}>
                            <img
                                src={`https://image.tmdb.org/t/p/w185${item.poster_path}`} alt={`${item.title} 포스터`}
                                className="item-img"
                            />
                            <div className="item-info">
                                <div className="item-title">{`${item.title}`}</div>
                                <div className="item-desc">영화, {`${item.release_date}`}</div>
                            </div>
                            <input type="checkbox" id={'ch'+idx} value={item.id} className="checkbox" 
                            onChange={(e)=>{onCheck(e.currentTarget.value, e.currentTarget.checked)}}/>
                        </div>
                    ))}
                </div>

                <button className="submit-btn" onClick={ async ()=>{await onSubmit(); onClose();}}>완료</button>
            </div>
        </div>
    );
}

export default AddTitle;