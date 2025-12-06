import '../../style/reviewCard.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

function ReviewCard({ review }) {

    const date = new Date(review.writedate);
    const timeAgo = formatDistanceToNow(date, { 
        addSuffix: true,
        locale: ko,
    });

    return (
        <div className="rc-review-card">

            {/* 헤더 영역 */}
            <div className="rc-review-header">

                <img
                    src={`https://image.tmdb.org/t/p/w342/${review.posterpath}`}
                    className="rc-poster-img"
                    alt="poster"
                />

                <div className="rc-review-info">
                    <div className="rc-review-title">{review.title}</div>
                    <div className="rc-review-date">{timeAgo}</div>
                </div>

                {/* 오른쪽 상단 평점 */}
                <div className="rc-review-rating-top">
                    <FontAwesomeIcon icon={faStar} className="rc-star-icon" />
                    <span>{review.score}</span>
                </div>
            </div>

            {/* 리뷰 내용 */}
            <div className="rc-review-content">{review.content}</div>
        </div>
    );
}

export default ReviewCard;
