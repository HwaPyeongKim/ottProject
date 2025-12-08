import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import { useSelector } from "react-redux";

import "./style/admin.css";
// import "./style/common.css";
import "./style/reset.css";
import "./style/commonj.css";

import Login from "./component/Login";

import Submenu from "./component/Submenu";

import MemberList from "./component/admin/MemberList";
import QnaList from "./component/admin/QnaList";
import QnaAdminView from "./component/admin/QnaAdminView";
import SpoilerList from "./component/admin/SpoilerList";


function App() {
  const loginUser = useSelector(state=>state.user);
  const navigate = useNavigate();

  useEffect(
    ()=>{
      if (!loginUser || loginUser.role < 2) {
        navigate("/");
      }
    },[]
  )

  return (
    <div>
      <div className="container">
        {
          (loginUser && loginUser.midx && loginUser.role > 1) ? <Submenu /> : null
        }

        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/memberList" element={<MemberList />} />
            <Route path="/qnaList" element={<QnaList />} />
            <Route path="/qnaAdminView/:qidx" element={<QnaAdminView />} />
            <Route path="/SpoilerList" element={<SpoilerList />} />
            
        </Routes>
      </div>
    </div>
  );
}

export default App;
