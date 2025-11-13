import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import jaxios from '../../util/JWTUtil';
import axios from 'axios';

function UpdateForm() {
    const loginUser = useSelector(state=>state.user);
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [fidx, setFidx] = useState('');
    const [imgSrc, setImgSrc] = useState('');
    const [imgStyle, setImgStyle] = useState({display:"none"});
    
    const [newImgSrc, setNewImgSrc] = useState('');
    const [newImgStyle, setNewImgStyle] = useState({display: 'none'});

    const { bidx } = useParams();

    useEffect(
        ()=>{
            if( !loginUser.email ){ 
                alert('로그인이 필요한 서비스입니다'); 
                navigate('/login')
                return;
            }
            jaxios.get(`/api/board/getBoard/${bidx}`).then((result)=>{
                setNickname(result.data.board.boardMember.nickname);
                setTitle(result.data.board.title);
                setContent(result.data.board.content);
                setFidx(result.data.board.fidx);
                // 기존 이미지 URL이 존재하면 상태와 스타일 업데이트
                if(result.data.board.fidx){
                    axios.get(`/api/file/url/${result.data.board.fidx}`) // S3 이미지 URL 가져오기
                    .then((res) => {
                        setImgSrc(res.data.image);
                        setImgStyle({display:"block", width:"200px"});
                    }).catch(err => console.error(err));
                }
                // console.log("서버 응답:", result.data);
            }).catch(err=>console.error(err));
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

        jaxios.post('/api/board/updateBoard', {bidx: bidx, title, content, userid:loginUser.email, midx:loginUser.midx, fidx: fidx})
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
            setNewImgSrc(result.data.image);
            setNewImgStyle({display:"block", width:"200px"});
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
                <label>게시글 수정</label>
                <textarea rows="7" value={content} onChange={(e)=>{setContent(e.currentTarget.value)}}></textarea>
            </div>
            <div className='field'>
                <label>기존이미지</label>
                <div><img src={imgSrc} style={imgStyle} /></div>
            </div>            
            <div className='field'>
                <label>수정이미지</label>
                <div>
                    <img src={newImgSrc} style={newImgStyle} alt=""/><br />
                    <input type='file' onChange={(e)=>{ fileUpload(e); }} />
                </div>
            </div>
            <div className='btns'>
                <button onClick={()=>{onSubmit()}}>작성완료</button>
                <button onClick={()=>{navigate('/community')}}>메인으로</button>
            </div>
        </div>
    )
}

export default UpdateForm