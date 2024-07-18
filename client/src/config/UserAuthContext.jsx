import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase-config";


const userAuthContext = createContext()

export function useUserAuth() {
    return useContext(userAuthContext)
}

export function UserAuthContextProvider({ children }) {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            } else {
                setUser(null)
            }
        })
        return unsubscribe
    }, [])

    return (
        <userAuthContext.Provider value={{ user }}>
            {children}
        </userAuthContext.Provider>
    )

}