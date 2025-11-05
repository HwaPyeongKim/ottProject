import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";

import "./style/reset.css";
import "./style/common.css";
import "./style/list.css";

import Header from "./component/Header";

import Main from "./component/Main";

import Detail from "./component/Detail";

import Movie from "./component/movie/Main";

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
            <Route path="/detail/:type/:id" element={<Detail />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
