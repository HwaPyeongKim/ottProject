import React , {useState, useEffect} from 'react'
import axios from 'axios'
import {Cookies, useCookies} from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { loginAction, logoutAction } from '../../store/userSlice';
import DaumPostcode from "react-daum-postcode";
import Modal from 'react-modal'
import '../../style/mypage.css'
import jaxios from '../../util/JWTUtil';

function Mypage({onClose}) {

    const loginUser = useSelector(state=>state.user)
    const [view, setView] = useState("menu")
    const [pwd, setPwd] = useState('')
    const [pwdChk, setPwdChk ] = useState('')
    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [zipnum, setZipnum] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [profileimg, setProfileimg] = useState('')
    const [profilemsg, setProfilemsg] = useState('')
    const [oldImgSrc, setOldImgSrc] = useState(loginUser.profileimg)
    const [currentPwd, setCurrentPwd] = useState('')
    const [message, setMessage] = useState('')

    const [imgSrc, setImgSrc] = useState('')
    const [imgStyle, setImgStyle] = useState({display:"none"});

    const [isOpen, setIsOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const cookies = new Cookies()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(()=>{
        if(loginUser){
            setEmail(loginUser.email || '')
            setNickname(loginUser.nickname || '')
            setPhone(loginUser.phone || '')
            setZipnum(loginUser.zipnum || '')
            setAddress1(loginUser.address1 || '')
            setAddress2(loginUser.address2 || '')
            setProfilemsg(loginUser.profilemsg || '')
            if( loginUser.profileimg ){
                setImgSrc(loginUser.profileimg)
            }else{
                setImgSrc('http://localhost:8070/public/user.png')
            }
            setProfileimg(loginUser.profileimg);
            if( loginUser.provider == 'KAKAO'){
                setPwd('KAKAO')
                setPwdChk('KAKAO')
            }

            axios.get(`/api/file/url/${loginUser.profileimg}`)
            .then((result) => {
                setOldImgSrc(result.data.image); // 미리보기 이미지 URL
            })
            .catch((err) => console.error(err));
            }
    }, [loginUser]);

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
        let result = await jaxios.post('/api/member/updateMember', { midx:loginUser.midx, email, pwd, nickname, phone, zipnum, address1, address2, profileimg, profilemsg });

        if( result.data.msg === 'ok'){
            alert('회원 정보 수정이 완료되었습니다.')
            console.log('이메일 : ', email)
            console.log('비밀번호 : ', loginUser.pwd)
            console.log('액세스 토큰 : ', loginUser.accessToken)
            console.log('리프레시 토큰 : ', loginUser.refreshToken)
            // 리듀스, 쿠키 수정, 토큰 수정(재로그인)
            let res = await axios.post('/api/member/login', null, { params:{username:email, password:pwd} })    
            console.log("재로그인 후 데이터 : ", res.data)
            if( res.data.error === 'ERROR_LOGIN'){
                return alert('이메일과 패스워드를 확인하세요')
            }else{
                cookies.set('user', JSON.stringify( res.data ) , {path:'/', })
                dispatch( loginAction( res.data ) )
                if(onClose){
                    onClose();
                }
                navigate('/');
            }
        }
    }

    async function updatePwd(){
        let result = await axios.post('/api/member/checkPwd', null, {params:{midx:loginUser.midx, pwd:currentPwd}})
        if(result.data.msg === 'ok'){
          setMessage('♥일치♥')
          if(loginUser.provider !== 'KAKAO' && pwd===''){ return alert('패스워드를 입력하세요');}
          if(loginUser.provider !== 'KAKAO' && pwd!==pwdChk){ return alert('패스워드 확인이 일치하지 않습니다');}
          result = await axios.post('/api/member/resetPwd', null, {params:{midx:loginUser.midx, pwd}})
            if( result.data.msg === 'ok' ){
              console.log('비밀번호 변경')
              dispatch( logoutAction() );
              cookies.remove('user', {path:'/',} )
              setIsOpen(false)
              navigate('/')
            }
        }else{
          setMessage('일치 X')
        }
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

    // function toggle(){
    //     setIsOpen( !isOpen )
    // }
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

    function onLogout(){
        dispatch( logoutAction() );
        cookies.remove('user', {path:'/',} )
        alert('로그아웃되었습니다')
        navigate('/')
    }

    function deleteAccount(){
      // 비밀번호를 입력받아 한번 더 확인작업 필요
      // deleteyn 이 있는 곳에는 모두 Y로 변경
      jaxios.delete("/api/member/deleteAccount", { params : { midx:loginUser.midx }})
      .then((result)=>{
        if(result.data.msg === 'ok'){
          dispatch( logoutAction() );
          cookies.remove('user', {path:'/',} )
          alert('탈퇴되었습니다')
          navigate('/')
        }
      }).catch((err)=>{console.error(err)})

    }

    return (
        <>
        <div className="modal-backdrop" onClick={onClose}>
          <div className="my-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {view === "menu" && `${loginUser.nickname} 님`}
                {view === "profile" && "회원 정보 변경"}
                {view === "password" && "암호 변경"}
              </h2>
              <button className="close-btn" onClick={onClose}>✕</button>
            </div>

            <div className="modal-content">
              {view === "menu" && (
                <>
                  <div className="menu-item">
                    <div onClick={() => { onClose(); navigate(`/pageView/${loginUser.midx}`); }}>마이페이지</div>
                  </div>
                  <hr className="menu-divider" />
                  <div className="menu-item">
                    <div onClick={() => setView("profile")} style={{ cursor: 'pointer' }}>회원 정보 변경</div>
                  </div>
                  <hr className="menu-divider" />
                  <div className='menu-item'>
                    <div onClick={() => setView("password")} style={{cursor:'pointer'}}>암호 변경</div>
                  </div>
                  <hr className="menu-divider" />

                  <button className="logout-btn" onClick={() => { onLogout(); }}>로그아웃</button>
                  {/* <button className="delete-btn">계정 영구 삭제</button> */}
                </>
              )}

              {/* 회원 정보 변경 화면 */}
              {view === "profile" && (
                <div className="profile-form">
                  <div className="mpfield">
                    <label>이메일</label>
                    <input type='text' value={email} onChange={(e) => { setEmail(e.currentTarget.value); }} readOnly/>
                  </div>

                  <div className="mpfield">
                    <label>이름</label>
                    <input type="text" value={loginUser.name} readOnly />
                  </div>

                  <div className="mpfield">
                    <label>닉네임</label>
                    <input type="text" value={nickname} onChange={(e) => { setNickname(e.currentTarget.value); }} />
                  </div>

                  <div className="mpfield">
                    <label>전화번호</label>
                    <input type="text" value={phone} onChange={(e) => { setPhone(e.currentTarget.value); }} />
                  </div>

                  <div className="mpfield">
                    <label>우편번호</label>
                      <input type="text" value={zipnum} onChange={(e) => { setZipnum(e.currentTarget.value); }} readOnly />
                      <button className="btn btn-primary" onClick={() => { setIsOpen(!isOpen); }}>검색</button>
                  </div>

                  <div className="mpfield">
                    <label>주소</label>
                    <input type="text" value={address1} onChange={(e) => { setAddress1(e.currentTarget.value); }} />
                  </div>

                  <div className="mpfield">
                    <label>상세주소</label>
                    <input type="text" value={address2} onChange={(e) => { setAddress2(e.currentTarget.value); }} />
                  </div>

                  <div className="mpfield">
                    <label>프로필 메세지</label>
                    <input type="text" value={profilemsg} onChange={(e) => { setProfilemsg(e.currentTarget.value); }} />
                  </div>

                  <div className="mpfield">
                    <label>프로필 이미지</label>
                    <input type="file" onChange={(e) => { fileUpload(e); }} />
                  </div>

                  <div className="mpfield">
                    
                      <div className="mp-image-wrapper">
                      {
                        (oldImgSrc)&&(
                          <img className="old-img" src={oldImgSrc} />
                        )
                      }
                      {
                        (imgSrc)&&(
                          <img className="new-img" src={imgSrc} style={imgStyle} />
                        )
                      }
                      </div>
                    
                  </div>

                  <div className="btn-group">
                    <span className="underline" onClick={()=>{ setIsDeleteModalOpen(true); }}>영구 회원 탈퇴</span>
                    <button className="btn-highlight" onClick={() => { updateUser(); }}>저장</button>
                    <button className="btn btn-secondary" onClick={() => setView("menu")}>뒤로</button>
                  </div>
                </div>
              )}

              {/* 암호 변경 화면 */}
              {view === "password" && (
                  <div>
                    <div className="mpfield">
                    <label>현재 비밀번호</label>
                    <input type="password" value={currentPwd} onChange={(e)=>{setCurrentPwd(e.currentTarget.value)}}/>
                    {
                      (message)?(<div style={{color:'orange'}}>{message}</div>):(null)
                    }
                  </div>
                  <br />
                  <div className="mpfield">
                    <label>수정 비밀번호</label>
                    {
                      (loginUser.provider === 'KAKAO') ? (
                        <input type="password" value={pwdChk} disabled />
                      ) : (
                        <input type="password" value={pwd} onChange={(e) => { setPwd(e.currentTarget.value); }} />
                      )
                    }
                  </div>

                  <div className="mpfield">
                    <label>비밀번호 확인</label>
                    {
                      (loginUser.provider === 'KAKAO') ?
                      (<input type="password" readOnly />) :
                      (<input type="password" value={pwdChk} onChange={(e) => { setPwdChk(e.currentTarget.value); }} />)
                    }
                  </div>

                  <div className="btn-group">
                    <button className="btn-highlight" onClick={ ()=>{ updatePwd() } }>저장</button>
                    <button className="btn btn-secondary" onClick={() => setView("menu")}>뒤로</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isDeleteModalOpen && (
            <div className="mpe-modalOverlay" onClick={() => setIsOpen(false)}>
                <div
                className="mpe-modalContent"
                onClick={(e) => e.stopPropagation()}
                >
                <h3>영구 회원 탈퇴</h3>
                <p>영구적으로 회원 정보가 삭제되며 되돌릴 수 없습니다. 정말 탈퇴하시겠습니까?</p>

                <div className="mpe-buttonWrap">
                    <button
                    className="mpe-cancelButton"
                    onClick={() => {setIsDeleteModalOpen(false)}}
                    >
                    취소
                    </button>
                    <button
                    className="mpe-deleteConfirmButton"
                    onClick={() => {deleteAccount()}}
                    >
                    탈퇴
                    </button>
                </div>

                </div>
            </div>
            )}
        </div>

<div>
  <Modal isOpen={isOpen} ariaHideApp={false} style={customStyles}>
    <DaumPostcode onComplete={completeHandler} /><br />
    <button className="btn btn-secondary" onClick={() => { setIsOpen(false); }}>CLOSE</button>
  </Modal>
</div>
</>
    )
    
}

export default Mypage
