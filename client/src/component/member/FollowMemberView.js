// Updated FollowMemberView with unified style
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import jaxios from "../../util/JWTUtil";
import "../../style/followMember.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";

function FollowMemberView() {
    const loginUser = useSelector((state) => state.user);
    const navigate = useNavigate();
    const { followMemberId } = useParams();

    const [profile, setProfile] = useState("");
    const [imgSrc, setImgSrc] = useState("");
    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get("/api/member/getFollowMember", {
                    params: { followMemberId },
                });

                const memberProfile = result.data.followMember;
                setProfile(memberProfile);

                const imgResult = await axios.get(
                    `/api/file/imgUrl/${memberProfile.profileimg}`
                );
                setImgSrc(imgResult.data.image);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [followMemberId]);

    useEffect(() => {
        jaxios
            .get("/api/member/getFollowings", {
                params: { page: 1, midx: followMemberId },
            })
            .then((res) => setFollowings([...res.data.followings]))
            .catch(console.error);

        jaxios
            .get("/api/member/getFollowers", {
                params: { page: 1, midx: followMemberId },
            })
            .then((res) => setFollowers([...res.data.followers]))
            .catch(console.error);
    }, [followMemberId]);

    const checkFollow = async () => {
        await jaxios.post("/api/member/follow", {
            ffrom: loginUser.midx,
            fto: followMemberId,
        });

        const fres = await jaxios.get("/api/member/getFollowers", {
            params: { page: 1, midx: followMemberId },
        });
        setFollowers([...fres.data.followers]);

        const gres = await jaxios.get("/api/member/getFollowings", {
            params: { page: 1, midx: followMemberId },
        });
        setFollowings([...gres.data.followings]);
    };

    const noFollow = async () => {
        await jaxios.delete("/api/member/nofollow", {
            data: { ffrom: loginUser.midx, fto: followMemberId },
        });

        const fres = await jaxios.get("/api/member/getFollowers", {
            params: { page: 1, midx: followMemberId },
        });
        setFollowers([...fres.data.followers]);

        const gres = await jaxios.get("/api/member/getFollowings", {
            params: { page: 1, midx: followMemberId },
        });
        setFollowings([...gres.data.followings]);
    };

    return (
        <div className="profile-card">

            {/* 상단 커버 */}
            <div className="cover-image-container">
                <div className="cover-image-container-list">
                    <div onClick={()=>navigate('/')}>
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
                        <h2 className="profile-name">{profile.nickname}</h2>

                        <div className="follow-stats">
                            <span className="stat-item" onClick={()=>navigate('/')}>
                                팔로잉 {followings.length}
                            </span>
                            <span className="separator">|</span>
                            <span className="stat-item" onClick={()=>navigate('/')}>
                                팔로워 {followers.length}
                            </span>
                        </div>

                        <div className="profile-msg">
                            <span className="stat-item">{profile.profilemsg}</span>
                        </div>
                    </div>
                </div>

                {followers.some((f) => String(f.ffrom) === loginUser.midx) ? (
                    <button className="follow-button" onClick={noFollow}>
                        언팔로우
                    </button>
                ) : (
                    <button className="follow-button" onClick={checkFollow}>
                        팔로우
                    </button>
                )} 


                {/* 하단 메뉴 */}
                <div className="stats-container">
                    <div className="stat-box stat-hover" onClick={()=>navigate('/')}>평점</div>
                    <div className="vertical-line"></div>
                    <div className="stat-box stat-hover" onClick={()=>navigate('/')}>후기</div>
                    <div className="vertical-line"></div>
                    <div className="stat-box stat-hover" onClick={()=>navigate('/')}>커뮤니티</div>
                </div>
            </div>
        </div>
    );
}

export default FollowMemberView;