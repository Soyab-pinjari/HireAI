import React from 'react'
import Home from './pages/public/Home'
import AllJobs from './pages/public/AllJobs'
import Footer from './component/comman/Footer'
import Navbar from './component/comman/Navbar'

function Layout() {
  return (
    <div>
        <Navbar/>
      <Home/>
      <AllJobs/>
      <Footer/>
    </div>
  )
}

export default Layout
