import React, { useRef } from 'react'
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../../../firebase';
import './signup_screen.css'

function SignupScreen() {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const register = (e) => {
        e.preventDefault();

        console.log("Test");
        createUserWithEmailAndPassword(
            auth,
            emailRef.current.value,
            passwordRef.current.value
        ).then((authUser) => {
            console.log(authUser);
        }).catch((error) => {
            alert(error.message)
        });
    };

    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword (
            auth,
            emailRef.current.value,
            passwordRef.current.value
        ).then((authUser) => {
            console.log(authUser);
        }).catch((error) => {
            alert(error.message)
        });
    }

  return (
    <div className='signupScreen'>
        <form>
            <h1>Sign In</h1>
            <input ref={emailRef} type="email" placeholder='Email' />
            <input ref={passwordRef} type="password" placeholder='Password' />
            <button type='submint' onClick={signIn}>Sign In</button>

            <h4>
                <span className='signupScreen__gray'>New to Netflix?</span>
                <span className='signupScreen__link' onClick={register}>Sign Up now.</span>
            </h4>
        </form>
        
    </div>
  )
}

export default SignupScreen