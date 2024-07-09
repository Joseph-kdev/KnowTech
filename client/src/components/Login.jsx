import React, { useReducer} from 'react'
import { auth, googleProvider } from "../config/firebase-config.js"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { reducer } from '../config/reducer.js'

export const Login = () => {
    const [state, dispatch] = useReducer(reducer, { email: "", password: "", hasAccount: false })

    const handleLogin = async(event) => {
        event.preventDefault()
        const email = state.email
        const password = state.password

        if (!email || !password) {
            alert('Please fill in both fields.');
            return;
          }

        try {
            if(!state.hasAccount) {
                await createUserWithEmailAndPassword(auth, email, password)
                console.log("user created")
                
            } else {
                await signInWithEmailAndPassword(auth, email, password)
                console.log("User Signed in")
            }
        } catch (error) {
            console.log(error)
        }

    }

  return (
    <div>
        {state.hasAccount ? (
            <h2>Login</h2>
        ) : (
            <h2>Sign Up</h2>
        )}
        <form action="">
            <div>
                <label htmlFor="email">
                    Enter Email:
                </label>
                <input 
                    type="text" 
                    id='email'
                    value={state.email}
                    onChange={(e) => dispatch({ type: "email-entered", payload: e.target.value})}
                        />
                 <label htmlFor="password">
                    Enter Password:
                 </label>
                 <input type="password"
                        id='password' 
                        value={state.password}
                        onChange={(e) => dispatch({ type: "password-entered", payload: e.target.value})}
                        />
                <button onClick={handleLogin}>
                    {state.hasAccount ? "Login" : "Sign Up"}
                </button>
            </div>
        </form>
        <h3>
            {state.hasAccount ? "Don't have an account?" : "Already have an account?"}
                <button onClick={() => dispatch({type: "has-account"})}>
                    {state.hasAccount ? "Sign Up" : "Login"}
                </button>
            `
        </h3>
    </div>
  )
}
