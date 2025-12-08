import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

import { useSelector } from 'react-redux';
import jaxios from '../../util/JWTUtil';

import '../../style/followlist.css';

function Follower() {

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

    const navigate = useNavigate();
    const [followersImg, setFollowersImg] = useState([])
    const [followers, setFollowers] = useState([])
    const [followersCount, setFollowersCount] = useState('')
    const [userNickname, setUserNickname] = useState('')

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const loader = useRef(null);

    useEffect(
        ()=>{
            fetchFollower(page)
        },[page]
    )

    const fetchFollower = async (pageNum) => {
        try{
            console.log('해당 midx : ', targetMidx)
            if(targetMidx!==loginUser.midx){
                const res = await axios.get("/api/member/getFollowMember", {
                    params: { midx:targetMidx },
                });
                setUserNickname(res.data.followMember.nickname)
            }else{
                setUserNickname(loginUser.nickname)
            }

            const result = await jaxios.get(`/api/member/getFollowers`, {params:{page:pageNum, midx:targetMidx}} )
            if (result.data.followers.length === 0) {
                setHasMore(false);
                setLoading(false);
                return;
            }
            if (pageNum === 1) {
                setFollowers( [...result.data.followers] );
                //setPaging( result.data.paging)
                setFollowersCount( result.data.totalFollowersCount )
                console.log('follwers : ', followers)
            } else {
                setFollowers(prev => [...prev, ...result.data.followers]);
                console.log('follwers : ', followers)
            }
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

    useEffect(() => {
        const observer = new IntersectionObserver(
        entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
            setPage(prev => prev + 1);
            }
        },
        { threshold: 0.7 }
        );

        if (loader.current) observer.observe(loader.current);
        return () => observer.disconnect();
    }, [hasMore, loading]);

    return (
        <div>
            <div className="follower-container">
                <div className="follower-title">
                    {userNickname}님의 팔로워&nbsp;ㅣ&nbsp;<span>{(followers?.length)?(followersCount):(0)}명</span>
                </div>

                <div className="follower-list">
                    {
                        followers.map((fiList, idx)=>{
                            return(
                                <>  
                                    <div className="follower-info" key={fiList.fromMember.midx}
                                    onClick={()=>{navigate(`/pageView/${fiList.fromMember.midx}`)}}>
                                        <div className="follow-image-container">
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

            <div ref={loader} className="scroll-loader">
                {loading && "Loading..."}
            </div>
        </div>
    )
}

export default Follower