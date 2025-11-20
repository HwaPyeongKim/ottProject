import React , {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

import jaxios from '../../util/JWTUtil';
import InsertList from './InsertList';

import '../../style/myList.css'

function MyList() {
    
    const [myList, setMyList] = useState([])
    const [listTab, setListTab] = useState('tab1')

    const [open, setOpen] = useState(false);
    const loginUser = useSelector(state=>state.user)
    const navigate = useNavigate()

    useEffect(
        ()=>{
            setOpen(false);
            jaxios.get('/api/member/getList', {params:{midx:loginUser.midx}})
            .then((result)=>{
                if(result.data.msg === 'ok'){
                    setMyList([...result.data.myList])
                }else{

                }
            }).catch((err)=>{console.error(err)})
        },[]
    )

    return (
        <div className="mylist-container">
            <div className="mylisttabs">
                <button className={listTab === 'tab1' ? "active" : ""}  
                onClick={()=>{setListTab('tab1')}}>나의 공개 리스트</button>
                <button className={listTab === 'tab2' ? "active" : ""} 
                onClick={()=>{setListTab('tab2')}}>나의 비밀 리스트</button>
                {
                    <>
                    <button style={{color:'#f5c518'}}
                    onClick={()=>{navigate('/insertList')}}>리스트 추가</button>
                    {open && <InsertList onClose={() => setOpen(false)} />}
                    </>
                }
            </div>

            <div className="mylist-grid">
                {  
                    myList
                    .filter(mList => 
                        listTab === 'tab1' ? mList.security === 'N' : mList.security === 'Y'
                    )
                    .map((mList, idx)=>{
                        return(
                            <div key={idx} className="mylist-card">
                                <div className="mylist-info" onClick={()=>{navigate(`/myListView/${mList.listidx}`)}}>{mList.title}</div>      
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default MyList

