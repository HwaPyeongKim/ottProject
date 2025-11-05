import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Cookies } from "react-cookie";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faUser, faBars, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import "../style/common.css";
import logo from "../images/20251105_121058396.png"

function Header() {
  const loginUser = useSelector(state=>state.user);

  const url = window.location.href;
  const firstPart = url.split("/").filter(Boolean)[1]; 
  const pathParts = url.split("/").filter(Boolean);
  const firstPath = pathParts[2];

  const navigate = useNavigate()

  useEffect(
    ()=>{

    },[]
  )

  return (
    <header>
      <div className="logo">
        <img src={logo} alt="logo" style={{width:'160px', height:'90px'}}/>
      </div>
      <ul className="gnb">
        <li><a href="/">홈</a></li>
        <li className={firstPath === "new" ? "on" : ""}><a href="/movie">영화</a></li>
        <li className={firstPath === "popular" ? "on" : ""}><a href="/tv">TV 프로그램</a></li>
        <li className={firstPath === "community" ? "on" : ""}><a href="/community">커뮤니티</a></li>
      </ul>
      <div className="search">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <input type="text" placeholder="영화 또는 TV 프로그램 검색" />
      </div>
      <div className="userinfo">
        <FontAwesomeIcon icon={faUser} onClick={ ()=>{ navigate('/login') }}/>
      </div>
      <div className="menu">
        <button>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
    </header>
  )
}

export default Header