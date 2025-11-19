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
import Discover from "./component/Discover";

import Movie from "./component/movie/Main";
import MovieDetail from "./component/movie/Detail";
import Tv from "./component/tv/Main";
import TvDetail from "./component/tv/Detail";
import TvSeason from "./component/tv/Season";

//---------------------------------------------------- gy
import BoardMain from "./component/board/BoardMain";
import WriteForm from "./component/board/WriteForm";
import ModalTest from "./component/board/ModalTest";
import UpdateForm from "./component/board/UpdateForm";
//---------------------------------------------------- gy

import Company from "./component/customer/Company";
import Qna from "./component/customer/Qna";
import QnaWrite from "./component/customer/QnaWrite";
import QnaView from "./component/customer/QnaView";
import MyQna from "./component/customer/MyQna";




//---------------------------------------------------- dg
import Login from "./component/member/Login";
import Join from "./component/member/Join";
import MyList from "./component/member/MyList";
import Myfollow from "./component/member/Myfollow";
import Myfollower from "./component/member/Myfollower";
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
            <Route path="/discover/:keyword" element={<Discover />} />
            <Route path="/movie" element={<Movie />} />
            <Route path="/movie/detail/:id" element={<MovieDetail />} />
            <Route path="/tv" element={<Tv />} />
            <Route path="/tv/detail/:id" element={<TvDetail />} />
            <Route path="/tv/season/:id/:snum" element={<TvSeason />} />

            {/* gy */}
            <Route path="/community" element={<BoardMain />} />
            <Route path="/writeForm" element={<WriteForm />} />
            <Route path="/test" element={<ModalTest />} />
            <Route path="/updateForm/:bidx" element={<UpdateForm />} />
            {/* gy */}

            <Route path="/company" element={<Company />} />
            <Route path="/qna" element={<Qna />} />
            <Route path="/qnaWrite" element={<QnaWrite />} />
            <Route path="/qnaView/:qidx" element={<QnaView />} />
            <Route path="/myQna" element={<MyQna />} />

            {/* dg */}
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/mylist" element={<MyList />} />
            <Route path="/myfollow" element={<Myfollow />} />
            <Route path="/myfollower" element={<Myfollower />} />
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
