import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../../style/login.css'

function ConfirmEmailCode() {

    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [codeView, setCodeView] = useState(true)

    const navigate = useNavigate()

    function sendMail(){
        if(!email ){return alert('이메일을 입력하세요')}
        axios.post('/api/member/sendMail', null, {params:{email}})
        .then((result)=>{
            if( result.data.msg === 'ok' ){
                setCodeView(false)        
            }else{
                alert('같은 이메일로 회원가입이 되어있습니다. 확인해주세요.')
            }
        })
    }

    function confirmCode(){
        if(!code ){return alert('전송받은 인증코드를 입력하세요')}
        axios.post('/api/member/confirmCode', null, {params:{code}})
        .then((result)=>{
            if( result.data.msg === 'ok' ){
                navigate(`/join/${email}`)
            }else{
                alert('코드가 일치하지 않습니다')
            }
        })
    }

    return (
        <article>
            <div className="subPage">
                <div className="login-form">
                    <h2>이메일 인증</h2>
                    <div className="field">
                        <label>이메일</label>
                        <input type="text" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
                    </div>
                    <>
                        {
                            (codeView)?(
                                <div className="btns">
                                    <button className="btn btn-primary" onClick={()=>{sendMail()}}>
                                    이메일 전송
                                    </button>
                                </div>
                            ):
                            (
                                <>
                                    <div className="field">
                                        <label>코드 입력</label>
                                        <input type="text" value={code} onChange={(e) => setCode(e.currentTarget.value)} />
                                    </div>
                                    <div className="btns">
                                        <button className="btn btn-primary" onClick={()=>{confirmCode()}}>
                                        코드 확인
                                        </button>
                                    </div>
                                </>
                            )
                        }
                    </>
                </div>
            </div>
        </article>
    )
}

export default ConfirmEmailCode
