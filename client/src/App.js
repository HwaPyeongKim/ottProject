import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";

import "./style/reset.css";
import "./style/common.css";
import "./style/list.css";

import Header from "./component/Header";

import Main from "./component/Main";

import Movie from "./component/movie/Main";

//---------------------------------------------------- dg
import Login from "./component/member/Login";
import Join from "./component/member/Join";
//---------------------------------------------------- dg

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {

  return (
    <div>
      <div className="container">
        <Header />

        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/movie" element={<Movie />} />
            {/* dg */}
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            {/* dg */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
