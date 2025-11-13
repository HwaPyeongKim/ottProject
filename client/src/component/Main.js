import React , {useState, useEffect} from 'react'
import axios from 'axios'
import {Cookies, useCookies} from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../store/userSlice';

function Main() {

  const loginUser = useSelector(state=>state.user)

  useEffect(
    ()=>{
      console.log("로그인유저 데이터 : ", loginUser)
    },[]
  )

  return (
    <div style={{color:"orange", fontSize:"100px", fontWeight:"bold"}}>메인페이지 입니다.</div>
  )
}

export default Main