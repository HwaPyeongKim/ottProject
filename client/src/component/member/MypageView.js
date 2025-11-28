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

    // async function checkFollow(){
    //     await jaxios.post('/api/member/follow', { ffrom:loginUser.midx, fto:followMemberId });
        
    //     let result = await jaxios.get('/api/member/getFollowers', {params:{page:1, midx:followMemberId}})
    //     setFollowers( [...result.data.followers] )
    //     result = await jaxios.get('/api/member/getFollowings', {params:{page:1, midx:followMemberId}})
    //     setFollowings( [...result.data.followings] )
    // }
    // async function noFollow(){
    //     console.log('언팔로우 버튼')
    //     await jaxios.delete('/api/member/nofollow', {data: { ffrom:loginUser.midx, fto:followMemberId }});
        
    //     let result = await jaxios.get('/api/member/getFollowers', {params:{page:1, midx:followMemberId}})
    //     setFollowers( [...result.data.followers] )
    //     result = await jaxios.get('/api/member/getFollowings', {params:{page:1, midx:followMemberId}})
    //     setFollowings( [...result.data.followings] )
    // }

    const onClickBtn = () => {
        navigate(-1); 
    };    

    return (
        <div className="profile-card">
            {/* 1. 커버 이미지 섹션 */}
            <div className="cover-image-container">
                <div className="cover-image-container-list">
                    <button className="buttonHover" onClick={()=>{navigate('/mylist');}}><FontAwesomeIcon icon={faBookmark} /></button>
                    리스트 이동
                </div>
                {/* <img src={coverImage} alt="Cover" className="cover-image" /> */}
            </div>

            {/* 2. 프로필 정보 섹션 */}
            <div className="profile-info">
                <div className="profile-avatar-container">
                    {/* 프로필 이미지를 커버 이미지 위에 겹치도록 배치합니다. */}
                    <img src={imgSrc} alt="Profile" className="profile-avatar" />
                </div>

                <div className="name-and-follow">
                    <h2 className="profile-name" style={{color:'orange'}}>
                        <span className="verified-badge">W</span>&nbsp;
                        {loginUser.nickname}
                    </h2>
                    {/* 팔로우/팔로잉 정보 */}
                    <div className="follow-stats">
                        <span className="stat-item" style={{color:'orange', fontWeight:'bold'}}
                        onClick={() => { navigate('/myfollow'); }}>팔로잉 **
                        {
                            (followings)?(followingsCount):(0)   
                        }**</span>
                        <span className="separator">|</span>
                        <span className="stat-item" style={{color:'orange', fontWeight:'bold'}}
                        onClick={() => { navigate('/myfollower'); }}>팔로워 **
                        {
                            (followers)?(followersCount):(0)
                        }**</span>
                    </div>
                    <div className='follow-stats'>
                        <span className='stat-item' style={{color:'orange', fontWeight:'bold'}}>{loginUser.profilemsg}</span>
                    </div>
                </div>

                <p className="tagline">{tagline}</p>
                
                {/* 4. 통계/수치 섹션 */}
                <div className="stats-container">
                    <div className="stat-box">
                        {/* <p className="stat-number">{ratings.toLocaleString()}</p> */}
                        <div className="stat-label" onClick={()=>{navigate('/titleRating')}}>평가</div>
                    </div>
                    <div className="stat-box">
                        {/* <p className="stat-number">{comments.toLocaleString()}</p> */}
                        <div className="stat-label" onClick={()=>{navigate(`/titleReview/${loginUser.midx}`)}}>후기</div>
                    </div>
                    <div className="stat-box">
                        {/* <p className="stat-number">{collections.toLocaleString()}</p> */}
                        <div className="stat-label" onClick={onClickBtn}>이전</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MypageView
