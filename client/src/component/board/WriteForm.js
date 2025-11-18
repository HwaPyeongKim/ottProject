import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import jaxios from '../../util/JWTUtil';
import "../../style/boardWrite.css";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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

        // <p> 제거하고 줄바꿈 살리기
        const cleanContent = content
        .replace(/<p>/g, '')           
        .replace(/<\/p>/g, '\n')       
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/&nbsp;/g, ' ')
        .replace(/ +/g, ' ');        

        jaxios.post('/api/board/writeForm', {title, content: cleanContent, userid:loginUser.email, midx:loginUser.midx, fidx: fidx})
        .then((result)=>{
            alert('게시글 작성이 완료되었습니다');
            navigate('/community');
        }).catch((err)=>{console.error(err)});

    }

    function fileUpload(e){
        const formData = new FormData();
        formData.append('image', e.target.files[0])

        jaxios.post( '/api/board/upload', formData)
        .then((result)=>{
            setImgSrc(result.data.image);
            setImgStyle({display:"block", width:"200px"});
            setFidx(result.data.fidx);
            // console.log(result.data);
        }).catch((err)=>{console.error(err)})
    }

    
    return (
        <div className='boardwriteform'>
            <h2>게시물 작성</h2>

            <div className='field info-upload-container'>
                
                <div className='info-column'>
                    <div className='field'>
                        <label>닉네임</label>
                        <input type='text' value={nickname} onChange={(e)=>{setNickname(e.currentTarget.value)}} readOnly/>
                    </div>
                    <div className='field'>
                        <label>제목</label>
                        <input type='text' value={title} onChange={(e)=>{setTitle(e.currentTarget.value)}} />
                    </div>
                </div>

                <div className='image-upload-section image-column'>
                    <label className='upload-label'>이미지 첨부</label>
                    <div className='upload-box'>
                        {imgSrc ? (
                            <div className="image-preview-wrapper">
                                <img src={imgSrc} alt="미리보기 이미지" />
                            </div>
                        ) : (
                            <div className="no-image-placeholder">
                                첨부된 이미지가 없습니다
                            </div>
                        )}
                        
                        <label htmlFor="file-upload" className="file-upload-button">
                            {imgSrc ? '이미지 변경' : '이미지 선택'}
                        </label>
                        <input id="file-upload" type="file" onChange={(e)=>{fileUpload(e)}} style={{display: 'none'}}/>
                    </div>
                </div>
            </div>

            <div className='field'>
                <label>게시글 작성</label>
                 <CKEditor
                    editor={ClassicEditor}
                    data={content}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setContent(data);
                    }}
                />
            </div>
          
            <div className='btns'>
                <button onClick={()=>{onSubmit()}}>작성완료</button>
                <button onClick={()=>{navigate('/community')}}>메인으로</button>
            </div>
        </div>
    )
}

export default WriteForm