import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const UserContext = createContext()

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState('')

    const navigate = useNavigate()

    const value = {
        user, setUser,
        token, setToken,
        navigate
    }
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider
