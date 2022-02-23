import React, { useEffect, useState } from 'react'
import './nav.css'
import Netflix_Logo from '../../assets/netflix_logo.png'
import Avatar from '../../assets/avatar.png'

export default function Nav() {
  const [show, handleShow] = useState(false);

  const transitionNavBar = () => {
    if(window.scrollY > 100) {
      handleShow(true);
    } else {
      handleShow(false);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', transitionNavBar);
    return () => window.removeEventListener('scroll', transitionNavBar);
  }, []);
  return (
    <div className={`nav ${show && "nav__black"}`}>
      <div className="nav__contents">
      <img className='nav__logo' src={Netflix_Logo} alt="" />
      <img className='nav__avatar' src={Avatar} alt="" />

      </div>
    </div>
  )
}
