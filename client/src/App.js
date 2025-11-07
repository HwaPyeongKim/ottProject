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

import Search from "./component/Search";

import Movie from "./component/movie/Main";
import MovieDetail from "./component/movie/Detail";

import BoardMain from "./component/board/BoardMain";
import WriteForm from "./component/board/WriteForm";
import ModalTest from "./component/board/ModalTest";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {

  return (
    <div>
      <div className="container">
        <Header />

        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/search/:keyword" element={<Search />} />
            <Route path="/movie" element={<Movie />} />
            <Route path="/community" element={<BoardMain />} />
            <Route path="/writeForm" element={<WriteForm />} />
            <Route path="/movieDetail/:id" element={<MovieDetail />} />
            <Route path="/test" element={<ModalTest />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
