import { useState } from "react";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import jaxios from "../util/JWTUtil";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const ListCard = ({ lists, target }) => {
  const [sliderShow, setSliderShow] = useState(8);
  const loginUser = useSelector(state=>state.user);

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

  const settings = {
    dots: true,
    speed: 500,
    slidesToShow: sliderShow,
    slidesToScroll: sliderShow,
    arrows: true
  };
    
  function like(id) {
    if (!loginUser || loginUser.midx === undefined) {
      alert("로그인 후 이용해주세요");
      return;
    }
    jaxios.post("/api/main/like", {midx: loginUser.midx, dbidx: id});
  }

  return (
    <Slider {...settings} className="lists">
      {
        lists.map((item, idx)=>{
          return (
            <div className="list" key={idx}>
              <div className="cover">
                <img src={`https://image.tmdb.org/t/p/w185${item.poster_path}`} alt={`${item.title} 포스터`} onError={(e)=>{e.target.src="/images/noposter.png"}} />
                <a href={`/${target}/detail/${item.id}`}>
                  <div>
                    <p>{item.title}</p>
                    {/* {
                      loginUser && loginUser.midx ?
                      <>
                        <button onClick={()=>{}}><FontAwesomeIcon icon={faBookmark} /></button>
                        <button onClick={(e)=>{e.preventDefault(); like(item.id);}}><FontAwesomeIcon icon={faThumbsUp} /></button>
                      </>
                      : null
                    } */}
                  </div>
                  {
                    item.providers ? (
                      <ul>
                        {item.providers.map((provider, pidx)=>{
                          const ott = ottInfos.find(info => info.key === provider.provider_id);
                          if (!ott) return null;
                          
                          return (
                            <li key={pidx}>
                              <img src={`/images/${ott.label}.jpeg`} alt={`${ott.label} 로고`} />
                            </li>
                          )
                        })}
                      </ul>
                    )
                    : null
                  }
                </a>
              </div>
            </div>
          )
        })
      }
    </Slider>
  );
};

export default ListCard