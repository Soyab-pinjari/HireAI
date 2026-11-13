import React from 'react'
import Navbar from '../../component/comman/Navbar'
import Search from '../../component/comman/Search'
import PopJobs from '../../component/comman/PopJobs'
import Footer from '../../component/comman/Footer'



function Home() {
  return (
    <div>
      {/* <Navbar /> */}

      <div className="min-h-[calc(100vh-70px)] flex items-center justify-center">
        <div className="w-full p-10 flex flex-col justify-center items-center text-center">
          <h1 className="font-bold mb-5">
            Find Your Dream Job With <br />
          <span className='text-blue-700'>
            The Power of AI
            </span>  
          </h1>

          <p className="mt-4 ">
            An Intelligent job portal that helps you find the right job,
            <br />
            analyze your resume, and get personalized job recommendations.
          </p>

        <Search/>
       <PopJobs/>
       {/* <Footer/> */}
        </div>
      </div>
    </div>
  )
}

export default Home