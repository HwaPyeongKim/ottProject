import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Detail() {
  const baseUrl = "https://api.themoviedb.org/3";

  const {type} = useParams();
  const {id} = useParams();
  const [item, setItem] = useState({});

  async function findMovie (type, id) {
    try {
      const result = await axios.get(`${baseUrl}/${type}/${id}?language=ko-KR&region=KR&api_key=${process.env.REACT_APP_KEY}`);
      if (result.data.adult === true) {
        
      }
      const providers = await axios.get(`${baseUrl}/${type}/${id}/watch/providers?api_key=${process.env.REACT_APP_KEY}`);
      if (providers.data.results && providers.data.results["KR"]) {
        result.data.providers = providers.data.results["KR"];
      }
      setItem(result.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(
    ()=>{
      findMovie(type, id);
    },[]
  )


  return (
    <section className="content_info">
      <div className="top" style={{backgroundImage: `linear-gradient(to right, rgba(6, 13, 23, 1) 0%, rgba(6, 13, 23, 1) 58%, rgba(6, 13, 23, 0) 100%), url(https://image.tmdb.org/t/p/w780${item.backdrop_path})`,backgroundSize: "auto",backgroundPosition: "center right",backgroundRepeat: "no-repeat"}}>
        <h2>{item.title} <span>[{item.release_date ? item.release_date.substr(0,4) : null}]</span></h2>
        <p>원제 : {item.original_title}</p>
        <div>
          <span></span>
          <span>재생시간 : {item.runtime} 분</span>
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

                  const logos = [
                    {key: 8, label: "netflix"},
                    {key: 1796, label: "netflixbasicwithads"},
                    {key: 356, label: "wavve"},
                    {key: 97, label: "watcha"},
                    {key: 337, label: "disneyplus"},
                    {key: 2, label: "appletvplus"},
                    {key: 9, label: "amazonprimevideo"},
                    {key: 10, label: "amazonprimevideo"},
                    {key: 3, label: "play"},
                    {key: 1883, label: "tving"}
                  ]

                  const available = types.filter(
                    (type) => item.providers[type.key]?.length > 0
                  );

                  if (available.length === 0) {
                    return <div>시청할 수 있는 OTT가 없습니다.</div>;
                  }

                  return available.map((type) => (
                    <div key={type.key}>
                      <h4>{type.label}</h4>
                      <ul>
                        {item.providers[type.key].map((provider, idx) => {
                          // provider_id와 logos 배열 매칭
                          const logo = logos.find((l) => l.key === provider.provider_id);

                          return (
                            <li key={`${type.key}-${idx}`}>
                              {logo ? (
                                <img
                                  src={`http://localhost:8070/images/${logo.label}.jpeg`}
                                  alt={`${provider.provider_name} 로고`}
                                />
                              ) : (
                                <span>{provider.provider_name}</span> // 로고 없으면 이름 표시
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ));
                })()
              ) : (
                <div className="noProviders">시청할 수 있는 OTT가 없습니다.</div>
              )
            }
          </div>

          <div className="synopsis">
            <h3>시놉시스</h3>
            <p>{item.overview}</p>
          </div>
        </div>
        <div className="right">

        </div>
      </div>
    </section>
  )
}

export default Detail