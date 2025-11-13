import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import { useSelector } from 'react-redux';
import jaxios from '../../util/JWTUtil';

import '../../style/followlist.css';

function Myfollower() {

    const loginUser = useSelector( state=>state.user );
    const navigate = useNavigate();
    const [followersImg, setFollowersImg] = useState([])
    const [followers, setFollowers] = useState([])
    const [paging, setPaging] = useState({})
    const [followersCount, setFollowersCount] = useState('')

    useEffect(
        ()=>{
            jaxios.get(`/api/member/getFollowers`, {params:{page:'1', midx:loginUser.midx}} )
            .then((result)=>{
                console.log('팔로워 : ', result.data)
                setFollowers( [...result.data.followers] );
                setPaging( result.data.paging)
                setFollowersCount( result.data.totalFollowersCount )
            }).catch((err)=>{console.error(err)})
        },[loginUser]
    )    
    
    useEffect(()=>{
        if(followers.length > 0){
            const startIdx = followersImg.length;
            const newFollowers = followers.slice(startIdx);
            getFollowersImg(newFollowers);
        }
    }, [followers]);

    function getFollowersImg(){
        followers.forEach((f, i) => {
        jaxios.get(`/api/file/imgUrl/${f.fromMember.profileimg}`)
            .then((result) => {
                console.log('getFollowersImg : ', result.data.image);
                const img = result.data.image;
                setFollowersImg(prev => {
                    const copy = [...prev];
                    copy[i] = img;
                    return copy;
                });
            })
            .catch((err) => console.error(err));
        });
    }
    //---------------------------------------------------- 무한 스크롤 -------------------------------------------------------------
    useEffect(
        ()=>{ 
            window.addEventListener('scroll', handleScroll );
            return () => {
                window.removeEventListener("scroll", handleScroll);
            }
        },[paging.page, followers]
    )
    const handleScroll=()=>{
        const scrollHeight = document.documentElement.scrollHeight - 100; 
        const scrollTop = document.documentElement.scrollTop;  
        const clientHeight = document.documentElement.clientHeight; 
        if( scrollTop + clientHeight >= scrollHeight ) {
            if( Number(paging.page) >= Number(paging.totalPage)){return}
            onPageMove( Number(paging.page) + 1 );
        }
    }

    function onPageMove(p){
        jaxios.get(`/api/member/getFollowers`, {params:{page:p, midx:loginUser.midx}} )
        .then((result)=>{
            setPaging( result.data.paging )
            let follows = [];
            follows = [...followers]
            follows = [...follows, ...result.data.followers]
            setFollowers( [...follows] );
        }).catch((err)=>{console.error(err)})
    }

    return (
        <div style={{display:'flex'}}>
            <div className="follower-container">
                <div style={{display:'flex'}}>
                    <div className="follower-title" style={{color:'white'}}>{loginUser.nickname} 님의 팔로워</div>
                    <div style={{fontSize:'25px', color:'coral', justifyContent:'center', alignItems:'center', paddingLeft:'10px'}}>
                        {
                            (followers)?(followersCount):(0)
                        }
                    </div>
                </div>
                <div className="follower-list" style={{color:'white'}}>
                    {
                        followers.map((frList, idx)=>{
                            return(
                                <>  
                                    <div className="follower-info" onClick={()=>{navigate(`/followMemberView/${frList.fromMember.midx}`)}}>
                                        <div className="follow-image-container" key={idx} style={{display:'flex', margin:'5px 3px'}}>
                                            <img src={followersImg[idx]} />
                                        </div>
                                        <div className="follower-text">
                                            <div className='follower-name'>{frList.fromMember.nickname}</div>
                                            <div className='follower-desc'>여러가지 정보</div>
                                        </div>
                                    </div>
                                </>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Myfollower
