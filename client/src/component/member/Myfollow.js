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
    const [followersImg, setFollowersImg] = useState('')
    const [followings, setFollowings] = useState([])
    const [followers, setFollowers] = useState([])

    useEffect(
        ()=>{
            jaxios.get('/api/member/getFollowings', {params:{midx:loginUser.midx}} )
            .then((result)=>{
                console.log('팔로잉 : ', result.data)
                setFollowings( [...result.data.followings] );
            }).catch((err)=>{console.error(err)})
            jaxios.get('/api/member/getFollowers', {params:{midx:loginUser.midx}} )
            .then((result)=>{
                console.log('팔로워 : ', result.data)
                setFollowers( [...result.data.followers] );
            }).catch((err)=>{console.error(err)})
        },[]
    )
    useEffect(()=>{
        if(followings.length > 0){
            getFollowingsImg();
        }
    }, [followings]);
    useEffect(()=>{
        if(followers.length > 0){
            getFollowersImg();
        }
    }, [followers]);

    function getFollowingsImg(){
        followings.forEach((f, i) => {
        jaxios.get(`/api/file/imgUrl/${f.toMember.profileimg}`)
            .then((result) => {
                //console.log('응답 확인 : ', result.data)
                //console.log('getFollowingsImg : ', result.data.image);
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

    function getFollowersImg(){
        followers.forEach((f, i) => {
        jaxios.get(`/api/file/imgUrl/${f.fromMember.profileimg}`)
            .then((result) => {
                //console.log('응답 확인 : ', result.data)
                //console.log('getFollowersImg : ', result.data.image);
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

    return (
        <div style={{display:'flex'}}>
            <div className="follower-container">
                <div style={{display:'flex'}}>
                    <div className="follower-title" style={{color:'white'}}>{loginUser.nickname} 님의 팔로워</div>
                    <div style={{fontSize:'25px', color:'coral', justifyContent:'center', alignItems:'center', paddingLeft:'10px'}}>
                        {
                            (followers)?(followers.length):(0)
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
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div className="follower-container">
                <div style={{display:'flex'}}>
                    <div className="follower-title"style={{color:'white'}}>{loginUser.nickname} 님의 팔로잉</div>
                    <div style={{fontSize:'25px', color:'coral', justifyContent:'center', alignItems:'center', paddingLeft:'10px'}}>
                        {
                            (followings)?(followings.length):(0)
                        }
                    </div>
                </div>
                <div className="follower-list" style={{color:'white'}}>
                    {
                        followings.map((fiList, idx)=>{
                            return(
                                <>  
                                    <div className="follower-info" onClick={()=>{navigate(`/followMemberView/${fiList.toMember.midx}`)}}>
                                        <div className="follow-image-container" key={idx} style={{display:'flex', margin:'5px 3px'}}>
                                            <img src={followingsImg[idx]} />
                                        </div>
                                        <div className="follower-text">
                                            <div className='follower-name'>{fiList.toMember.nickname}</div>
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

export default Myfollow
