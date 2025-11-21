// KakaoIdLogin.js
import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { loginAction } from '../../store/userSlice';
import axios from 'axios'
import { Cookies } from 'react-cookie';
import jaxios from '../../util/JWTUtil';

import DaumPostcode from "react-daum-postcode";
import Modal from 'react-modal'

function KakaoIdLogin() {

    const {userid} = useParams()
    const navigate = useNavigate()
    const cookies = new Cookies()
    const dispatch = useDispatch();

    const [name, setName] = useState('')
        const [nickname, setNickname] = useState('')
        const [email, setEmail] = useState('')
        const [reid, setReid]=useState('')
        const [pwd, setPwd] = useState('')
        const [pwdChk, setPwdChk] = useState('');
        //const [phone, setPhone] = useState('')
        const [phone1, setPhone1] = useState('010')
        const [phone2, setPhone2] = useState('')
        const [phone3, setPhone3] = useState('')
        const [zipnum, setZipnum] = useState('')
        const [address1, setAddress1] = useState('')
        const [address2, setAddress2] = useState('')
        const [profileimg, setProfileimg] = useState('')
        const [profilemsg, setProfilemsg] = useState('')
        const [useridStyle, setUseridStyle] = useState({fontWeight:'bold', textalign:'center'})
        const [message, setMessage] = useState('')
    
        const [imgSrc, setImgSrc] = useState('')
        const [imgStyle, setImgStyle] = useState({display:"none"});
    
        const [isOpen, setIsOpen] = useState(false)

    useEffect(
        ()=>{
            axios.post('/api/member/getKakaoUser', null, {params:{ snsid:userid, password:'KAKAO'}})
            .then((result)=>{
                if( result.data.msg == 'no' ){
                    return alert("이메일 또는 패스워드 오류입니다");
                }else{
                    console.log('KakaoUser', result.data.KakaoUser );
                    // dispatch( loginAction( result.data ) );
                    // cookies.set('user', JSON.stringify(result.data), {path:'/',});
                    // navigate('/');
                }
            })
        },[]
    )

    function fileUpload(e){
        const formData = new FormData()
        formData.append('image', e.target.files[0])
        axios.post( '/api/member/upload', formData)
        .then((result)=>{
            setImgSrc(result.data.image);
            setImgStyle({display:"block", width:"200px"});
            setProfileimg(result.data.fidx)
        }).catch((err)=>{console.error(err)})
    }

    function toggle(){
        setIsOpen( !isOpen )
    }
    // 모달창을 위한 style
    const customStyles = {
        overlay: { backgroundColor: "rgba( 0 , 0 , 0 , 0.5)", },
        content: {
            left: "0",
            margin: "auto",
            width: "500px",
            height: "600px",
            padding: "0",
            overflow: "hidden",
        },
    };
    const completeHandler=(data)=>{
        setZipnum(data.zonecode)
        setAddress1(data.address)
        // if( data.buildingName !== ''){
        //     setAddress3('(' + data.buildingName + ')')
        // }else if( data.bname !== ''){
        //     setAddress3('(' + data.bname + ')')
        // }
        setIsOpen(false);
    }

    function onSubmit(){

    }
    
    return (
        <div>
            카카오 추가 로그인
            <div>
                <label style={{color:'white'}}>E-MAIL</label>
                <input type='text' value={email} onChange={(e)=>{setEmail(e.currentTarget.value)}}/>
            </div>
            <div>
                <label style={{color:'white'}}>PASSWORD</label>
                <input type='password' value={pwd} onChange={(e)=>{setPwd(e.currentTarget.value)}}/>
            </div>
            <div>
                <label style={{color:'white'}}>RETYPE PW</label>
                <input type="password"  value={pwdChk} onChange={(e)=>{ setPwdChk(e.currentTarget.value )}}/>
            </div>
            <div>
                <label style={{color:'white'}}>NAME</label>
                <input type="text"  value={name} onChange={(e)=>{ setName(e.currentTarget.value )}}/>
            </div>
            <div>
                <label style={{color:'white'}}>NICKNAME</label>
                <input type="text"  value={nickname} onChange={(e)=>{ setNickname(e.currentTarget.value )}}/>
            </div>
            <div>
                <label style={{color:'white'}}>PHONE</label>
                <input type="text"  value={phone1} maxLength='3' onChange={(e)=>{ setPhone1(e.currentTarget.value )}}/>
                -
                <input type="text"  value={phone2} maxLength='4' onChange={(e)=>{ setPhone2(e.currentTarget.value )}}/>
                -
                <input type="text"  value={phone3} maxLength='4' onChange={(e)=>{ setPhone3(e.currentTarget.value )}}/>
            </div>
            <div>
                <label style={{color:'white'}}>POST CODE</label>
                <input type="text" value={zipnum} onChange={(e)=>{ setZipnum(e.currentTarget.value )}} readOnly/>
                <button style={{flex:'1'}} onClick={ ()=>{ setIsOpen( !isOpen ) }}>SEARCH</button>
                <div style={{flex:'2'}} ></div>
            </div>

            <div>
                <Modal isOpen={isOpen}  ariaHideApp={false}  style={customStyles} >
                    <DaumPostcode onComplete={completeHandler} /><br />
                    <button onClick={()=>{ setIsOpen(false) }}>CLOSE</button>
                </Modal>
            </div>
            <div>
                <label style={{color:'white'}}>ADDRESS</label>
                <input type="text"  value={address1} onChange={(e)=>{ setAddress1(e.currentTarget.value )}}/>
            </div>

            <div>
                <label style={{color:'white'}}>DETAIL ADDRESS</label>
                <input type="text"  value={address2} onChange={(e)=>{ setAddress2(e.currentTarget.value )}}/>
            </div>
            <div>
                <label style={{color:'white'}}>INTRO</label>
                <input type="text"  value={profilemsg} onChange={(e)=>{setProfilemsg(e.currentTarget.value)}}/>
            </div>
            <div>
                <label style={{color:'white'}}>PROFILE IMG</label>
                <input type="file" onChange={(e)=>{fileUpload(e)}}/>
            </div>
            <div>
                <label style={{color:'white'}}>PROFILE IMG PREVIEW</label>
                {
                    (imgSrc)?(<div><img src={imgSrc} style={imgStyle} /></div>):(<p>이미지 로딩 중...</p>)
                }
            </div>
            <div>
                <button onClick={()=>{onSubmit()}}>JOIN</button>
                <button onClick={()=>{ navigate('/')}}>BACK</button>
            </div>
        </div>
    )
}

export default KakaoIdLogin