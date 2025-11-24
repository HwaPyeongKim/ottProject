import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";

import "./style/admin.css";
// import "./style/common.css";
import "./style/commonj.css";


import Submenu from "./component/Submenu";

import MemberList from "./component/admin/MemberList";
import QnaList from "./component/admin/QnaList";
import SpoilerList from "./component/admin/SpoilerList";


function App() {

  return (
    <div>
      <div className="container">
        <Submenu />

        <Routes>
            <Route path="/memberList" element={<MemberList />} />
            <Route path="/qnaList" element={<QnaList />} />
            <Route path="/SpoilerList" element={<SpoilerList />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
