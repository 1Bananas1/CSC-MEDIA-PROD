import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

const GET_TIERS = gql`
  query GetRanks {
    tiers {
      name
      color
    }
  }
`;

const GET_LATEST_SEASON = gql`
  query {
    latestActiveSeason {
      number
    }
  }
`;

const GET_MATCHES = gql`
  query Query($season: Int!, $afterToday: Boolean, $tier: String) {
    matches(season: $season, afterToday: $afterToday, tier: $tier) {
      scheduledDate
      home {
        franchise {
          name
          logo {
            url
          }
        }
        name
      }
      away {
        franchise {
          name
          logo {
            url
          }
        }
        name
      }
      matchDay {
        number
      }
      id
    }
  }
`;

const MatchesPage = () => {
  const [selectedTier, setSelectedTier] = useState(null);
  
  // Get latest season
  const { data: seasonData } = useQuery(GET_LATEST_SEASON);
  
  // Get tiers
  const { data: tiersData } = useQuery(GET_TIERS);
  
  // Get matches
  const { loading: matchesLoading, error: matchesError, data: matchesData } = useQuery(GET_MATCHES, {
    variables: {
      season: seasonData?.latestActiveSeason?.number || 1,
      afterToday: true,
      tier: selectedTier
    }
  });

  const handleTierSelect = (tierName) => {
    // If clicking the currently selected tier, deselect it
    setSelectedTier(prevTier => prevTier === tierName ? null : tierName);
  };

  // Filter out Unrated tier and sort matches by date
  const displayTiers = tiersData?.tiers?.filter(tier => tier.name !== "Unrated") || [];
  const sortedMatches = [...(matchesData?.matches || [])].sort((a, b) => 
    new Date(a.scheduledDate) - new Date(b.scheduledDate)
  );

  return (
    <main className="min-h-screen bg-gray-900 text-white pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Matches</h1>
        
        {/* Tier Selection */}
        <div className="flex justify-center gap-4 flex-wrap mb-8">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setSelectedTier(null)}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedTier(null)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
              selectedTier === null 
                ? 'bg-gray-200 text-gray-800' 
                : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
            }`}
          >
            All Matches
          </div>

          {displayTiers.map((tier) => (
            <div
              key={tier.name}
              role="button"
              tabIndex={0}
              onClick={() => handleTierSelect(tier.name)}
              onKeyDown={(e) => e.key === 'Enter' && handleTierSelect(tier.name)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
                selectedTier === tier.name
                  ? 'text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
              style={{
                backgroundColor: selectedTier === tier.name 
                  ? tier.color 
                  : '#1f2937', // Darker gray background when not selected
                border: `1px solid ${selectedTier === tier.name ? tier.color : '#4b5563'}`
              }}
            >
              {tier.name}
            </div>
          ))}
        </div>

        {/* Match Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMatches.map((match) => (
            <div 
              key={match.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              onClick={() => window.location.href = `/matches/${match.id}`}
            >
              {/* Header */}
              <div className="bg-gray-700 p-4">
                <h3 className="text-white text-center font-bold text-lg">
                  {selectedTier && `${selectedTier} • `}
                  <span className="text-blue-300">{match.home.name}</span> vs <span className="text-red-300">{match.away.name}</span>
                  {match.matchDay?.number && ` • MD${match.matchDay.number}`}
                </h3>
              </div>

              {/* Logos */}
              <div className="flex-1 flex min-h-[200px] bg-gray-800">
                <div className="w-1/2 p-6 bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center border-r border-gray-700">
                  <div className="w-32 h-32 flex items-center justify-center">
                    <img 
                      src={`https://core.csconfederation.com${match.home.franchise.logo?.url}`}
                      alt={`${match.home.franchise.name} logo`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
                
                <div className="w-1/2 p-6 bg-gradient-to-l from-gray-800 to-gray-700 flex items-center justify-center">
                  <div className="w-32 h-32 flex items-center justify-center">
                    <img 
                      src={`https://core.csconfederation.com${match.away.franchise.logo?.url}`}
                      alt={`${match.away.franchise.name} logo`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-700 p-4 text-center text-gray-300">
                {new Date(match.scheduledDate).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default MatchesPage;