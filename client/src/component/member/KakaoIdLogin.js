// KakaoIdLogin.js
import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { loginAction } from '../../store/userSlice';
import axios from 'axios'
import { Cookies } from 'react-cookie';

function KakaoIdLogin() {

    const {userid} = useParams()
    const navigate = useNavigate()
    const cookies = new Cookies()
    const dispatch = useDispatch();

    const [snsid, setSnsid] = useState('')
    const [nickname, setNickname] = useState('')
    const [profileimg, setProfileimg] = useState()

    useEffect(
        // ()=>{
        //     axios.get('/api/member/getSnsUser', {params:{snsid:userid}})
        //     .then((result)=>{
        //         if( result.data.msg == 'no' ){
        //             return alert("이메일 또는 패스워드 오류입니다");
        //         }else{}
        //         let LUser = result.data.snsUser
        //         cookies.set('user', JSON.stringify(LUser), {path:'/', })
        //         dispatch( loginAction( LUser ) )
        //         console.log("에딧검사 : ", result.data.edit)
        //         if( result.data.edit === 'no' ){
        //             navigate('/editKakao')
        //         }else{
        //             navigate('/')
        //         }
        //     }).catch((err)=>{console.error(err)})
        // }, []
        ()=>{
            // axios.post('/api/member/getKakaoUser', null, {params:{ snsid:userid, password:'KAKAO'}})
            // .then((result)=>{
            //     if( result.data.msg == 'no' ){
            //         return alert("이메일 또는 패스워드 오류입니다");
            //     }else{
            //         setSnsid(result.data.KakaoUser.snsid)
            //         setNickname(result.data.KakaoUser.nickname)
            //         setProfileimg(result.data.KakaoUser.profileimg)
            //         console.log('KakaoUser', result.data.KakaoUser );
            //     }
            // })
            axios.get('/api/member/getSnsUser', {params:{snsid:userid}})
            .then((result)=>{
                if( result.data.msg === 'no' ){
                    return alert("이메일 또는 패스워드 오류입니다");
                }else{
                    const user = result.data.snsUser;
                    cookies.set('user', JSON.stringify(user), {path:'/', })
                    dispatch( loginAction( user ) )
                    if( result.data.edit === 'no' ){
                        navigate('/editKakao')
                    }else{
                        login(user)
                    }    
                }
                // let LUser = result.data.snsUser
                // cookies.set('user', JSON.stringify(LUser), {path:'/', })
                // dispatch( loginAction( LUser ) )
                // console.log("에딧검사 : ", result.data.edit)
                // if( result.data.edit === 'no' ){
                //     navigate('/editKakao')
                // }else{
                //     navigate('/')
                // }
            }).catch((err)=>{console.error(err)})
        },[]
    )

    function login(user){
        axios.post('/api/member/login', null, { params: { username: user.email, password: 'KAKAO' } })
        .then((result) => {
            if (result.data.error === 'ERROR_LOGIN') {
                return alert("이메일 또는 패스워드 오류입니다");
            } else {
                console.log('KakaoUser : ', result.data );
                cookies.set('user', JSON.stringify(result.data), { path: '/' })
                dispatch(loginAction(result.data))
                navigate('/')
            }
        })
        .catch((err) => console.error(err))
    }

    return (
        <div>
            
        </div>
    )
}

export default KakaoIdLogin