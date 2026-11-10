
import React from 'react'
import { Search as SearchIcon } from 'lucide-react'

function Search() {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6 sm:mt-8 px-4 sm:px-0">

      <div className="relative w-full">

        {/* Search Icon */}
        <SearchIcon
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
        />

        {/* Input */}
        <input
          type="search"
          placeholder="Search jobs, skills and companies..."
          className="w-full border-2 border-blue-600 rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pl-11 sm:pl-12 pr-24 sm:pr-32 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-200 transition-all"
        />

        {/* Search Button */}
        <button className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 my-button flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 text-xs sm:text-sm">
          <SearchIcon size={16} className="sm:hidden" />
          Search
        </button>

      </div>

    </div>
  )
}

export default Search
