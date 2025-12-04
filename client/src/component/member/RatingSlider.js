import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";

function RatingSlider({ title, movies }) {

    const settings = {
        dots: false,
        infinite: false,
        speed: 400,
        slidesToShow: 8,
        slidesToScroll: 8,
    };

    // 🔥 부족한 슬라이드 만큼 dummy 카드 추가
    const dummyCount = Math.max(0, 8 - movies.length);
    const dummyArray = Array(dummyCount).fill(null);

    return (
        <div className="tr-slider-grid">
            <h2>{title}&nbsp;&nbsp;&nbsp;{movies.length}</h2>

            <Slider {...settings} className="lists">
                {movies.map((m) => (
                    <div className="card" key={m.dbidx}>
                        <img
                            src={`https://image.tmdb.org/t/p/w342/${m.posterpath}`}
                            alt={m.title}
                        />
                        <div className="title-text">
                            {m.title.length > 15 
                                ? m.title.substring(0, 15) + "..." 
                                : m.title}
                        </div>
                    </div>
                ))}

                {/* 🔥 dummy 카드 삽입 (빈칸 유지용) */}
                {dummyArray.map((_, idx) => (
                    <div className="card dummy" key={`dummy-${idx}`}></div>
                ))}
            </Slider>
        </div>
    );
}

export default RatingSlider;
