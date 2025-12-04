import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import jaxios from "../util/JWTUtil";
import { ottInfos } from "../constants/ottInfos";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faThumbsUp, faCheck } from "@fortawesome/free-solid-svg-icons";

const ListCard = ({ lists, target, likes, setLikes, favorites, setFavorites }) => {
  const [sliderShow, setSliderShow] = useState(8);
  const loginUser = useSelector(state=>state.user);
  const [selectedLists, setSelectedLists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddListModal, setIsAddListModal] = useState(false);
  const [listTitle, setListTitle] = useState("");
  const [security, setSecurity] = useState("N");
  const [myList, setMyList] = useState([]);
  const [selected, setSelected] = useState({});

  const settings = {
    dots: true,
    speed: 500,
    slidesToShow: sliderShow,
    slidesToScroll: sliderShow,
    arrows: true
  };
  
  async function like(id) {
    if (!loginUser?.midx) {
      alert("로그인이 필요한 서비스 입니다");
      return;
    }
    
    try {
        await jaxios.post("/api/main/like", {midx: loginUser.midx, dbidx: id});
        await getMyLikes(); 
    } catch (err) {
        console.error("좋아요 처리 중 에러 발생:", err);
        alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  }

  async function getMyLikes() {
    try {
      const result = await jaxios.get("/api/main/getMyLikes", {params: {midx: loginUser.midx}});
      if (result.data !== undefined && result.data.list !== undefined) {
        const dbidxList = result.data.list.map(like => like.dbidx);
        setLikes(dbidxList);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function favorite() {
    if (!loginUser?.midx) {
      alert("로그인이 필요한 서비스 입니다");
      return;
    }
    
    setIsModalOpen(true);
  }

  async function getMyLists() {
    try {
      const result = await jaxios.get("/api/member/getList", {params: {midx: loginUser.midx}});
      setMyList(result.data.myList);
    } catch (err) {
      console.error(err);
    }
  }

  function addList() {
    jaxios.post("/api/main/addList", {title: listTitle, security, midx: loginUser.midx})
    .then((result) => {
      if (result.data.msg === "ok") {
        alert("리스트가 추가되었습니다");
        setIsAddListModal(false);
        setIsModalOpen(false);
        setListTitle("");
        setSecurity("N");
        getMyLists();
      } else {
        alert(result.data.msg);
      }
    })
    .catch((err) => {
      console.error(err);
    });
  }

  function addMyList(item) {
    if (selectedLists.length === 0) {
      alert("추가할 리스트를 선택해주세요");
      return;
    }

    if (item == null) {
      alert("추가할 콘텐츠를 선택해주세요");
      return;
    }
    const title = item.title ? item.title : item.name;
    jaxios.post("/api/main/addLists", {listidxs: selectedLists, dbidx: item.id, posterpath: item.poster_path, title: title, type: target})
    .then((result)=>{
      if (result.data.msg === "ok") {
        alert("리스트를 추가했습니다");
        getMyDblists();
      } else {
        alert(result.data.msg);
      }
    })
    .catch((err)=>{console.error(err);})

    setIsModalOpen(false);
    setSelectedLists([]);
  }

  async function getMyDblists() {
    try {
      const result = await jaxios.get("/api/main/getMyDblists", {params: {midx: loginUser.midx}});
      if (result.data !== undefined && result.data.list !== undefined) {
        const dbidxList = result.data.list.map(favorite => favorite.dbidx);
        setFavorites(dbidxList);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(
    () => {
      if (loginUser?.midx) {
        getMyLikes();
        getMyLists();
        getMyDblists();
      }
    }, [loginUser]
  );

  return (
    <>
      {
        lists && lists.length > 0 ? (
          <Slider {...settings} className="lists">
            {
              lists.map((item, idx)=>{
                return (
                  <div className="list" key={idx}>
                    <div className="cover">
                      <img src={`https://image.tmdb.org/t/p/w185${item.poster_path}`} alt={`${item.title} 포스터`} onError={(e)=>{e.target.src="/images/noposter.png"}} />
                      <Link to={`/${target}/detail/${item.id}`}>
                        <div>
                          {
                            loginUser && loginUser.midx ?
                            <>
                              <button className={`favorite${favorites.includes(item.id) ? " on" : ""}`} onClick={(e)=>{e.preventDefault(); favorite(); setSelected(item)}}><FontAwesomeIcon icon={faBookmark} /></button>
                              <button className={`like${likes.includes(item.id) ? " on" : ""}`} onClick={(e)=>{e.preventDefault(); like(item.id);}}><FontAwesomeIcon icon={faThumbsUp} /></button>
                            </>
                            : null
                          }
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
                      </Link>
                    </div>
                  </div>
                )
              })
            }
            {/* 빈 슬롯 채우기 */}
            {
              lists.length < sliderShow &&
              Array(sliderShow - lists.length).fill(null).map((_, i) => (
                <div className="list empty" key={`empty-${i}`}>
                  <div className="cover empty-cover"></div>
                </div>
              ))
            }
          </Slider>
        ) : (
          <div className="lists noFind">목록을 찾을 수 없습니다</div>
        )
      }

      {isModalOpen && (
        <div className="modalOverlay" onClick={() => setIsModalOpen(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>리스트에 추가 <small>({selected.title ? selected.title : (selected.name ? selected.name : "")})</small></h3>
            <ul>
              {
                myList.length > 0 ? 
                  myList.map((mylist, lidx) => {
                    return (
                      <li key={lidx} className="checkboxWrap selectList">
                        <input type="checkbox" value={mylist.listidx} id={`mylist_${mylist.listidx}`} onChange={(e)=>{const value = parseInt(e.target.value); if (e.target.checked) {setSelectedLists(prev => [...prev, value]);} else {setSelectedLists(prev => prev.filter(id => id !== value));}}} />
                        <label className="flex" htmlFor={`mylist_${mylist.listidx}`}><p>{mylist.title}</p> <b><FontAwesomeIcon icon={faCheck} /></b></label>
                      </li>
                    )
                  })
                : null
              }
              <li className="flex"><p>리스트 새로 만들기</p><button onClick={()=>{setIsAddListModal(true)}}>+</button></li>
            </ul>
            <div className="buttonWrap">
              <button className="mainButton" onClick={()=>{addMyList(selected)}}>추가하기</button>
              <button className="mainButton" onClick={()=>setIsModalOpen(false)}>닫기</button>
            </div>
          </div>
        </div>
      )}

      {isAddListModal && (
        <div className="modalOverlay" onClick={() => setIsAddListModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>리스트 추가</h3>
            <div>
              <input type="text" value={listTitle} onChange={(e)=>{setListTitle(e.currentTarget.value)}} />
              <div className="checkboxWrap">
                <input type="checkbox" value={security} onChange={(e)=>setSecurity(e.target.checked ? "Y" : "N")} id="checkbox_security" />
                <label htmlFor="checkbox_security" className="flex"><p>리스트 노출 여부</p> <b><FontAwesomeIcon icon={faCheck} /></b></label>
              </div>
            </div>
            <div className="buttonWrap">
              <button className="mainButton" onClick={()=>{addList()}}>추가하기</button>
              <button className="mainButton" onClick={()=>setIsAddListModal(false)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListCard