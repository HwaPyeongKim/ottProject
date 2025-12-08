import {useState, useEffect, React, useRef} from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWeixin } from "@fortawesome/free-brands-svg-icons";
import "../index.css";

function Chatbot() {

    const [chatView, setChatView] = useState(false)
    const [chatStyle, setChatStyle] = useState({display:'none'})

    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')

    const chatBoxRef = useRef(null);

    function onsubmit(){
        if(!question){ return alert('질문을 입력하세요') };
        appendMessage('User', question);
        setQuestion('');
        axios.post('/api/question', null, {params:{question}})
        .then((result)=>{
            appendMessage('ChatBot', result.data.answer);
        })
        .catch((err)=>{console.error(err)})
    }

    function appendMessage(sender, content){
        setAnswer(prev => {
            if(sender === 'User'){
                return prev + `<div class="user-message"><div class="bubble user">${content}</div></div>`;
            } else {
                return prev + `<div class="bot-message"><div class="bubble bot">${content}</div></div>`;
            }
        });
    }

    useEffect(() => {
        if (chatView) {
            setChatStyle({display: 'flex', flexDirection: 'column'});
        } else {
            setChatStyle({display:'none'});
        }
    }, [chatView]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [answer]);

    return (
        <div>
            <div className='chatbot' onClick={()=>{setChatView( !chatView )}}>
                <FontAwesomeIcon icon={faWeixin} style={{color: "#f5c518"}} />
            </div>

            <div className="chatbot-box" style={chatStyle}>
                <div className="chat-box" id="chatBox" ref={chatBoxRef} dangerouslySetInnerHTML={{ __html: answer }}></div>

                <div className="chat-input-area">
                    <input type="text" className="chat-input" placeholder="AI챗봇에게 질문해주세요" value={question} onChange={(e)=>{ setQuestion(e.currentTarget.value) }}/>
                    <button className="send-btn" onClick={onsubmit}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default Chatbot;
