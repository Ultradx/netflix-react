import React from 'react'
import Nav from '../../nav/Nav';
import './profile_screen.css'
import Avatar from '../../../assets/avatar.png'
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/userSlice';
import { auth } from "../../../firebase"
import { useNavigate } from 'react-router-dom';

function ProfileScreen() {
    const user = useSelector(selectUser);
    const navigate  = useNavigate();
  return (
    <div className='profileScreen'>
        <Nav />
        <div className="profileScreen__body">
            <h1>Edit Profile</h1>
            <div className="profileScreen__info">
                <img src={Avatar} alt="" />
                <div className="profileScreen__details">
                    <h2>{user.email}</h2>
                    <div className="profileScreem__plans">
                        <h3>Plans</h3>
                        <p></p>
                        <button onClick={() => {auth.signOut(); navigate("/");}} className='profileScreen__signOut'>Sign Out</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProfileScreen;