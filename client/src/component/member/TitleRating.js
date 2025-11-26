import {useState, useEffect} from 'react'
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/JWTUtil';

import '../../style/titleRating.css'

function TitleRating() {
    
    const loginUser = useSelector( state=>state.user );
    const [movies, setMovies] = useState([]);
    const [sort, setSort] = useState("scoreDesc");
    const [listTab, setListTab] = useState('tab1')
    const [isAddListModal, setIsAddListModal] = useState(false);
    const [reviewList, setReviewList] = useState([]);
    useEffect(
        () => {
            jaxios.get('/api/member/getReviewList', {params:{midx:loginUser.midx}})
            .then((result)=>{
                setReviewList(result.data.reviewList)
            }).catch((err)=>{console.error(err)})
        }, []
    );

    // const sortedMovies = [...movies].sort((a, b) => {
    //     if (sort === "scoreDesc") return b.score - a.score;
    //     if (sort === "scoreAsc") return a.score - b.score;
    //     return 0;
    // });

    return (
        <div className="tr-container">
            <div className="tr-tabs">
                <button className={listTab === 'tab1' ? "active" : ""}  
                onClick={()=>{setListTab('tab1')}}>전체</button>
                <button className={listTab === 'tab2' ? "active" : ""} 
                onClick={()=>{setListTab('tab2')}}>별점 순</button>
            </div>
            {/* <div className="header-container">
                <select value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="scoreDesc">별점 높은 순</option>
                    <option value="scoreAsc">별점 낮은 순</option>
                </select>
            </div> */}

            <div className="tr-grid">
                {  
                    (listTab === 'tab1')?(
                        <></>
                        // <div className="content-grid">
                        //     {reviewList.map(review => (
                        //     <div className="card" key={review.dbidx}>
                        //         <a href={`/movie/detail/${review.dbidx}`}>
                        //         <img
                        //             src={`https://image.tmdb.org/t/p/w342/${movie.posterpath}`}
                        //             alt={movie.title}
                        //         />
                        //         </a>
                        //     </div>
                        //     ))}
                        // </div>
                    ):(
                        <></>
                    )
                }
            </div>
            

            {/* {isAddListModal && (
                <div className="modalOverlay" onClick={() => setIsAddListModal(false)}>
                    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                        <h3>리스트 추가</h3>
                        <div>
                        <input type="text" value={listTitle} onChange={(e)=>{setListTitle(e.currentTarget.value)}} />
                        <div className="checkboxWrap">
                            <input type="checkbox" value={security} onChange={(e)=>setSecurity(e.target.checked ? "Y" : "N")} id="checkbox_security" />
                            <label htmlFor="checkbox_security" className="flex"><p>리스트 노출 여부</p> <b><FontAwesomeIcon icon={faCheck} /></b></label>
                        </div>
                        </div>
                        <div className="buttonWrap">
                        <button className="mainButton" onClick={()=>{addList()}}>추가하기</button>
                        <button className="mainButton" onClick={()=>setIsAddListModal(false)}>닫기</button>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    )
}

export default TitleRating