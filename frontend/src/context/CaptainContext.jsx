import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const CaptainContext = createContext()

const CaptainContextProvider = ({ children }) => {
    const [captain, setCaptain] = useState(null)
    const [token, setToken] = useState('')

    const navigate = useNavigate()

    const value = {
        captain, setCaptain,
        token, setToken,
        navigate
    }
    return (
        <CaptainContext.Provider value={value}>
            {children}
        </CaptainContext.Provider>
    )
}

export default CaptainContextProvider
