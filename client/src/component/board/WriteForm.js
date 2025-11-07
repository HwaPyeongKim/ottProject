import React from 'react'

function WriteForm() {



    
    return (
        <div className="write-form-container">
            <h2>글쓰기</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>제목</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required
                    />
                </div>
                <div>
                    <label>내용</label>
                    <textarea 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        required
                        rows={10}
                    />
                </div>
                <button type="submit">등록</button>
                <button type="button" onClick={()=>navigate("/board")}>취소</button>
            </form>
        </div>
    )
}

export default WriteForm