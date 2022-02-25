import React, { useEffect } from 'react'
import './App.css'
import HomeScreen from './components/screens/home_screen/HomeScreen'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginScreen from './components/screens/login_screen/LoginScreen'
import ProfileScreen from './components/screens/profile_screen/ProfileScreen'
import { auth } from './firebase'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout, selectUser } from './features/userSlice'

function App() {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        // Logged In
        dispatch(
          login({
            uid: userAuth.uid,
            email: userAuth.email,
          }),
        )
      } else {
        // Logged out
        dispatch(logout())
      }
    })

    return unsubscribe
  }, [dispatch])
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          {!user ? (
            <Route exact path="/" element={<LoginScreen />} />
          ) : (
            <>
              <Route exact path="/profile" element={<ProfileScreen />} />
              <Route exact path="/" element={<HomeScreen />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
