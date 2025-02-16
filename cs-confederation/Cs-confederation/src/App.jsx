import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Search from './components/Search.jsx'
import Navbar from './components/Navbar'
import { gql, useQuery } from '@apollo/client'
import FranchiseCards from './components/FranchiseCards'
import Matches from './pages/Matches'

const GET_LATEST_SEASON = gql`
  query {
    latestActiveSeason {
      number
    }
  }
`;

const App = () => {
  const [searchTerm, setSearchTerm] = useState(''); 
  const { data, loading, error } = useQuery(GET_LATEST_SEASON);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (error) {
      setErrorMessage(error.message);
    }
  }, [error]);

  return (
    <Router>
      <Navbar />
      <main>
        <div className='pattern' />
        
        <Routes>
          <Route path="/" element={
            <div className='wrapper'>
              <header className='header'>
                <img src="./defaultusericon.svg" alt="Default User Icon" height={44}/>
                <h1>CS Confederation {loading ? "Loading..." : data?.latestActiveSeason?.number ? `Season ${data.latestActiveSeason.number}` : "No Active Season"} </h1>
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
              </header>

              <section className="all-teams">
                <h2>All Franchises</h2>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <FranchiseCards />
              </section>
            </div>
          } />
          <Route path="/matches" element={<Matches />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App