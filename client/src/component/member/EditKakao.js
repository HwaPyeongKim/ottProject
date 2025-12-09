import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { loginAction } from '../../store/userSlice';
import axios from 'axios'
import { Cookies } from 'react-cookie';
import '../../style/join.css'

import DaumPostcode from "react-daum-postcode";
import Modal from 'react-modal'

function EditKakao() {

    const loginUser = useSelector( state=>state.user );
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
    const [snsid, setSnsid] = useState('')
    const [useridStyle, setUseridStyle] = useState({fontWeight:'bold', textalign:'center'})
    const [message, setMessage] = useState('')

    const [imgSrc, setImgSrc] = useState('')
    const [imgStyle, setImgStyle] = useState({display:"none"});

    const [isOpen, setIsOpen] = useState(false)

    useEffect(
        ()=>{
            setNickname(loginUser.nickname)
            getImage()
        },[]
    )

    const getImage = () => {
        axios.get(`/api/file/url/${loginUser.profileimg}`)
        .then((result) => {
            setProfileimg(result.data.image); // 미리보기 이미지 URL
        })
        .catch((err) => console.error(err));
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

    async function onSubmit(){
        if(!email){ return alert('이메일을 입력하세요')}
        if(!name){ return alert('이름을 입력하세요')}
        if(!nickname){ return alert('닉네임을 입력하세요')}
        if(!phone1 || !phone2 || !phone3){ return alert('전화번호를 입력하세요')}
        // 유효이메일 양식 체크
        let regix = email.match( /\w+@(\w+[.])+\w+/g );
        if( !regix ){  return alert('정확한 이메일을 입력하세요'); }
        try{
            // 이메일 중복체크
            let result = await axios.post('/api/member/emailcheck', null, {params:{email}})
            if(result.data.msg === 'no' ){ return alert('이메일이 중복됩니다'); }
            // 닉네임 중복체크
            result = await axios.post('/api/member/nicknamecheck', null, {params:{nickname}} );
            if(result.data.msg === 'no' ){ return alert('닉네임이 중복됩니다'); }
            // 회원가입
            const phone = `${phone1}-${phone2}-${phone3}`
            result = await axios.post('/api/member/editKakao', {email, name, nickname, phone, zipnum, address1, address2, profileimg, profilemsg, snsid:loginUser.snsid});
            if(result.data.msg === 'ok'){
                let res = await axios.get('/api/member/getSnsUser', {params:{snsid: loginUser.snsid}})

                let LUser = res.data.snsUser
                if (!LUser) {
                    console.error("snsUser 조회 실패:", res.data)
                    alert("로그인 정보 확인 중 오류가 발생했습니다.");
                    return;
                }else{
                    cookies.set('user', JSON.stringify( LUser ) , {path:'/', } )
                    dispatch( loginAction( LUser ) )

                    alert('회원 가입이 완료되었습니다.');
                    navigate('/');
                }
            }
        }catch(err){
            console.error(err)
        }        
    }

    return (
        <div className="join-profile-form">
            <div className="section-title">
                카카오 추가 로그인
            </div>
            <div className="join-mpfield">
                <label>이메일</label>
                <input type='text' value={email} onChange={(e)=>{setEmail(e.currentTarget.value)}}/>
            </div>
            {/* <div className="join-mpfield">
                <label>PASSWORD</label>
                <input type='password' value={pwd} onChange={(e)=>{setPwd(e.currentTarget.value)}}/>
            </div>
            <div className="join-mpfield">
                <label>RETYPE PW</label>
                <input type="password"  value={pwdChk} onChange={(e)=>{ setPwdChk(e.currentTarget.value )}}/>
            </div> */}
            <div className="join-mpfield">
                <label>이름</label>
                <input type="text"  value={name} onChange={(e)=>{ setName(e.currentTarget.value )}}/>
            </div>
            <div className="join-mpfield">
                <label>닉네임</label>
                <input type="text"  value={nickname} onChange={(e)=>{ setNickname(e.currentTarget.value )}}/>
            </div>
            <div className="join-phone">
                <label>전화번호</label>
                <input type="text"  value={phone1} maxLength='3' onChange={(e)=>{ setPhone1(e.currentTarget.value )}}/>
                &nbsp;-&nbsp;
                <input type="text"  value={phone2} maxLength='4' onChange={(e)=>{ setPhone2(e.currentTarget.value )}}/>
                &nbsp;-&nbsp;
                <input type="text"  value={phone3} maxLength='4' onChange={(e)=>{ setPhone3(e.currentTarget.value )}}/>
            </div>
            <div className="join-mpfield">
                <label>우편번호</label>
                <input type="text" value={zipnum} onChange={(e)=>{ setZipnum(e.currentTarget.value )}} readOnly/>
                <button className="btn-highlight" onClick={ ()=>{ setIsOpen( !isOpen ) }}>검색</button>
            </div>

            <div className="join-mpfield">
                <Modal isOpen={isOpen}  ariaHideApp={false}  style={customStyles} >
                    <DaumPostcode onComplete={completeHandler} /><br />
                    <button onClick={()=>{ setIsOpen(false) }}>CLOSE</button>
                </Modal>
            </div>
            <div className="join-mpfield">
                <label>주소</label>
                <input type="text"  value={address1} onChange={(e)=>{ setAddress1(e.currentTarget.value )}}/>
            </div>

            <div className="join-mpfield">
                <label>상세주소</label>
                <input type="text"  value={address2} onChange={(e)=>{ setAddress2(e.currentTarget.value )}}/>
            </div>
            <div className="join-mpfield">
                <label>INTRO</label>
                <input type="text"  value={profilemsg} onChange={(e)=>{setProfilemsg(e.currentTarget.value)}}/>
            </div>
            <div className="join-mpfield">
                <label>프로필 이미지</label>
                <input type="file" onChange={(e)=>{fileUpload(e)}}/>
            </div>
            <div className="join-mpfield">
                <label></label>
                {
                    (imgSrc)?(<div><img src={imgSrc} style={imgStyle} /></div>):(<p></p>)
                }
            </div>
            <div className="join-btn-group">
                <button className="join-btn join-btn-primary" onClick={()=>{onSubmit()}}>회원가입</button>
                {/* <button className="join-btn join-btn-secondary" onClick={()=>{ navigate('/')}}>BACK</button> */}
            </div>
        </div>
    )
}

export default EditKakao
