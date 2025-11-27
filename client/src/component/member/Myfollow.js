import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import { useSelector } from 'react-redux';
import jaxios from '../../util/JWTUtil';

import '../../style/followlist.css';

function Myfollow() {

    const loginUser = useSelector( state=>state.user );
    const navigate = useNavigate();
    const [followingsImg, setFollowingsImg] = useState('')
    const [followings, setFollowings] = useState([])
    const [paging, setPaging] = useState({})
    const [followingsCount, setFollowingsCount] = useState('')

    useEffect(
        ()=>{
            jaxios.get(`/api/member/getFollowings`, {params:{page:'1', midx:loginUser.midx}} )
            .then((result)=>{
                setFollowings( [...result.data.followings] );
                setPaging( result.data.paging )
                setFollowingsCount( result.data.totalFollowingsCount)
            }).catch((err)=>{console.error(err)})
        },[loginUser]
    )
    
    useEffect(()=>{
            if(followings.length > 0){
                getFollowingsImg();
            }
        }, [followings]
    );

    function getFollowingsImg(){
        followings.forEach((f, i) => {
        jaxios.get(`/api/file/imgUrl/${f.toMember.profileimg}`)
            .then((result) => {
                console.log('getFollowingsImg : ', result.data.image);
                const img = result.data.image;
                setFollowingsImg(prev => {
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
        },[paging.page, followings]
    )
    const handleScroll=()=>{
        console.log('핸들스크롤입니다.')
        const scrollHeight = document.documentElement.scrollHeight - 100; 
        const scrollTop = document.documentElement.scrollTop;  
        const clientHeight = document.documentElement.clientHeight; 
        if( scrollTop + clientHeight >= scrollHeight ) {
            if( Number(paging.page) >= Number(paging.totalPage) ){return}
            onPageMove( Number(paging.page) + 1 );
        }
    }

    function onPageMove(p){
        jaxios.get(`/api/member/getFollowings`, {params:{page:p, midx:loginUser.midx}} )
        .then((result)=>{
            setPaging( result.data.paging )
            let follows = [];
            follows = [...followings]
            follows = [...follows, ...result.data.followings]
            setFollowings( [...follows] );
        }).catch((err)=>{console.error(err)})
    }

    return (
        <div>
            <div className="follower-container">
                <div className="follower-title">
                    {loginUser.nickname}님의 팔로잉&nbsp;ㅣ&nbsp;<span>{(followings)?(followingsCount):(0)}명</span>
                </div>

                
                <div className="follower-list">
                    {
                        followings.map((fiList, idx)=>{
                            return(
                                <>  
                                    <div className="follower-info" onClick={()=>{navigate(`/followMemberView/${fiList.toMember.midx}`)}}>
                                        <div className="follow-image-container" key={idx}>
                                            <img src={followingsImg[idx]} />
                                        </div>
                                        <div className="follower-text">
                                            <div className='follower-name'>{fiList.toMember.nickname}</div>
                                            <div className='follower-desc'>{fiList.toMember.profilemsg}</div>
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

export default Myfollow
