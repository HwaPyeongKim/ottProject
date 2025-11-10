import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

function WriteForm() {
    const loginUser = useSelector(state=>state.user);
    const navigate = useNavigate();
    const [nickname, setNickname] = useState();
    // const [pwd, setPwd] = useState();
    const [title, setTitle] = useState();
    const [content, setContent] = useState();

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
        if( !loginUser.userid ){ 
            alert('로그인이 필요한 서비스입니다'); 
            navigate('/login')
            return;
        }

        if( !title ){ return alert('제목을 입력하세요')}
        if( !content ){ return alert('제목을 입력하세요')}

        axios.post('/api/board/writeForm', {title, content, userid:loginUser.email})
        .then((result)=>{
            alert('게시글 작성이 완료되었습니다');
            navigate('/community');
        }).catch((err)=>{console.error(err)});

    }


    
    return (
        <div className='boardwriteform'>
            <h2>게시물 작성</h2>
            <div className='field'>
                <label>닉네임</label>
                <input type='text' value={nickname} onChange={(e)=>{setNickname(e.currentTarget.value)}} readOnly/>
            </div>
            {/* <div className='field'>
                <label>비밀번호</label>
                <input type='password' value={pwd} onChange={(e)=>{setPwd(e.currentTarget.value)}}/>
            </div> */}
            <div className='field'>
                <label>제목</label>
                <input type='text' value={title} onChange={(e)=>{setTitle(e.currentTarget.value)}} readOnly/>
            </div>
            <div className='field'>
                <label>게시글 작성</label>
                <textarea rows="7" value={content} onChange={(e)=>{setContent(e.currentTarget.value)}}></textarea>
            </div>
            {/* <div className='field'>
                <label>업로드</label>
                <input />
            </div> */}
            <div className='btns'>
                <button onClick={()=>{onSubmit()}}>작성완료</button>
                <button onClick={()=>{navigate('/community')}}>메인으로</button>
            </div>
        </div>
    )
}

export default WriteForm