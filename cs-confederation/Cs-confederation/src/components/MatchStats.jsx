import React from 'react';
import { gql, useQuery } from '@apollo/client';

const GET_MATCH_DETAILS = gql`
  query GetMatchDetails($matchId: String!) {
    match(matchId: $matchId) {
      id
      scheduledDate
      home {
        id
        name
        franchise {
          name
          logo {
            url
          }
        }
        players {
          id
          name
          type
          avatarUrl
          tier {
            name
          }
        }
      }
      away {
        id
        name
        franchise {
          name
          logo {
            url
          }
        }
        players {
          id
          name
          type
          avatarUrl
          tier {
            name
          }
        }
      }
    }
  }
`;


const PlayerList = ({ players }) => {
  // Filter for relevant player types
  const relevantPlayers = players?.filter(player => 
    ["SIGNED", "PERMFA_TEMP_SIGNED", "FA_TEMP_SIGNED", "SIGNED_SUBBED"].includes(player.type)
  );

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr className="text-gray-400 text-sm border-b border-gray-700">
            <th className="text-left py-2">Player</th>
            <th className="text-left py-2">Tier</th>
          </tr>
        </thead>
        <tbody>
          {relevantPlayers?.map((player) => (
            <tr 
              key={player.id}
              className={`border-b border-gray-700 ${
                player.type === "SIGNED_SUBBED" ? "text-gray-500" : "text-white"
              }`}
            >
              <td className="py-2 flex items-center space-x-2">
                {player.avatarUrl && (
                  <img 
                    src={player.avatarUrl} 
                    alt={`${player.name}'s avatar`}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span>{player.name}</span>
              </td>
              <td className="py-2">{player.tier?.name || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MatchStats = ({ matchId }) => {
  
  const { loading, error, data } = useQuery(GET_MATCH_DETAILS, {
    variables: { matchId },
    context: {
      headers: {
        'Authorization': `JWT ${localStorage.getItem('auth_token')}`
      }
    }
  });

  if (loading) return (
    <div className="w-full h-32 flex items-center justify-center">
      <p className="text-xl text-gray-400">Loading match details...</p>
    </div>
  );

  if (error) {
    console.error('Match stats error:', error);
    return (
      <div className="w-full p-4 bg-red-500/10 text-red-500 rounded">
        Error loading match details: {error.message}
      </div>
    );
  }

  const { match } = data;

  return (
    <div className="w-full bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Team Headers */}
        <div className="flex items-center justify-between mb-8">
          {/* Home Team */}
          <div className="flex items-center space-x-4">
            <img 
              src={`https://core.csconfederation.com${match.home.franchise.logo.url}`}
              alt={`${match.home.franchise.name} logo`}
              className="w-16 h-16 object-contain"
            />
            <h2 className="text-2xl font-bold">{match.home.name}</h2>
          </div>

          <div className="text-2xl font-bold text-gray-400">VS</div>

          {/* Away Team */}
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold">{match.away.name}</h2>
            <img 
              src={`https://core.csconfederation.com${match.away.franchise.logo.url}`}
              alt={`${match.away.franchise.name} logo`}
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>

        {/* Player Lists */}
        <div className="grid grid-cols-2 gap-8">
          {/* Home Team Players */}
          <div>
            <h3 className="text-xl font-bold mb-4">Home Roster</h3>
            <PlayerList players={match.home.players} />
          </div>

          {/* Away Team Players */}
          <div>
            <h3 className="text-xl font-bold mb-4">Away Roster</h3>
            <PlayerList players={match.away.players} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchStats;