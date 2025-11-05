// userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {Cookies} from "react-cookie";
const cookies = new Cookies()

const initialState={
    midx:"",
    name:"",
    nickname:"",
    email:"",
    pwd:"",
    phone:"",
    zipnum:"",
    address1:"",
    address2:"",
    provider:"",
    profileimg:"",
    profilemsg:"",
    indate:"",
    deleteyn:"",
    role:"",
    accessToken:"",
    refreshToken:"",
}

// 쿠키에 저장된 로그인 유저 정보를 읽어와서 리턴해주는 함수
const getLoginUser=()=>{
    const member = cookies.get("user");
    if( member && member.midx ){
        member.midx = decodeURIComponent( member.midx );
        member.name = decodeURIComponent( member.name );
        member.nickname = decodeURIComponent( member.nickname );
        member.pwd = decodeURIComponent( member.pwd );
        member.email = decodeURIComponent( member.email );
        member.phone = decodeURIComponent( member.phone );
        member.zipnum = decodeURIComponent( member.zipnum );
        member.address1 = decodeURIComponent( member.address1 );
        member.address2 = decodeURIComponent( member.address2 );
        member.provider = decodeURIComponent( member.provider );
        member.profileimg = decodeURIComponent( member.profileimg );
        member.profilemsg = decodeURIComponent( member.profilemsg );
        member.indate = decodeURIComponent( member.indate );
        member.deleteyn = decodeURIComponent( member.deleteyn );
        member.role = decodeURIComponent( member.role );
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
                state.midx = action.payload.midx;
                state.name = action.payload.name;
                state.nickname =action.payload.nickname;
                state.email = action.payload.email;
                state.pwd = action.payload.pwd;
                state.phone = action.payload.phone;
                state.zipnum = action.payload.zipnum;
                state.address1 = action.payload.address1;
                state.address2 = action.payload.address2;
                state.provider = action.payload.provider;
                state.profileimg = action.payload.profileimg;
                state.profilemsg = action.payload.profilemsg;
                state.indate = action.payload.indate;
                state.deleteyn = action.payload.deleteyn;
                state.role = action.payload.role;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            },
            logoutAction : (state)=>{
                state.midx = "";
                state.name = "";
                state.nickname = "";
                state.email = "";
                state.pwd = "";
                state.phone = "";
                state.zipnum = "";
                state.address1 = "";
                state.address2 = "";
                state.provider = "";
                state.profileimg = "";
                state.profilemsg = "";
                state.indate = "";
                state.deleteyn = "";
                state.role = "";
                state.accessToken = "";
                state.refreshToken = "";
            }
        }
    }
)

export const { loginAction, logoutAction, } = userSlice.actions
export default userSlice.reducer