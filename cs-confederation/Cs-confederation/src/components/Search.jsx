import React from 'react'

const search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search" >
        <div>
            <img src="./search.svg" alt="Search Icon"/>

            <input
            type="text"
            placeholder='Search for a team...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    </div>
  )
}

export default search