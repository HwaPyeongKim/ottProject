import React , {useState, useEffect, use} from 'react'
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import '../../style/followMember.css'
import { useSelector } from 'react-redux';
import jaxios from '../../util/JWTUtil';

function FollowMemberView() {
    const loginUser = useSelector( state=>state.user );
    const {followMemberId} = useParams()
    const [profile, setProfile] = useState('');
    const [imgSrc, setImgSrc] = useState('')

    const [coverImageUrl, setCoverImageUrl] = useState('')
    const [profileImageUrl, setProfileImageUrl] = useState('')
    const [name, setName] = useState('')
    const [tagline, setTagline] = useState('')
    const [followers, setFollowers] = useState('')
    const [followings, setFollowings] = useState('')
    const [ratings, setRatings] = useState('')
    const [comments, setComments] = useState('')
    const [collections, setCollections] = useState('')

    useEffect(
        () => {
        // 1. useEffect 내부에서 async 함수를 정의합니다.
        const fetchData = async () => {
            let memberProfile; // 첫 번째 API 응답의 데이터를 임시로 저장할 변수

            try {
                // 첫 번째 API 호출: followMember 정보 가져오기 (await으로 완료를 기다림)
                const result = await axios.get('/api/member/getFollowMember', {params:{followMemberId}});
                
                console.log('응답 확인 : ', result.data.followMember);
                memberProfile = result.data.followMember; // 데이터 저장
                setProfile(memberProfile); // state 업데이트

                // 두 번째 API 호출: 이미지 URL 가져오기 (첫 번째 API의 데이터 사용)
                // profile state는 즉시 업데이트되지 않으므로, 위에서 저장한 memberProfile 변수 사용
                const imgResult = await axios.get(`/api/file/imgUrl/${memberProfile.profileimg}`); 

                console.log('이미지 : ' + imgResult.data.image);
                setImgSrc(imgResult.data.image); // 미리보기 이미지 URL 설정

            } catch (err) {
                console.error(err);
            }
        };

        // 2. 정의된 비동기 함수를 호출하여 실행합니다.
        fetchData();

        // 의존성 배열은 그대로 followMemberId를 유지합니다.
        }, [followMemberId]
    )

    useEffect(
        ()=>{
            jaxios.get('/api/member/getFollowings', {params:{midx:followMemberId}} )
            .then((result)=>{
                console.log('팔로잉 : ', result.data)
                setFollowings( [...result.data.followings] );
            }).catch((err)=>{console.error(err)})
            jaxios.get('/api/member/getFollowers', {params:{midx:followMemberId}} )
            .then((result)=>{
                console.log('팔로워 : ', result.data)
                setFollowers( [...result.data.followers] );
            }).catch((err)=>{console.error(err)})
        },[]
    )

    return (
        <div className="profile-card">
        {/* 1. 커버 이미지 섹션 */}
        <div className="cover-image-container">
            <img src={coverImageUrl} alt="Cover" className="cover-image" />
        </div>

        {/* 2. 프로필 정보 섹션 */}
        <div className="profile-info">
            <div className="profile-avatar-container">
            {/* 프로필 이미지를 커버 이미지 위에 겹치도록 배치합니다. */}
            <img src={imgSrc} alt="Profile" className="profile-avatar" />
            </div>

            <div className="name-and-follow">
            <h2 className="profile-name">
                {name}
                <span className="verified-badge">W</span>
            </h2>
            {/* 팔로우/팔로잉 정보 */}
            <div className="follow-stats">
                <span className="stat-item" style={{color:'orange', fontWeight:'bold'}}>팔로워 **{followers.length}**</span>
                <span className="separator">|</span>
                <span className="stat-item" style={{color:'orange', fontWeight:'bold'}}>팔로잉 **{followings.length}**</span>
            </div>
            </div>

            <p className="tagline">{tagline}</p>
            
            {/* 3. 팔로우 버튼 */}
            <button className="follow-button">팔로우</button>

            {/* 4. 통계/수치 섹션 */}
            <div className="stats-container">
            <div className="stat-box">
                <p className="stat-number">{ratings.toLocaleString()}</p>
                <p className="stat-label">평가</p>
            </div>
            <div className="stat-box">
                <p className="stat-number">{comments.toLocaleString()}</p>
                <p className="stat-label">코멘트</p>
            </div>
            <div className="stat-box">
                <p className="stat-number">{collections.toLocaleString()}</p>
                <p className="stat-label">컬렉션</p>
            </div>
            </div>
        </div>
        </div>
    )
}

export default FollowMemberView