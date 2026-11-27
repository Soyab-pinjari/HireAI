import React from 'react'

function PopJobs() {
  const jobs = [
    'Software Developer',
    'Data Analyst',
    'UI/UX Designer',
    'Product Manager',
    'FullStack Developer',
    'Python Developer',
    'Cloud Engineer'
  ]

  return (
    <div className="mt-10">
      <div className="grid grid-cols-4 gap-3 items-center">
        <span className="font-semibold text-gray-700">
          Popular:
        </span>

        {jobs.map((job, index) => (
          <span
            key={index}
            className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold cursor-pointer hover:bg-indigo-200 transition text-center"
          >
            {job}
          </span>
        ))}
      </div>
    </div>
  )
}

export default PopJobs