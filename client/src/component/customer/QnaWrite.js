import React ,{useState} from 'react'
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import jaxios from '../../util/JWTUtil'
import "../../style/qna.css";

function WriteQna() {

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const loginUser = useSelector(state=>state.user);
    const [ pass, setPass] = useState('');
    const [ security, setSecurity] = useState('N');
    const navigate = useNavigate();

    function onSubmit(){
        if(!loginUser){ 
            alert('로그인이 필요한 서비스입니다'); 
            navigate('/login')
            return;
        }
        if(!title) return alert('제목을 입력하세요');
        if(!content) return alert('내용을 입력하세요');
        if(security==='Y' && !pass) return alert('비밀번호를 입력하세요');

        jaxios.post('/api/admin/qnaWrite', {title, content, midx:loginUser.midx, security, pass})
        .then((result)=>{ 
            alert('Qna 작성이 완료되었습니다'); 
            navigate('/qna')
        }).catch((err)=>{console.error(err)})
    }

    function changeSecurity(e){
        if(e.currentTarget.checked){
            setSecurity('Y')
        } else {
            setSecurity('N')
            setPass('')
        }
    }

    return (
        <article>
            <div className='subPage'>
                <div className="qna-write-form">
                    <div className="section-title" style={{fontSize: "1.5rem"}}>문의 작성</div>
                    
                    <div className="qnafield">
                        <label>제목</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e)=>setTitle(e.currentTarget.value)}
                        />
                    </div>

                    <div className="qnafield">
                        <label>비밀글 설정</label>
                        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                            <input type="checkbox" onChange={changeSecurity}/> 비밀글
                            <input 
                                type="password" 
                                value={pass}  
                                onChange={(e)=>setPass(e.currentTarget.value)}
                                disabled={security==='N'}
                                placeholder="비밀번호 입력"
                            />
                        </div>
                    </div>

                    <div className="qnafield">
                        <label>내용</label>
                        <textarea 
                            rows="7" 
                            value={content} 
                            onChange={(e)=>setContent(e.currentTarget.value)}
                        />
                    </div>

                    <div className='qna-btns'>
                        <button className="btn btn-primary" onClick={()=>{onSubmit()}}>작성</button>
                        <button className="btn btn-secondary" onClick={()=>navigate('/qna')}>목록</button>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default WriteQna
