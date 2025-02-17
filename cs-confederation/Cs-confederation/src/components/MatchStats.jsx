import React from 'react';
import { gql, useQuery } from '@apollo/client';

const GET_MATCH_DETAILS = gql`
  query GetMatchDetails($matchId: String!) {
    match(matchId: $matchId) {
      id
      scheduledDate
      home {
        name
        franchise {
          name
          logo {
            url
          }
        }
      }
      away {
        name
        franchise {
          name
          logo {
            url
          }
        }
      }
    }
  }
`;

const MatchStats = ({ matchId }) => {
  const { loading, error, data } = useQuery(GET_MATCH_DETAILS, {
    variables: { matchId }
  });

  if (loading) return (
    <div className="w-full h-32 flex items-center justify-center">
      <p className="text-xl text-gray-400">Loading match details...</p>
    </div>
  );

  if (error) return (
    <div className="w-full p-4 bg-red-500/10 text-red-500 rounded">
      Error loading match details: {error.message}
    </div>
  );

  const { match } = data;

  return (
    <div className="w-full bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Home Team */}
          <div className="flex items-center space-x-4">
            <img 
              src={`https://core.csconfederation.com${match.home.franchise.logo.url}`}
              alt={`${match.home.franchise.name} logo`}
              className="w-16 h-16 object-contain"
            />
            <div>
              <h2 className="text-2xl font-bold">{match.home.name}</h2>
            </div>
          </div>

          {/* VS */}
          <div className="text-2xl font-bold text-gray-400">VS</div>

          {/* Away Team */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <h2 className="text-2xl font-bold">{match.away.name}</h2>
            </div>
            <img 
              src={`https://core.csconfederation.com${match.away.franchise.logo.url}`}
              alt={`${match.away.franchise.name} logo`}
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchStats;