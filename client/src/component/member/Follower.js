import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

import { useSelector } from 'react-redux';
import jaxios from '../../util/JWTUtil';

import '../../style/followlist.css';

function Follower() {

    const loginUser = useSelector( state=>state.user );
    const {userMidx} = useParams();
    const userId = Number(userMidx);

    const navigate = useNavigate();
    const [followersImg, setFollowersImg] = useState([])
    const [followers, setFollowers] = useState([])
    const [paging, setPaging] = useState({})
    const [followersCount, setFollowersCount] = useState('')

    useEffect(
        ()=>{
            fetchFollower(1)
        },[]
    )

    const fetchFollower = async (pageNum) => {
        let targetMidx;
        try{
            if( userId !== loginUser.midx ){
            targetMidx = userId;
            //setChkMember(res.data.checkMember);
            }else{
            targetMidx = loginUser.midx;
            //setChkMember(loginUser);
            }
            console.log('해당 midx : ', targetMidx)
            const result = await jaxios.get(`/api/member/getFollowers`, {params:{page:'1', midx:loginUser.midx}} )
                setFollowers( [...result.data.followers] );
                setPaging( result.data.paging)
                setFollowersCount( result.data.totalFollowersCount )
        }catch(err){
            console.error(err)
        }
    }

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
        <div>
            <div className="follower-container">
                <div className="follower-title">
                    {loginUser.nickname}님의 팔로워&nbsp;ㅣ&nbsp;<span>{(followers)?(followersCount):(0)}명</span>
                </div>

                <div className="follower-list">
                    {
                        followers.map((fiList, idx)=>{
                            return(
                                <>  
                                    <div className="follower-info" onClick={()=>{navigate(`/followMemberView/${fiList.fromMember.midx}`)}}>
                                        <div className="follow-image-container" key={idx}>
                                            <img src={followersImg[idx]} />
                                        </div>
                                        <div className="follower-text">
                                            <div className='follower-name'>{fiList.fromMember.nickname}</div>
                                            <div className='follower-desc'>{fiList.fromMember.profilemsg}</div>
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

export default Follower