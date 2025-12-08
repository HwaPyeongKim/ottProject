import React , {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';

import jaxios from '../../util/JWTUtil';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";

import '../../style/myList.css'

function UserList() {

    const loginUser = useSelector( state=>state.user );
    const {userMidx} = useParams();
    const userId = Number(userMidx);
    const [targetMidx, setTargetMidx] = useState(userId);
    useEffect(() => {
    if (loginUser?.midx) {
        setTargetMidx(
        userId === loginUser.midx ? loginUser.midx : userId
        );
    }
    }, [loginUser, userId]);

    const [myList, setMyList] = useState([])
    const [listTab, setListTab] = useState('tab1')
    const [chkMember, setChkMember] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate()

    const [isAddListModal, setIsAddListModal] = useState(false);
    const [listTitle, setListTitle] = useState("");
    const [security, setSecurity] = useState("N");

    useEffect(
        ()=>{
            if(!loginUser?.midx){
                alert("로그인이 필요한 서비스 입니다");
                return;
            }
            setIsModalOpen(false);
            getMyLists();
            console.log(loginUser.midx, targetMidx)
            console.log(listTab)
        },[]
    )

    async function getMyLists() {
        try{
            if( targetMidx !== loginUser.midx ){
                const res = await jaxios.post('/api/member/getCheckMember', null, {params:{midx:targetMidx}})
                setChkMember(res.data.checkMember);
            }else{
                setChkMember(loginUser);
            }
            const result = await jaxios.get('/api/member/getList', {params:{midx:targetMidx}})
            if(result.data.msg === 'ok'){
                setMyList([...result.data.myList])
            }
        }catch(err){
            console.error(err)
        }
    }

    function addList() {
        jaxios.post("/api/main/addList", {title: listTitle, security, midx: targetMidx})
        .then((result) => {
            if (result.data.msg === "ok") {
                alert("리스트가 추가되었습니다");
                setIsAddListModal(false);
                setIsModalOpen(false);
                setListTitle("");
                setSecurity("N");
                getMyLists();
            } else {
                alert(result.data.msg);
            }
        })
        .catch((err) => {
        console.error(err);
        });
    }

    const filteredList = myList.filter(mList => 
        listTab === 'tab1' ? mList.security === 'N' : mList.security === 'Y'
    );

    return (
        <div className="mylist-container">
            <div className="mylisttabs">
                {
                    (loginUser.midx === targetMidx)?(
                        <button className={listTab === 'tab1' ? "active" : ""}  
                        onClick={()=>{setListTab('tab1')}}>나의 공개 리스트</button>
                    ):(
                        <button className={listTab === 'tab1' ? "active" : ""}  
                        onClick={()=>{setListTab('tab1')}}>{chkMember.nickname} 님의 공개 리스트</button>
                    )
                }
                
                {
                    loginUser.midx === targetMidx&&(
                    <>
                        <button className={listTab === 'tab2' ? "active" : ""} 
                        onClick={()=>{setListTab('tab2')}}>나의 비밀 리스트</button>
                        <button style={{color:'#f5c518'}}
                        onClick={()=>{setIsAddListModal(true)}}>리스트 추가</button>
                    </>
                )}
            </div>

            <div className="mylist-grid">
                {  
                    filteredList.length > 0 ? (
                        filteredList.map((mList, idx) => (
                            <div key={idx} className="mylist-card">
                                <div className="mylist-info" onClick={() => navigate(`/userListView/${mList.listidx}/${targetMidx}`)}>
                                    {mList.title}
                                </div>      
                            </div>
                        ))
                    ) : (
                        <div className="mylist-info" 
                        style={
                            {display:'flex', alignItems:'center', justifyContent:'center',
                            width:'100%', height:'100%',
                            fontSize:'40px', fontWeight:'bold', color:'coral'}
                        }>생성된 리스트가 없습니다</div>
                    )
                }
            </div>

            {isAddListModal && (
                <div className="modalOverlay" onClick={() => setIsAddListModal(false)}>
                    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                        <h3>리스트 추가</h3>
                        <div>
                        <input type="text" value={listTitle} onChange={(e)=>{setListTitle(e.currentTarget.value)}} />
                        <div className="checkboxWrap">
                            <input type="checkbox" value={security} onChange={(e)=>setSecurity(e.target.checked ? "Y" : "N")} id="checkbox_security" />
                            <label htmlFor="checkbox_security" className="flex"><p>리스트 노출 여부</p> <b><FontAwesomeIcon icon={faCheck} /></b></label>
                        </div>
                        </div>
                        <div className="buttonWrap">
                        <button className="mainButton" onClick={()=>{addList()}}>추가하기</button>
                        <button className="mainButton" onClick={()=>setIsAddListModal(false)}>닫기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserList