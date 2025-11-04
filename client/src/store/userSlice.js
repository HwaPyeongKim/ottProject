// userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {Cookies} from "react-cookie";
const cookies = new Cookies()

const initialState={
    userid:"",
    pwd:"",
    name:"",
    email:"",
    phone:"",
    postcode:"",
    address1:"",
    address2:"",
    indate:"",
    provider:"",
    snsid:"",
    accessToken:"",
    refreshToken:"",
}

// 쿠키에 저장된 로그인 유저 정보를 읽어와서 리턴해주는 함수
const getLoginUser=()=>{
    const member = cookies.get("user");
    if( member && member.userid ){
        member.userid = decodeURIComponent( member.userid );
        member.pwd = decodeURIComponent( member.pwd );
        member.name = decodeURIComponent( member.name );
        member.phone = decodeURIComponent( member.phone );
        member.email = decodeURIComponent( member.email );
        member.postcode = decodeURIComponent( member.postcode );
        member.address1 = decodeURIComponent( member.address1 );
        member.address2 = decodeURIComponent( member.address2 );
        member.indate = decodeURIComponent( member.indate );
        member.provider = decodeURIComponent( member.provider );
        member.snsid = decodeURIComponent( member.snsid );
        member.accessToken = decodeURIComponent( member.accessToken );
        member.refreshToken = decodeURIComponent( member.refreshToken );
    }
    return member
}

export const userSlice = createSlice(
    {
        name:"user",
        initialState : getLoginUser() || initialState,
        reducers:{
            loginAction : (state, action)=>{
                state.userid = action.payload.userid;
                state.pwd = action.payload.pwd;
                state.name = action.payload.name;
                state.email = action.payload.email;
                state.phone = action.payload.phone;
                state.postcode = action.payload.postcode;
                state.address1 = action.payload.address1;
                state.address2 = action.payload.address2;
                state.indate = action.payload.indate;
                state.provider = action.payload.provider;
                state.snsid = action.payload.snsid;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            },
            logoutAction : (state)=>{
                state.userid = "";
                state.pwd  = "";
                state.name = "";
                state.email = "";
                state.phone = "";
                state.postcode = "";
                state.address1 = "";
                state.address2 = "";
                state.indate = "";
                state.provider = "";
                state.snsid = "";
                state.accessToken = "";
                state.refreshToken = "";
            }
        }
    }
)

export const { loginAction, logoutAction } = userSlice.actions
export default userSlice.reducer