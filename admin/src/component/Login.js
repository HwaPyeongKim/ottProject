import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Cookies } from "react-cookie";
import axios from "axios";
import { loginAction } from "../store/userSlice";

function Login() {
  const loginUser = useSelector(state=>state.user);
  const navigate = useNavigate();
  const cookies = new Cookies();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [message, setMessage] = useState("");


  useEffect(
    ()=>{
      if (loginUser && loginUser.midx && loginUser.role > 1) {
        navigate("/memberList");
      }
    },[]
  )

  function onLoginlocal() {
    if (!email) return alert("이메일을 입력하세요")
    if (!pwd) return alert("패스워드를 입력하세요")

    axios.post("/api/member/login", null, { params: { username: email, password: pwd } })
    .then((result) => {
      if (result.data.error === "ERROR_LOGIN") {
        setMessage("이메일과 패스워드를 확인하세요");
      } else {
        if (result.data.role < 2) {
          setMessage("관리자 권한이 없는 계정입니다");
        } else {
          cookies.set("user", JSON.stringify(result.data), { path: "/" });
          dispatch(loginAction(result.data));
          navigate("/memberList");
        }
      }
    })
    .catch((err) => console.error(err))
  }


  return (
    <div className="login-form">
      <h2>관리자 로그인</h2>
      <div className="field">
        <label htmlFor="email">아이디</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
      </div>
      <div className="field">
        <label htmlFor="password">비밀번호</label>
        <input type="password" id="password" value={pwd} onChange={(e) => setPwd(e.currentTarget.value)} />
      </div>
      <div className="btns">
        <button className="btn btn-primary" onClick={onLoginlocal}>LOGIN</button>
      </div>
      <div className="sns-btns">
        <button className="btn-sns kakao" onClick={() => (window.location.href = "http://localhost:8070/member/kakaostart")}>KAKAO</button>
      </div>
      <div className="notice">{message}</div>
    </div>
  )
}

export default Login