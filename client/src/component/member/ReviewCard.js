import '../../style/reviewCard.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faHeart, faShare } from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

function ReviewCard({ review, user }) {

    const date = new Date(review.writedate);
    const timeAgo = formatDistanceToNow(date, { 
        addSuffix: true, // "전" 또는 "후" 접미사 추가
        locale: ko,      // 한국어 로케일 적용
    });

    return (
        <div className="rc-review-card">
            <div className="rc-review-header">
                <img src={`https://image.tmdb.org/t/p/w342/${review.posterpath}`} className="rc-profile-img" alt="" />

                <div className="rc-review-user-info">
                    <div className="rc-review-nickname">{user.nickname}</div>
                    <div className="rc-review-date">{timeAgo}</div>
                </div>

                <div className="rc-review-rating">
                    <FontAwesomeIcon icon={faStar} />
                    <span>{review.score}</span>
                </div>
            </div>

            <div className="rc-review-content">{review.content}</div>

            {/* <div className="rc-review-footer">
                <span className="rc-review-like">
                    <FontAwesomeIcon icon={faHeart} /> {review.likeCount}
                </span>
                <span className="rc-review-share">
                    <FontAwesomeIcon icon={faShare} /> 공유하기
                </span>
            </div> */}
        </div>
    );
}

export default ReviewCard;