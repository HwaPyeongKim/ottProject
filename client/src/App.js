import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";

import "./style/reset.css";
import "./style/common.css";
import "./style/list.css";
import 'swiper/css';

import Header from "./component/Header";

import Main from "./component/Main";

import Detail from "./component/Detail";

import Movie from "./component/movie/Main";

import Board from "./component/board/Board";
import ModalTest from "./component/board/ModalTest";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {

  return (
    <div>
      <div class="container">
        <Header />

        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/movie" element={<Movie />} />
            <Route path="/detail/:type/:id" element={<Detail />} />

            <Route path="/community" element={<Board />} />
            <Route path="/test" element={<ModalTest />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
