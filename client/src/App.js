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

//---------------------------------------------------- gy
import BoardMain from "./component/board/BoardMain";
import WriteForm from "./component/board/WriteForm";
import ModalTest from "./component/board/ModalTest";
import UpdateForm from "./component/board/UpdateForm";
//---------------------------------------------------- gy

import Company from "./component/customer/Company";
import Qna from "./component/customer/Qna";


//---------------------------------------------------- dg
import Login from "./component/member/Login";
import Join from "./component/member/Join";
import MyList from "./component/member/MyList";
import Myfollow from "./component/member/Myfollow";
import InsertList from "./component/member/InsertList";
import FollowMemberView from "./component/member/FollowMemberView";
import SocialList from "./component/member/SocialList";
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
            <Route path="/search/:keyword" element={<Search />} />
            <Route path="/movie" element={<Movie />} />
            <Route path="/movieDetail/:id" element={<MovieDetail />} />

            {/* gy */}
            <Route path="/community" element={<BoardMain />} />
            <Route path="/writeForm" element={<WriteForm />} />
            <Route path="/test" element={<ModalTest />} />
            <Route path="/updateForm/:bidx" element={<UpdateForm />} />
            {/* gy */}

            <Route path="/company" element={<Company />} />
            <Route path="/qna" element={<Qna />} />

            {/* dg */}
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/mylist" element={<MyList />} />
            <Route path="/myfollow" element={<Myfollow />} />
            <Route path="/insertList" element={<InsertList />} />
            <Route path="/followMemberView/:followMemberId" element={<FollowMemberView />} />
            <Route path="/socialList/:socialId" element={<SocialList />} />
            {/* dg */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
