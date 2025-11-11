import React , {useState, useEffect} from 'react'
import axios from 'axios'
import {Cookies, useCookies} from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { loginAction, logoutAction } from '../../store/userSlice';
import '../../style/mypageModal.css'
import jaxios from '../../util/JWTUtil';

function MyList() {
    
    const [myList, setMyList] = useState([])
    const [listTab, setListTab] = useState('tab1')

    const loginUser = useSelector(state=>state.user)
    const navigate = useNavigate()

    useEffect(
        ()=>{
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
        <div>
            <div style={{display:'flex'}}>
                <button onClick={()=>{setListTab('tab1')}}>나의 공개 리스트</button>
                <button onClick={()=>{setListTab('tab2')}}>나의 비밀 리스트</button>
            </div>
            <div>
                <div style={{color:'white'}} onClick={()=>{navigate('/insertList')}}>새로 리스트 만들기</div>
            </div>
            <div style={{color:'white'}}>
                {   
                    listTab === 'tab1' &&
                    myList.map((mList, idx)=>{
                        return(
                            mList.security === 'N' && (
                            <div key={idx} style={{display:'flex', margin:'5px 3px'}}>
                                <div>{mList.title}</div>
                            </div>
                            )
                        )
                    })
                }
            </div>
            <div style={{color:'white'}}>
                {   
                    listTab === 'tab2' &&
                    myList.map((mList, idx)=>{
                        return(
                            mList.security === 'Y' && (
                            <div key={idx} style={{display:'flex', margin:'5px 3px'}}>
                                <div>{mList.title}</div>
                            </div>
                            )
                        )
                    })
                }
            </div>
        </div>
    )
}

export default MyList

