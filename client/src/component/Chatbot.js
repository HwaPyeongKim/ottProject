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
            setAnswer( answer + `<div class="userMessage"><div class="senderUser">User</div><div class="userContent">${content}</div></div><br />`)
        }else{
            setAnswer( 
                answer 
                +`<div class="userMessage"><div class="senderUser">User</div>
                <div className="userContent">${question}</div></div><br />`
                + `<div class="botMessage"><div class="senderBot">Chatbot</div>
                <div class="botContent">${content}</div></div><br />`
            )
        }
        setQuestion('')
    }

    useEffect(
        ()=>{
            if(chatView){
                setChatStyle(
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }
                )
            }else{
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
            <div className='chatbotbox' style={chatStyle}>
                <h1 className="text-center">RAG기반 AI 챗봇 서비스</h1>
                <div className="chat-box" id="chatBox" dangerouslySetInnerHTML={{ __html: answer }} ></div>
                 <div className="userQuestion">
                    <input type='text' id="messageInput" className="question" placeholder="Type your message..." value={question} onChange={(e)=>{ setQuestion(e.currentTarget.value)}} />
                    <button className="sendBtn" onClick={()=>{onsubmit()}}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default Chatbot
