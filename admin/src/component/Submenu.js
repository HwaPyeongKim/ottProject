import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logoutAction } from '../store/userSlice'
import { useDispatch } from 'react-redux'
import { Cookies } from 'react-cookie'

function SubMenu() {
    const navigate = useNavigate()
    const cookies = new Cookies()
    const dispatch = useDispatch()

    function onLogout() {
        dispatch(logoutAction())
        cookies.remove('user')
        navigate('/')
    }

    return (
        <div className="admin-menu">
            <Link className="admin-menu-item" to="/memberList">MEMBER</Link>
            <Link className="admin-menu-item" to="/qnaList">Q & A</Link>
            <Link className="admin-menu-item" to="/spoilerList">SPOILER</Link>
            <button className="admin-menu-btn" >BACK</button>
        </div>
    )
}

export default SubMenu
