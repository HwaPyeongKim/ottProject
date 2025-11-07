import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Cookies } from "react-cookie";
import axios from "axios";
import { useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faUser, faBars, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import "../style/common.css";
import "../style/commonj.css";

function Header() {
  const loginUser = useSelector(state=>state.user);

  const location = useLocation();
  const url = window.location.href;
  const firstPart = url.split("/").filter(Boolean)[1]; 
  const pathParts = url.split("/").filter(Boolean);
  const firstPath = location.pathname.replace(/^\/+/, "").split("/")[0];

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(
    ()=>{

    },[]
  )

  return (
    <header>
      <div className="logo">
        <img src="" alt="logo" />
      </div>
      <ul className="gnb">
        <li className={firstPath === "" || firstPath === "#" ? "on" : ""}><a href="/">홈</a></li>
        <li className={firstPath === "movie" ? "on" : ""}><a href="/movie">영화</a></li>
        <li className={firstPath === "tv" ? "on" : ""}><a href="/tv">티비</a></li>
        <li className={firstPath === "community" ? "on" : ""}><a href="/community">커뮤니티</a></li>
      </ul>
      <div className="search">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <input type="text" placeholder="영화 또는 TV 프로그램 검색" />
      </div>
      <div className="userinfo">
        <FontAwesomeIcon icon={faUser} />
      </div>

      <div className="menu">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {/* 슬라이드 애니메이션 메뉴 */}
      <div className={`dropdown-menu ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><a href="/company">회사소개</a></li>
          <li><a href="/qna">Q & A</a></li>
        </ul>
      </div>
    </header>
  )
}

export default Header