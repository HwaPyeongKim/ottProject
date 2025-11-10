import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import jaxios from '../../util/JWTUtil';

function WriteForm() {
    const loginUser = useSelector(state=>state.user);
    const navigate = useNavigate();
    const [nickname, setNickname] = useState();
    const [title, setTitle] = useState();
    const [content, setContent] = useState();

    const [fidx, setFidx] = useState('');
    const [imgSrc, setImgSrc] = useState('');
    const [imgStyle, setImgStyle] = useState({display:"none"});

    useEffect(
        ()=>{
            if(loginUser?.nickname){
                setNickname(loginUser.nickname);
            }else{
                setNickname('');
            }
        },[]
    )

    function onSubmit(){
        if( !loginUser.email ){ 
            alert('로그인이 필요한 서비스입니다'); 
            navigate('/login')
            return;
        }

        if( !title ){ return alert('제목을 입력하세요')}
        if( !content ){ return alert('제목을 입력하세요')}

        jaxios.post('/api/board/writeForm', {title, content, userid:loginUser.email, midx:loginUser.midx, fidx: fidx})
        .then((result)=>{
            alert('게시글 작성이 완료되었습니다');
            navigate('/community');
        }).catch((err)=>{console.error(err)});

    }

    function fileUpload(e){
        const formData = new FormData();
        formData.append('image', e.target.files[0])
        axios.post( '/api/board/upload', formData)
        .then((result)=>{
            setImgSrc(result.data.image);
            setImgStyle({display:"block", width:"200px"});
            setFidx(result.data.fidx);
        }).catch((err)=>{console.error(err)})
    }

    
    return (
        <div className='boardwriteform'>
            <h2>게시물 작성</h2>
            <div className='field'>
                <label>닉네임</label>
                <input type='text' value={nickname} onChange={(e)=>{setNickname(e.currentTarget.value)}} readOnly/>
            </div>
            <div className='field'>
                <label>제목</label>
                <input type='text' value={title} onChange={(e)=>{setTitle(e.currentTarget.value)}} />
            </div>
            <div className='field'>
                <label>게시글 작성</label>
                <textarea rows="7" value={content} onChange={(e)=>{setContent(e.currentTarget.value)}}></textarea>
            </div>
            <div className='field'>
                <label>이미지업로드</label>
                <input type="file" onChange={(e)=>{fileUpload(e)}}/>
            </div>
            <div className='field'>
                <label>이미지 미리보기</label>
                <div><img src={imgSrc} style={imgStyle} /></div>
            </div>
            <div className='btns'>
                <button onClick={()=>{onSubmit()}}>작성완료</button>
                <button onClick={()=>{navigate('/community')}}>메인으로</button>
            </div>
        </div>
    )
}

export default WriteForm