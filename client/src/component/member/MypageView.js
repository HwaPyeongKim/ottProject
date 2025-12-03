import {useState, useEffect} from 'react'
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import '../../style/followMember.css'
import { useSelector } from 'react-redux';
import jaxios from '../../util/JWTUtil';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faThumbsUp, faArrowLeft, faArrowRight, faPlay, faStar } from "@fortawesome/free-solid-svg-icons";

function MypageView() {

    const loginUser = useSelector( state=>state.user );
    const navigate = useNavigate()
    const {followMemberId} = useParams()
    const [profile, setProfile] = useState('');
    const [imgSrc, setImgSrc] = useState('')

    const [profileImageUrl, setProfileImageUrl] = useState('')
    const [name, setName] = useState('')
    const [tagline, setTagline] = useState('')
    const [followers, setFollowers] = useState([])
    const [followings, setFollowings] = useState([])
    const [ratings, setRatings] = useState('')
    const [comments, setComments] = useState('')
    const [collections, setCollections] = useState('')

    const [followButton, setFollowButton] = useState('')
    const [userFollowers, setUserFollowers] = useState([])
    const [userFollowings, setUserFollowings] = useState([])

    const [followingsCount, setFollowingsCount] = useState('')
    const [followersCount, setFollowersCount] = useState('')

    useEffect(
        () => {
        const fetchData = async () => {
            //let memberProfile; // 첫 번째 API 응답의 데이터를 임시로 저장할 변수
            try {
                // const result = await axios.get('/api/member/getFollowMember', {params:{midx:loginUser.midx}});
                // memberProfile = result.data.followMember; 
                // setProfile(memberProfile); 
                const result = await axios.get(`/api/file/imgUrl/${loginUser.profileimg}`); 
                setImgSrc(result.data.image); 
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
        }, [loginUser]
    )

    useEffect(
        ()=>{
            jaxios.get('/api/member/getFollowings', {params:{page:1, midx:loginUser.midx}} )
            .then((result)=>{
                console.log('상세정보 팔로잉 : ', result.data)
                setFollowings( [...result.data.followings] );
                setFollowingsCount( result.data.totalFollowingsCount)
            }).catch((err)=>{console.error(err)})
            jaxios.get('/api/member/getFollowers', {params:{page:1, midx:loginUser.midx}} )
            .then((result)=>{
                console.log('상세정보 팔로워 : ', result.data)
                setFollowers( [...result.data.followers] );
                setFollowersCount( result.data.totalFollowersCount )
            }).catch((err)=>{console.error(err)})
        },[loginUser]
    )

    const onClickBtn = () => {
        navigate(-1); 
    };    

    return (
        <div className="profile-card">

            {/* 상단 커버 */}
            <div className="cover-image-container">
                <div className="cover-image-container-list">
                    <div onClick={()=>navigate('/')}>
                        <FontAwesomeIcon icon={faBookmark} />&nbsp;나의 리스트&nbsp;&nbsp;&nbsp;
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
                            <span className="stat-item" onClick={()=>navigate(`/follow/${loginUser.midx}`)}>
                                팔로잉 { (followings)?(followingsCount):(0) }
                            </span>
                            <span className="separator">|</span>
                            <span className="stat-item" onClick={()=>navigate(`/follower/${loginUser.midx}`)}>
                                팔로워 { (followers)?(followersCount):(0) }
                            </span>
                        </div>

                        <div className="profile-msg">
                            <span className="stat-item">{loginUser.profilemsg}</span>
                        </div>
                    </div>
                </div>
                {/* 하단 메뉴 */}
                <div className="stats-container">
                    <div className="stat-box stat-hover" onClick={()=>navigate(`/titleRating/${loginUser.midx}`)}>평점</div>
                    <div className="vertical-line"></div>
                    <div className="stat-box stat-hover" onClick={()=>navigate(`/titleReview/${loginUser.midx}`)}>후기</div>
                    <div className="vertical-line"></div>
                    <div className="stat-box stat-hover" onClick={()=>navigate('/')}>커뮤니티</div>
                </div>
            </div>
        </div>
    )
}

export default MypageView
