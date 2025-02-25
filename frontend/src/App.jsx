import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CaptainLogin from './pages/CaptainLogin'
import UserLogin from './pages/UserLogin'
import Start from './pages/Start'
import { Toaster } from 'react-hot-toast'
import UserHome from './pages/UserHome'
import CaptainHome from './pages/CaptainHome'

const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/userlogin' element={<UserLogin />} />
        <Route path='/userhome' element={<UserHome />} />
        <Route path='/captainlogin' element={<CaptainLogin />} />
        <Route path='/captainhome' element={<CaptainHome />} />
      </Routes>
    </div>
  )
}

export default App
