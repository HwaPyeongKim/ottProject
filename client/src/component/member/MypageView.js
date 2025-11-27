import {useState, useEffect} from 'react'
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import '../../style/followMember.css'
import { useSelector } from 'react-redux';
import jaxios from '../../util/JWTUtil';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";

function MypageView() {

    const loginUser = useSelector( state=>state.user );
    const navigate = useNavigate()
    const {followMemberId} = useParams()
    const [imgSrc, setImgSrc] = useState('')

    const [followers, setFollowers] = useState([])
    const [followings, setFollowings] = useState([])
    const [followingsCount, setFollowingsCount] = useState('')
    const [followersCount, setFollowersCount] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get(`/api/file/imgUrl/${loginUser.profileimg}`); 
                setImgSrc(result.data.image); 
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, [loginUser])

    useEffect(() => {
        jaxios.get('/api/member/getFollowings', {params:{page:1, midx:loginUser.midx}})
            .then((result)=>{
                setFollowings(result.data.followings);
                setFollowingsCount(result.data.totalFollowingsCount)
            })
        jaxios.get('/api/member/getFollowers', {params:{page:1, midx:loginUser.midx}})
            .then((result)=>{
                setFollowers(result.data.followers);
                setFollowersCount(result.data.totalFollowersCount)
            })
    }, [loginUser])

    return (
        <div className="profile-card">

            {/* 상단 커버 */}
            <div className="cover-image-container">
                <div className="cover-image-container-list">
                    <div onClick={()=>navigate('/mylist')}>
                        <FontAwesomeIcon icon={faBookmark} />&nbsp;내 리스트&nbsp;&nbsp;&nbsp;
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
                        <h2 className="profile-name">{loginUser.nickname}</h2>

                        <div className="follow-stats">
                            <span className="stat-item" onClick={()=>navigate('/myfollow')}>
                                팔로잉 {followingsCount}
                            </span>
                            <span className="separator">|</span>
                            <span className="stat-item" onClick={()=>navigate('/myfollower')}>
                                팔로워 {followersCount}
                            </span>
                        </div>

                        <div className="profile-msg">
                            <span className="stat-item">{loginUser.profilemsg}</span>
                        </div>
                    </div>
                </div>
                {/* 하단 메뉴 */}
                <div className="stats-container">
                    <div className="stat-box stat-hover" onClick={()=>navigate('/titleRating')}>평점</div>
                    <div className="vertical-line"></div>
                    <div className="stat-box stat-hover">후기</div>
                    <div className="vertical-line"></div>
                    <div className="stat-box stat-hover">커뮤니티</div>
                </div>
            </div>
        </div>
    )
}

export default MypageView
