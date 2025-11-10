import React , {useState, useEffect} from 'react'
import axios from 'axios'
import {Cookies} from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../../store/userSlice';

function Login() {

    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const navigate = useNavigate()
    const cookies = new Cookies()
    const dispatch = useDispatch()

    function onLoginlocal(){
        if( !email ){ return alert('이메일을 입력하세요')}
        if( !pwd ){ return alert('패스워드를 입력하세요')}

        axios.post('/api/member/login', null, { params:{username:email, password:pwd} })
        .then((result)=>{   
            console.log(result.data)
            if(result.data.error == 'ERROR_LOGIN'){
                return alert('이메일과 패스워드를 확인하세요')
            }else{
                alert(result.data.nickname +'님이 로그인하셨습니다')
                cookies.set('user', JSON.stringify( result.data ) , {path:'/', })
                dispatch( loginAction( result.data ) )
                navigate('/')
            }
        }).catch((err)=>{console.error(err)})
    }

    return (
        <article>
            <div className='subPage'>
                <div className='memberform'>
                    <div className='field'>
                        <label style={{color:'white'}}>USERID</label>
                        <input type='text' value={email} onChange={(e)=>{setEmail( e.currentTarget.value)}}/>
                    </div>
                    <div className='field'>
                        <label style={{color:'white'}}>PASSWORD</label>
                        <input type='password'  value={pwd} onChange={(e)=>{setPwd( e.currentTarget.value)}}/>
                    </div>
                    <div className='btns'>
                        <button style={{background:'blueViolet', margin:'2px', color:'white'}} onClick={()=>{ onLoginlocal() }}>LOGIN</button>
                        <button style={{background:'white', margin:'2px'}} onClick={()=>{ navigate('/join')}}>JOIN</button>
                    </div>
                    <div className="sns-btns">
                        <button style={{background:'yellow', margin:'2px'}} onClick={
                            ()=>{window.location.href='http://localhost:8070/member/kakaostart'}
                        }>KAKAO</button>
                        {/* <button style={{background:'green', color:'white', margin:'2px'}}>NAVER</button>
                        <button style={{background:'red', color:'white', margin:'2px'}}>GOOGLE</button>
                        <button style={{background:'blue', color:'white', margin:'2px'}}>FACEBOOK</button> */}
                    </div>
                </div>
            </div>
        </article>
    )
}

export default Login
