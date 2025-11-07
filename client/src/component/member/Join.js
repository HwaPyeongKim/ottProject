import React ,{useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import Modal from 'react-modal'

function Join() {

    const [name, setName] = useState('')
    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
    const [reid, setReid]=useState('')
    const [pwd, setPwd] = useState('')
    const [pwdChk, setPwdChk] = useState('');
    const [phone, setPhone] = useState('')
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

    const navigate = useNavigate()

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
        if(!pwd){ return alert('패스워드를 입력하세요')}
        if(!pwdChk){ return alert('패스워드 확인을 입력하세요')}
        if(pwd !== pwdChk){ return alert('패스워드가 일치하지 않습니다')}
        if(!name){ return alert('이름을 입력하세요')}
        if(!nickname){ return alert('닉네임을 입력하세요')}
        if(!phone){ return alert('전화번호를 입력하세요')}
        // 유효이메일 양식 체크
        let regix = email.match( /\w+@(\w+[.])+\w+/g );
        if( !regix ){  return alert('정확한 이메일을 입력하세요'); }
        try{
            // 이메일 중복체크
            let result = await axios.post('/api/member/emailcheck', null, {params:{email}})
            if(result.data.msg == 'no' ){ return alert('이메일이 중복됩니다'); }
            // 닉네임 중복체크
            result = await axios.post('/api/member/nicknamecheck', null, {params:{nickname}} );
            if(result.data.msg == 'no' ){ return alert('닉네임이 중복됩니다'); }
            // 회원가입
            result = await axios.post('/api/member/join', {email, pwd, name, nickname, phone, zipnum, address1, address2, profileimg, profilemsg});
            if(result.data.msg =='ok'){
                alert('회원 가입이 완료되었습니다.');
                navigate('/');
            }
        }catch(err){
            console.error(err)
        }        
    }

    return (
        <div>
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
                <input type="text"  value={phone} onChange={(e)=>{ setPhone(e.currentTarget.value )}}/>
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
                <div><img src={imgSrc} style={imgStyle} /></div>
            </div>
            <div>
                <button onClick={()=>{onSubmit()}}>JOIN</button>
                <button onClick={()=>{ navigate('/')}}>BACK</button>
            </div>
        </div>
    )
}

export default Join