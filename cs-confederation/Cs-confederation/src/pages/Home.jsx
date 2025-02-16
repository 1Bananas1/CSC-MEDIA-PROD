// src/pages/Home.jsx
import React, { useState, useEffect } from 'react'
import Search from '../components/Search'
import { gql, useQuery } from '@apollo/client'
import FranchiseCards from '../components/FranchiseCards'

const GET_LATEST_SEASON = gql`
  query {
    latestActiveSeason {
      number
    }
  }
`;

const Home = () => {
  const [searchTerm, setSearchTerm] = useState(''); 
  const { data, loading, error } = useQuery(GET_LATEST_SEASON);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (error) {
      setErrorMessage(error.message);
    }
  }, [error]);

  return (
    <main>
      <div className='pattern' />
      
      <div className='wrapper'>
        <header>
          <img src="./defaultusericon.svg" alt="Default User Icon" height={44}/>
          <h1>CS Confederation {loading ? "Loading..." : data?.latestActiveSeason?.number ? `Season ${data.latestActiveSeason.number}` : "No Active Season"} </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        <section className="all-teams">
          <h2>All Teams</h2>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <FranchiseCards />
        </section>
      </div>
    </main>
  )
}

export default Home