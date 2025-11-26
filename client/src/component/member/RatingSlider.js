import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";

function RatingSlider({title, movies}) {

    const settings = {
        dots: false,
        infinite: false,
        speed: 400,
        slidesToShow: 6,
        slidesToScroll: 6,
    };

    return (
        <div className="tr-slider-grid">
            <h2>{title}</h2>

            <Slider {...settings} className="lists">
                {movies.map((m) => (
                    <div className="card" key={m.dbidx}>
                        <img
                            src={`https://image.tmdb.org/t/p/w342/${m.posterpath}`}
                            alt={m.title}
                        />
                        <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
                            <FontAwesomeIcon icon={solidStar} style={{ color: "gold" }} />
                            <span>{m.score}</span>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default RatingSlider
