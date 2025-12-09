import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars } from "@fortawesome/free-solid-svg-icons";

import "../style/common.css";
import logo from "../images/84584584584.png"
import Mypage from './member/Mypage'
import "../style/commonj.css";

function Header() {
  const navigate = useNavigate();
  const loginUser = useSelector(state=>state.user);

  const location = useLocation();
  const firstPath = location.pathname.replace(/^\/+/, "").split("/")[0];

  const [menuOpen, setMenuOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);

  const submenuRef = useRef(null);

  useEffect(() => {
    setOpen(false);
    console.log('로그인유저 : ', loginUser)
    if (!loginUser.profileimg) return;

    axios.get(`/api/file/url/${loginUser.profileimg}`)
      .then((result) => setImgSrc(result.data.image))
      .catch((err) => console.error(err));
  }, [loginUser.profileimg]);

  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith("/search/")) {
      const extractedKeyword = decodeURIComponent(path.replace("/search/", ""));
      setKeyword(extractedKeyword);
    }
  }, [location.pathname]);


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && keyword.trim() !== "") {
      navigate(`/search/${encodeURIComponent(keyword)}`);
    }
  };

  // ⭐ 메뉴 외부 클릭 시 자동 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (submenuRef.current && !submenuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <header>
      {/* 🔥 블러 배경 이미지 */}
      {location.pathname === "/" && (
        <div
          className="home-bg"
          style={{ backgroundImage: `url(http://localhost:8070/public/main.png)` }}
        ></div>
      )}
      <div className="logo">
        <img src={logo} alt="logo" style={{width:'160px', height:'90px'}} onClick={()=>{navigate("/")}} />
      </div>

      <ul className="gnb">
        <li className={firstPath === "" || firstPath === "#" ? "on" : ""}><Link to="/">홈</Link></li>
        <li className={firstPath === "movie" ? "on" : ""}><Link to="/movie">영화</Link></li>
        <li className={firstPath === "tv" ? "on" : ""}><Link to="/tv">티비</Link></li>
        <li className={firstPath === "community" ? "on" : ""}><Link to="/community">커뮤니티</Link></li>
      </ul>

      <div className="search">
        <input
          type="text"
          value={keyword}
          placeholder="영화 또는 TV 프로그램 검색"
          onChange={(e) => setKeyword(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="userinfo">
        {
          (loginUser && loginUser.midx)
          ? (
            <>
              <img
                src={imgSrc}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  marginRight: '8px',
                  verticalAlign: 'middle'
                }}
                onClick={() => setOpen(true)}
              />

              <div
                style={{ verticalAlign: 'middle' }}
                onClick={() => setOpen(true)}
              >
                {loginUser.nickname.length > 6
                  ? `${loginUser.nickname.slice(0, 6)}...`
                  : loginUser.nickname
                } 님
              </div>

              {open && <Mypage onClose={() => setOpen(false)} />}
            </>
          )
          : (
            <FontAwesomeIcon
              icon={faUser}
              style={{ color: "#fff", fontSize: "20px", cursor: 'pointer' }}
              onClick={() => navigate('/login')}
            />
          )
        }
      </div>

      <div className="menu">
        <button
          onClick={(e) => {
            e.stopPropagation(); // ⭐ 메뉴 버튼 클릭 시 외부 클릭 이벤트 막기
            setMenuOpen(!menuOpen);
          }}
        >
          <FontAwesomeIcon icon={faBars} style={{color: "#fff", fontSize: "20px"}}/>
        </button>
      </div>

      {/* ⭐ 외부 클릭 감지를 위한 ref 적용 */}
      <div
        className={`dropdown-submenu ${menuOpen ? "open" : ""}`}
        ref={submenuRef}
      >
        <ul>
          <li><Link to="/company">회사소개</Link></li>
          <li><Link to="/qna">Q & A</Link></li>
          {
            (loginUser && loginUser.midx && loginUser.role > 1) ?
            <li>
              <a href="http://3.34.168.161:3001" target="_blank" rel="noopener noreferrer">관리자 페이지</a>
            </li>
            : null
          }
        </ul>
      </div>
    </header>
  );
}

export default Header;
