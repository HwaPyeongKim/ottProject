import { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";


function Main() {
  
  const [sliderShow, setSliderShow] = useState(8);
  const [popular, setPopular] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [coming, setComing] = useState([]);

  const settings = {
    dots: true,               // 밑에 점 표시 여부
    // infinite: true,           // 무한 루프
    speed: 500,               // 슬라이드 전환 속도 (ms)
    slidesToShow: sliderShow,          // 한 번에 보여줄 슬라이드 개수
    slidesToScroll: sliderShow,        // 한 번에 넘어갈 슬라이드 개수
    // autoplay: true,           // 자동 슬라이드
    // autoplaySpeed: 2000,      // 자동 전환 간격
    arrows: true              // 좌우 화살표 표시
  };

  useEffect(
    ()=>{
      axios.get(`https://api.themoviedb.org/3/movie/popular?language=ko-KR&region=KR&page=1&api_key=${process.env.REACT_APP_KEY}`)
      .then((result)=>{
        setPopular(result.data.results);
      })
      .catch((err)=>{console.error(err);})

      axios.get(`https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&region=KR&page=1&api_key=${process.env.REACT_APP_KEY}`)
      .then((result)=>{
        setNowPlaying(result.data.results);
      })
      .catch((err)=>{console.error(err);})

      axios.get(`https://api.themoviedb.org/3/movie/upcoming?language=ko-KR&region=KR&page=1&api_key=${process.env.REACT_APP_KEY}`)
      .then((result)=>{
        setComing(result.data.results);
      })
      .catch((err)=>{console.error(err);})
    },[]
  )

  return (
    <div>
      <h3>상영중인 영화1</h3>
      <Slider {...settings} className="lists">
        {
          nowPlaying.map((item, idx)=>{
            return (
              <div className="list">
                <a href={`/detail/${item.id}`} key={idx}>
                  <img src={`https://image.tmdb.org/t/p/w185${item.poster_path}`} />
                </a>
              </div>
            )
          })
        }
      </Slider>

      <h3>개봉 예정작</h3>
      <Slider {...settings} className="lists">
        {
          coming.map((item, idx)=>{
            return (
              <div className="list">
                <a href={`/detail/${item.id}`} key={idx}>
                  <img src={`https://image.tmdb.org/t/p/w185${item.poster_path}`} />
                </a>
              </div>
            )
          })
        }
      </Slider>
    </div>
  )
}

export default Main