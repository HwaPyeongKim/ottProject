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
import MovieGenre from "./component/movie/Genre";
import Tv from "./component/tv/Main";
import TvDetail from "./component/tv/Detail";
import TvSeason from "./component/tv/Season";
import TvGenre from "./component/tv/Genre";

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
import KakaoIdLogin from "./component/member/KakaoIdLogin";
import EditKakao from "./component/member/EditKakao";
import Join from "./component/member/Join";
import UserList from "./component/member/UserList";
import MyList from "./component/member/MyList";
// import Myfollow from "./component/member/Myfollow";
// import Myfollower from "./component/member/Myfollower";
import Follow from "./component/member/Follow";
import Follower from "./component/member/Follower";
// import FollowMemberView from "./component/member/FollowMemberView";
import SocialList from "./component/member/SocialList";
import ConfirmEmailCode from "./component/member/ConfirmEmailCode";
import AddTitle from "./component/member/AddTitle";
import UserListView from "./component/member/UserListView";
// import MyListView from "./component/member/MyListView";
import PageView from "./component/member/PageView";
// import MypageView from "./component/member/MypageView";
import TitleRating from "./component/member/TitleRating";
import TitleReview from "./component/member/TitleReview";
import UserCommunity from "./component/member/UserCommunity";
import Chatbot from './component/Chatbot'
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
            <Route path="/discover" element={<Discover />} />
            <Route path="/movie" element={<Movie />} />
            <Route path="/movie/detail/:id" element={<MovieDetail />} />
            <Route path="/movie/genre/:gid" element={<MovieGenre />} />
            <Route path="/tv" element={<Tv />} />
            <Route path="/tv/detail/:id" element={<TvDetail />} />
            <Route path="/tv/season/:id/:snum" element={<TvSeason />} />
            <Route path="/tv/genre/:gid" element={<TvGenre />} />

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
            <Route path='/kakaoIdLogin/:userid' element={<KakaoIdLogin />} />
            <Route path='/editKakao' element={<EditKakao />} />
            <Route path="/join/:confirmemail" element={<Join />} />
            <Route path="/userList/:userMidx" element={<UserList />} />
            <Route path="/mylist" element={<MyList />} />
            {/* <Route path="/myfollow" element={<Myfollow />} />
            <Route path="/myfollower" element={<Myfollower />} /> */}
            <Route path="/follow/:userMidx" element={<Follow />} />
            <Route path="/follower/:userMidx" element={<Follower />} />
            {/* <Route path="/followMemberView/:followMemberId" element={<FollowMemberView />} /> */}
            <Route path="/socialList/:socialId" element={<SocialList />} />
            <Route path="/confirmEmailCode" element={<ConfirmEmailCode />} />
            <Route path="/addTitle" element={<AddTitle />} />
            <Route path="/userListView/:listidx/:userMidx" element={<UserListView />} />
            {/* <Route path="/myListView/:listidx" element={<MyListView />} /> */}
            <Route path="/pageView/:userMidx" element={<PageView />} />
            {/* <Route path="/mypageView" element={<MypageView />} /> */}
            <Route path="/titleRating/:userMidx" element={<TitleRating />} />
            <Route path="/titleReview/:userMidx" element={<TitleReview />} />
            <Route path="/userCommunity/:userMidx" element={<UserCommunity />} />
            {/* dg */}
            
        </Routes>
      </div>

      <div className='chatbot-floating-btn'><Chatbot className='chatComponent'/></div>
    </div>
  );
}

export default App;
