import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import { useSelector } from 'react-redux';
import jaxios from '../../util/JWTUtil';

function Myfollow() {

    const loginUser = useSelector( state=>state.user );
    //const [ imgSrc, setImgSrc ]=useState('http://43.201.183.35:8070/public/user.png');
    const navigate=useNavigate();
    const [imgList, setImgList] = useState([])
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
            <div>
                <div style={{display:'flex'}}>
                    <div style={{color:'white'}}>팔로워</div>
                    <div style={{color:'white'}}>
                        {
                            (followers)?(followers.length):(0)
                        }
                    </div>
                </div>
                <div style={{color:'white'}}>
                    {
                        followers.map((frList, idx)=>{
                            return(
                                <>  
                                    <div onClick={()=>{navigate(`/followMemberView/${frList.fromMember.midx}`)}}>
                                        <div>{frList.fromMember.nickname}</div>
                                        <div key={idx} style={{display:'flex', margin:'5px 3px'}}>
                                            <img src={followersImg[idx]} 
                                            style={{weight:'30px', height:'30px'}}/>
                                        </div>
                                    </div>
                                </>
                            )
                        })
                    }
                </div>
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div>
                <div style={{display:'flex'}}>
                    <div style={{color:'white'}}>팔로잉</div>
                    <div style={{color:'white'}}>
                        {
                            (followings)?(followings.length):(0)
                        }
                    </div>
                </div>
                <div style={{color:'white'}}>
                    {
                        followings.map((fiList, idx)=>{
                            return(
                                <>  
                                    <div onClick={()=>{navigate(`/followMemberView/${fiList.toMember.midx}`)}}>
                                        <div>{fiList.toMember.nickname}</div>
                                        <div key={idx} style={{display:'flex', margin:'5px 3px'}}>
                                            <img src={followingsImg[idx]} 
                                            style={{weight:'30px', height:'30px'}}/>
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
