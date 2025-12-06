import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

import { useSelector } from 'react-redux';
import jaxios from '../../util/JWTUtil';

import '../../style/followlist.css';

function Follow() {

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
    const [followingsImg, setFollowingsImg] = useState('')
    const [followings, setFollowings] = useState([])
    const [paging, setPaging] = useState({})
    const [followingsCount, setFollowingsCount] = useState('')

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const loader = useRef(null);

    useEffect(
        ()=>{
            fetchFollow(page)
        },[page]
    )

    const fetchFollow = async (pageNum) => {
        try{
            console.log('해당 midx : ', targetMidx)
            const result = await jaxios.get(`/api/member/getFollowings`, {params:{page:pageNum, midx:targetMidx}} )
            if (result.data.followings.length === 0) {
                setHasMore(false);
                setLoading(false);
                return;
            }
            if (pageNum === 1) {
                setFollowings( [...result.data.followings] );
                //setPaging( result.data.paging )
                setFollowingsCount( result.data.totalFollowingsCount)
            } else {
                setFollowings(prev => [...prev, ...result.data.followings]);
            }
        }catch(err){
            console.error(err)
        }
    }

    useEffect(()=>{
            if(followings.length > 0){
                const startIdx = followingsImg.length;
                const newFollowers = followings.slice(startIdx);
                getFollowingsImg(newFollowers);
            }
        }, [followings]
    );

    function getFollowingsImg(){
        followings.forEach((f, i) => {
            //const idx = followingsImg.length + i;
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

    // useEffect(() => {
    //     setFollowings([]);  // 기존 데이터를 비움
    //     setPage(1);
    //     setHasMore(true);
    // }, [page]);

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
    //---------------------------------------------------- 무한 스크롤 -------------------------------------------------------------
    // useEffect(
    //     ()=>{ 
    //         window.addEventListener('scroll', handleScroll );
    //         return () => {
    //             window.removeEventListener("scroll", handleScroll);
    //         }
    //     },[paging.page, followings]
    // )
    // const handleScroll=()=>{
    //     console.log('핸들스크롤입니다.')
    //     const scrollHeight = document.documentElement.scrollHeight - 100; 
    //     const scrollTop = document.documentElement.scrollTop;  
    //     const clientHeight = document.documentElement.clientHeight; 
    //     if( scrollTop + clientHeight >= scrollHeight ) {
    //         if( Number(paging.page) >= Number(paging.totalPage) ){return}
    //         onPageMove( Number(paging.page) + 1 );
    //     }
    // }

    // function onPageMove(p){
    //     jaxios.get(`/api/member/getFollowings`, {params:{page:p, midx:loginUser.midx}} )
    //     .then((result)=>{
    //         setPaging( result.data.paging )
    //         let follows = [];
    //         follows = [...followings]
    //         follows = [...follows, ...result.data.followings]
    //         setFollowings( [...follows] );
    //     }).catch((err)=>{console.error(err)})
    // }

    return (
        <div>
            <div className="follower-container">
                <div className="follower-title">
                    {
                        (targetMidx === loginUser.midx)?
                        (loginUser.nickname):(followings.nickname)
                    }님의 팔로잉&nbsp;ㅣ&nbsp;<span>{(followings)?(followingsCount):(0)}명</span>
                </div>

                <div className="follower-list">
                    {
                        followings.map((fiList, idx)=>{
                            return(
                                <>  
                                    <div className="follower-info" key={fiList.toMember.midx}
                                    onClick={()=>{navigate(`/pageView/${fiList.toMember.midx}`)}}>
                                        <div className="follow-image-container">
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

            <div ref={loader} className="scroll-loader">
                {loading && "Loading..."}
            </div>
        </div>
    )
}

export default Follow