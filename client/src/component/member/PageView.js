import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import jaxios from "../../util/JWTUtil";
import "../../style/followMember.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";

function PageView() {

    const loginUser = useSelector( state=>state.user );
    const {userMidx} = useParams();
    const userId = Number(userMidx);
    const [targetMidx, setTargetMidx] = useState(
    userId === loginUser.midx ? loginUser.midx : userId);
    
    const [profile, setProfile] = useState("");
    const [imgSrc, setImgSrc] = useState("");
    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings] = useState([]);

    const [followingsCount, setFollowingsCount] = useState('')
    const [followersCount, setFollowersCount] = useState('')

    const navigate = useNavigate();

    useEffect(
        ()=>{
            fetchData()
        },[loginUser || userId]
    )

    const fetchData = async () => {
        try {
            if( userId !== loginUser.midx ){
                setTargetMidx(userId)
                const result = await axios.get("/api/member/getFollowMember", {
                    params: { midx:targetMidx },
                });

                const memberProfile = result.data.followMember;
                setProfile(memberProfile);

                const imgResult = await axios.get(
                    `/api/file/imgUrl/${memberProfile.profileimg}`
                );
                setImgSrc(imgResult.data.image);
            }else{
                setTargetMidx(loginUser.midx)
                const result = await axios.get(`/api/file/imgUrl/${loginUser.profileimg}`); 
                setImgSrc(result.data.image); 
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(
        ()=>{
            jaxios.get('/api/member/getFollowings', {params:{page:1, midx:targetMidx}} )
            .then((result)=>{
                console.log('상세정보 팔로잉 : ', result.data)
                setFollowings( [...result.data.followings] );
                setFollowingsCount( result.data.totalFollowingsCount)
            }).catch((err)=>{console.error(err)})
            jaxios.get('/api/member/getFollowers', {params:{page:1, midx:targetMidx}} )
            .then((result)=>{
                console.log('상세정보 팔로워 : ', result.data)
                setFollowers( [...result.data.followers] );
                setFollowersCount( result.data.totalFollowersCount )
            }).catch((err)=>{console.error(err)})
        },[]
    )

    const checkFollow = async () => {
        await jaxios.post("/api/member/follow", {
            ffrom: loginUser.midx,
            fto: userId,
        });

        const fres = await jaxios.get("/api/member/getFollowers", {
            params: { page: 1, midx: userId },
        });
        setFollowers([...fres.data.followers]);

        const gres = await jaxios.get("/api/member/getFollowings", {
            params: { page: 1, midx: userId },
        });
        setFollowings([...gres.data.followings]);
    };

    const noFollow = async () => {
        await jaxios.delete("/api/member/nofollow", {
            data: { ffrom: loginUser.midx, fto: userId },
        });

        const fres = await jaxios.get("/api/member/getFollowers", {
            params: { page: 1, midx: userId },
        });
        setFollowers([...fres.data.followers]);

        const gres = await jaxios.get("/api/member/getFollowings", {
            params: { page: 1, midx: userId },
        });
        setFollowings([...gres.data.followings]);
    };
    
    return (
        <div className="profile-card">
            {/* 상단 커버 */}
            <div className="cover-image-container">
                <div className="cover-image-container-list">
                    <div onClick={()=>navigate(`/userList/${targetMidx}`)}>
                        <FontAwesomeIcon icon={faBookmark} />&nbsp;리스트&nbsp;&nbsp;&nbsp;
                    </div>
                </div>
            </div>

            {/* 프로필 영역 */}
            <div className="profile-info">

                <div className="profile-top-row">
                    <div className="profile-avatar-container">
                        <img src={imgSrc} alt="Profile" className="profile-avatar" />
                    </div>

                    <div className="name-and-follow">
                        <h2 className="profile-name">
                            {
                                (targetMidx === loginUser.midx)?
                                (loginUser.nickname):(profile.nickname)
                            }
                        </h2>

                        <div className="follow-stats">
                            <span className="stat-item" onClick={()=>navigate(`/follow/${targetMidx}`)}>
                                팔로잉 { (followings)?(followingsCount):(0) }
                            </span>
                            <span className="separator">|</span>
                            <span className="stat-item" onClick={()=>navigate(`/follower/${targetMidx}`)}>
                                팔로워 { (followers)?(followersCount):(0) }
                            </span>
                        </div>

                        <div className="profile-msg">
                            <span className="stat-item">
                                {
                                    (targetMidx === loginUser.midx)?
                                    (loginUser.profilemsg):(profile.profilemsg)
                                }
                            </span>
                        </div>
                    </div>
                </div>

                {loginUser.midx !== targetMidx && (
                    followers.some(f => String(f.ffrom) === String(loginUser.midx)) ? (
                        <button className="follow-button" onClick={noFollow}>
                            언팔로우
                        </button>
                    ) : (
                        <button className="follow-button" onClick={checkFollow}>
                            팔로우
                        </button>
                    )
                )}
                
                {/* 하단 메뉴 */}
                <div className="stats-container">
                    <div className="stat-box stat-hover" onClick={()=>navigate(`/titleRating/${targetMidx}`)}>평점</div>
                    <div className="vertical-line"></div>
                    <div className="stat-box stat-hover" onClick={()=>navigate(`/titleReview/${targetMidx}`)}>후기</div>
                    <div className="vertical-line"></div>
                    <div className="stat-box stat-hover" onClick={()=>navigate('/')}>커뮤니티</div>
                </div>
            </div>
        </div>
    )
}

export default PageView
