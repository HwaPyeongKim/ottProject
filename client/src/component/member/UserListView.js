import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/JWTUtil';
import AddTitle from './AddTitle';
import "../../style/myListView.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faThumbsUp, faCheck } from "@fortawesome/free-solid-svg-icons";

function UserListView() {

    const loginUser = useSelector( state=>state.user );
    const { listidx } = useParams();
    const numericListidx = Number(listidx);

    const {userMidx} = useParams();
    const userId = Number(userMidx);

    const [targetMidx, setTargetMidx] = useState(userId);
    useEffect(() => {
    if (loginUser?.midx) {
        setTargetMidx(
        userId === loginUser.midx ? loginUser.midx : userId
        );
    }
    }, [loginUser, userId]);

    const [dbidx, setDbidx] = useState('')

    const [myListView, setMyListView] = useState({});
    const [titleList, setTitleList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [reload, setReload] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isTitleDeleteModal, setIsTitleDeleteModal] = useState(false);
    const navigate = useNavigate();

    const loader = useRef(null);

    const baseUrl = "https://api.themoviedb.org/3";

    useEffect(() => {
        fetchTitle(page);
    }, [page]);

    const fetchTitle = async (pageNum) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
        console.log("listidx : " + numericListidx);

        const result = await jaxios.get('/api/member/getMyListDetailView', {
        params: { page: pageNum, listidx: numericListidx }
        });

        console.log('fetchMovies : ', result.data.dbList);

        if (result.data.dbList.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
        }

        if (pageNum === 1) {
        setTitleList(result.data.dbList);   // 첫 페이지면 완전히 덮어쓰기
        } else {
        setTitleList(prev => [...prev, ...result.data.dbList]);
        }

    } catch (err) {
        console.error(err);
    }

    setLoading(false);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                setPage(prev => prev + 1);
            }
            },
            { threshold: 0.7 }
        );

        if (loader.current) observer.observe(loader.current);
        return () => observer.disconnect();
        }, [hasMore, loading]);

        // -----------------------------
        // AddTitle 닫힌 후 강제 리로드 처리
        // -----------------------------
        useEffect(() => {
        if (reload) {
            // 1) 상태 초기화
            setTitleList([]);
            setHasMore(true);

            // 2) page를 강제로 변경하여 useEffect(page)가 반드시 실행되도록 함
            setPage(0);
            setTimeout(() => setPage(1), 0);

            // 3) 종료
            setReload(false);
        }
        }, [reload]);

        // -----------------------------
        // AddTitle 닫기 버튼 이벤트
        // -----------------------------
        const handleAddTitleClose = () => {
        setOpen(false);
        setReload(true);   // reload 트리거
    };

    function deleteList() {
        jaxios.delete("/api/member/deleteList", { data: { midx: targetMidx, listidx: numericListidx } })
        .then(res => {
            if (res.data.msg === "ok") {
            alert("리스트가 삭제되었습니다");
            setIsDeleteModalOpen(false);
            navigate(`/userList/${loginUser.midx}`);
            } else {
            alert('리스트 삭제에 실패했습니다');
            }
        })
        .catch((err) => console.error(err));
    }

    function deleteTitle(dbidx, numericListidx){
        console.log('dbidx:',dbidx)
        console.log('listidx:',numericListidx)
        jaxios.delete("/api/member/deleteTitle", { data: { listidx:numericListidx, dbidx:dbidx } })
        .then((result)=>{
            console.log('타이틀삭제 : ', result.data.msg)
            if(result.data.msg === 'ok'){
                setIsTitleDeleteModal(false)
                setReload(true)
                // navigate(`/userListView/${numericListidx}/${loginUser.midx}`);
            }else{
                alert('잘못된 삭제입니다.')
            }
        }).catch((err)=>{console.error(err)})
    }

    return (
        <div className="list-page">
            <div className="list-header">
            <h1>{myListView.listname}</h1>

            {loginUser?.midx === targetMidx && (
                <div className="list-menu">
                    <button onClick={() => setOpen(true)}>추가</button>
                    <button
                        className="deleteButton"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        리스트 삭제
                    </button>
                </div>
            )}
            </div>

            {/* AddTitle 모달 */}
            {open && (
            <AddTitle
                listidx={numericListidx}
                onClose={handleAddTitleClose}
            />
            )}

            <div className="content-grid">
            {titleList.map((t) => (
                <div className="card" key={t.dbidx}>
                <Link className="card-link" to={`/movie/detail/${t.dbidx}`}>
                    <img
                    src={`https://image.tmdb.org/t/p/w342/${t.posterpath}`}
                    alt={t.title}
                    />
                    <div>
                        {
                            loginUser && loginUser.midx===targetMidx ?
                            <>
                                <button onClick={async (e)=>{ e.stopPropagation(); e.preventDefault(); setIsTitleDeleteModal(true); setDbidx(t.dbidx);} }><FontAwesomeIcon icon={faBookmark} /></button>
                                {/* <button className={`like${likes.includes(item.id) ? " on" : ""}`} onClick={(e)=>{e.preventDefault(); like(item.id);}}><FontAwesomeIcon icon={faThumbsUp} /></button> */}
                            </>
                            : null
                        }
                    </div>
                </Link>
                </div>
            ))}
            </div>

            {/* 무한스크롤 트리거 */}
            <div ref={loader} className="scroll-loader">
            {loading && "Loading..."}
            </div>

            {isDeleteModalOpen && (
            <div className="mlv-modalOverlay" onClick={() => setOpen(false)}>
                <div
                className="mlv-modalContent"
                onClick={(e) => e.stopPropagation()}
                >
                <h3>리스트 삭제</h3>
                <p>이 작업은 취소할 수 없습니다. 정말 리스트를 삭제하시겠습니까?</p>

                <div className="mlv-buttonWrap">
                    <button
                    className="mlv-cancelButton"
                    onClick={() => setIsDeleteModalOpen(false)}
                    >
                    취소
                    </button>
                    <button
                    className="mlv-deleteConfirmButton"
                    onClick={deleteList}
                    >
                    삭제
                    </button>
                </div>

                </div>
            </div>
            )}

            {isTitleDeleteModal && (
                <div className="modalOverlay" onClick={() => setIsTitleDeleteModal(false)}>
                    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                        <h3>타이틀 삭제</h3>
                        {/* <div>
                        <input type="text" value={listTitle} onChange={(e)=>{setListTitle(e.currentTarget.value)}} />
                        <div className="checkboxWrap">
                            <input type="checkbox" value={security} onChange={(e)=>setSecurity(e.target.checked ? "Y" : "N")} id="checkbox_security" />
                            <label htmlFor="checkbox_security" className="flex"><p>리스트 노출 여부</p> <b><FontAwesomeIcon icon={faCheck} /></b></label>
                        </div>
                        </div> */}
                        <div className="buttonWrap">
                        <button className="mainButton" onClick={()=>{deleteTitle(dbidx, numericListidx)}}>삭제하기</button>
                        <button className="mainButton" onClick={()=>setIsTitleDeleteModal(false)}>닫기</button>
                        </div>
                    </div>
                </div>
            )}      
        </div>
    )
}

export default UserListView