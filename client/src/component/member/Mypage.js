import React , {useState, useEffect} from 'react'
import axios from 'axios'
import {Cookies, useCookies} from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../../store/userSlice';
import DaumPostcode from "react-daum-postcode";
import Modal from 'react-modal'
import '../../style/mypageModal.css'
import jaxios from '../../util/JWTUtil';

function Mypage({onClose}) {

    const loginUser = useSelector(state=>state.user)
    const [view, setView] = useState("menu")

    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [zipnum, setZipnum] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [profileimg, setProfileimg] = useState('')
    const [profilemsg, setProfilemsg] = useState('')

    const [imgSrc, setImgSrc] = useState('')
    const [imgStyle, setImgStyle] = useState({display:"none"});

    const [isOpen, setIsOpen] = useState(false)

    const cookies = new Cookies()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    async function updateUser(){
        //각 입력란 밸리데이션
        if(email===''){ return alert('이메일을 입력하세요');}
        if(nickname===''){ return alert('닉네임을 입력하세요');}
        if(phone===''){ return alert('닉네임을 입력하세요');}
        if(zipnum===''){ return alert('닉네임을 입력하세요');}
        if(address1===''){ return alert('닉네임을 입력하세요');}
        if(address2===''){ return alert('닉네임을 입력하세요');}

        // 이메일 중복 검사
        if( loginUser.email !== email){
            let result = await jaxios.post('/api/member/emailcheck', null, {params:{email}});
            if(result.data.msg === 'no' ){
                return alert('이메일이 중복됩니다');
            }
        }
        // 닉네임 중복 검사
        if( loginUser.nickname !== nickname){
            let result = await jaxios.post('/api/member/nicknamecheck', null, {params:{nickname}});
            if(result.data.msg === 'no' ){
                return alert('닉네임 중복됩니다');
            }
        }
        // 이메일 유효성 검사
        let regix = email.match( /\w+@(\w+[.])+\w+/g );
        if( !regix ){
            return alert('정확한 이메일을 입력하세요');
        }

        // 회원정보 수정
        let result = await jaxios.post('/api/member/updateMember', { midx:loginUser.midx, email, nickname, phone, zipnum, address1, address2, profileimg, profilemsg });

        if( result.data.msg === 'ok'){
            alert('회원 정보 수정이 완료되었습니다.')
        
            // 리듀스, 쿠키 수정, 토큰 수정(재로그인)
            let res = await axios.post('/api/member/login', null, { params:{username:email, password:loginUser.pwd} })    
            console.log(res.data)
            if( res.data.error === 'ERROR_LOGIN'){
                return alert('이메일과 패스워드를 확인하세요')
            }else{
                cookies.set('user', JSON.stringify( res.data ) , {path:'/', })
                dispatch( loginAction( res.data ) )
                navigate('/');
            }
        }
    }

    async function updatePwd(){
        // if(loginUser.provider !== 'KAKAO' && pwd===''){ return alert('패스워드를 입력하세요');}
        // if(loginUser.provider !== 'KAKAO' && pwd!==pwdChk){ return alert('패스워드 확인이 일치하지 않습니다');}
    }

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
        overlay: { backgroundColor: "rgba( 0 , 0 , 0 , 0.5)", zIndex: 2000,},
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

    return (
        <>
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                <h2>
                    {view === "menu" && "Hi"}
                    {view === "profile" && "회원 정보 변경"}
                    {view === "password" && "암호 변경"}
                </h2>
                <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="modal-content">
                {view === "menu" && (
                <>
                    <div style={{display:"flex", justifyContent:'center'}}>
                        <div>{loginUser.email}</div>&nbsp;&nbsp;|&nbsp;&nbsp;
                        <div onClick={() => setView("profile")} style={{cursor:'pointer'}}>회원 정보 변경</div>&nbsp;&nbsp;|&nbsp;&nbsp;
                        <div onClick={() => setView("password")} style={{cursor:'pointer'}}>암호 변경</div>
                    </div>
                    <hr />
                    <h3>🎬 동영상 서비스</h3>
                    <p>Netflix, Amazon Prime Video, Disney Plus</p>

                    <h3>👤 로그인 관리자</h3>

                    <h3>🖥 TV에 연결</h3>

                    <h3>🌍 국가</h3>
                    <p>대한민국</p>

                    <h3>🈯 언어 설정</h3>
                    <p>한국어</p>

                    <h3>❓ FAQ</h3>

                    <button className="logout-btn">로그아웃</button>
                    <button className="delete-btn">계정 영구 삭제</button>
                </>
                )}
                {/* 회원 정보 변경 화면 */}
                    {view === "profile" && (
                        <div>
                            <div>
                                <label style={{color:'white'}}>E-MAIL</label>
                                <input type='text' value={email} onChange={(e)=>{setEmail(e.currentTarget.value)}}/>
                            </div>
                            <div>
                                <label style={{color:'white'}}>NAME</label>
                                <input type="text" value={loginUser.name} readOnly />
                            </div>
                            <div>
                                <label style={{color:'white'}}>NICKNAME</label>
                                <input type="text"  value={nickname} onChange={(e)=>{ setNickname(e.currentTarget.value )}}/>
                            </div>
                            <div>
                                <label style={{color:'white'}}>PHONE</label>
                                <input type="text"  value={phone} onChange={(e)=>{ setPhone(e.currentTarget.value )}}/>
                            </div>
                            <div>
                                <label style={{color:'white'}}>POST CODE</label>
                                <input type="text" value={zipnum} onChange={(e)=>{ setZipnum(e.currentTarget.value )}} readOnly/>
                                <button style={{flex:'1'}} onClick={ ()=>{ setIsOpen( !isOpen ) }}>SEARCH</button>
                                <div style={{flex:'2'}} ></div>
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
                                <div><img src={imgSrc} style={imgStyle} /></div>
                            </div>

                            <button onClick={ ()=>{ updateUser() } }>저장</button>
                            <button onClick={() => setView("menu")}>뒤로</button>
                        </div>
                    )}

                {/* 암호 변경 화면 */}
                    {view === "password" && (
                        <div>
                        <label>현재 비밀번호</label>
                        <input type="password" /><br /><br />

                        <label>새 비밀번호</label>
                        <input type="password" /><br /><br />

                        <button onClick={ ()=>{ updatePwd() } }>변경</button>
                        <button onClick={() => setView("menu")}>뒤로</button>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div>
            <Modal isOpen={isOpen}  ariaHideApp={false}  style={customStyles} >
                <DaumPostcode onComplete={completeHandler} /><br />
                <button onClick={()=>{ setIsOpen(false) }}>CLOSE</button>
            </Modal>
        </div>
        </>
    )
    
}

export default Mypage
