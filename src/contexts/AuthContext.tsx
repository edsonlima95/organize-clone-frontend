import { createContext, useState } from "react";


type AuthContextProps = {
    profile: Profile,
    setProfile: (profile: Profile) => void
}

type AuthProviderProps = {
    children: React.ReactNode
}

type Profile = {
    id: number,
    name: string,
    email: string,
    cover?: string
}

export const AuthContext = createContext({} as AuthContextProps)



export function AuthProvider({ children}: AuthProviderProps){

    const [profile, setProfile] = useState({} as Profile)
   
    return (
        <AuthContext.Provider value={{profile, setProfile}}>
            {children}
        </AuthContext.Provider>
    )
}