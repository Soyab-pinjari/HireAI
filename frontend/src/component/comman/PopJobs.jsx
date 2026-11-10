import React from 'react'

function  PopJobs() {
    const jobs=[
        'Software Developer',
    'Data Analyst',
    'UI/UX Designer',
    'Product Manager'
    ]
  return (
  <div className="flex flex-wrap items-center gap-3 mt-10 ">
      <span className="font-semibold text-gray-700">
        Popular:
      </span>

      {jobs.map((job, index) => (
        <span
          key={index}
          className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold cursor-pointer hover:bg-indigo-200 transition"
        >
          {job}
        </span>
      ))}
    </div>
  )
}

export default PopJobs
