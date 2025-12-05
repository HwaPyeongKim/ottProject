import {useState, useEffect, React} from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWeixin } from "@fortawesome/free-brands-svg-icons"
import "../index.css";


function Chatbot() {

    const [chatView, setChatView] = useState(false)
    const [chatStyle, setChatStyle] = useState({display:'none'})

    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')

    function onsubmit(){
        if(!question){ return alert('질문을 입력하세요') };
        appendMessage('User', question);
        setQuestion('');
        axios.post('/api/question', null, {params:{question}})
        .then((result)=>{
            appendMessage('ChatBot', result.data.answer, question);
        })
        .catch((err)=>{console.error(err)})
    }

    function appendMessage(sender, content){
        if( sender === 'User' ){
            setAnswer( answer + `<div class="user-message"><div class="bubble user">${content}</div></div>`)
        }else{
            setAnswer( 
                answer 
                + `<div class="user-message"><div class="bubble user">${question}</div></div>`
                + `<div class="bot-message"><div class="bubble bot">${content}</div></div>`
            )
        }
        setQuestion('')
    }

    useEffect(
        ()=>{
            if (chatView) {
                setChatStyle(
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'hidden'
                    }
                )
            } else {
                setChatStyle({display:'none'})
            }
        },[chatView]
    )

    // useEffect(
    //     ()=>{
    //         document.getElementById('dialogBox').scrollTop = document.getElementById
    //         ('dialogBox').scrollHeight
    //     },[answer]
    // )

    return (
        <div>
            <div className='chatbot' onClick={()=>{setChatView( !chatView )}}><FontAwesomeIcon icon={faWeixin} style={{color: "#f5c518"}} /></div>
            <div class="chatbot-box" style={chatStyle}>
                <div class="chat-box" id="chatBox" dangerouslySetInnerHTML={{ __html: answer }}></div>

                <div class="chat-input-area">
                    <input type="text" id="messageInput" class="chat-input" placeholder="AI챗봇에게 질문해주세요" value={question} onChange={(e)=>{ setQuestion(e.currentTarget.value)}} />
                    <button class="send-btn" onClick={()=>{onsubmit()}}>Send</button>
                </div>
            </div>
            
        </div>
    )
}

export default Chatbot
