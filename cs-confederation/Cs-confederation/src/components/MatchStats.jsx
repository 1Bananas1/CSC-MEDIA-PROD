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
          steam64Id
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
          steam64Id
        }
      }
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

const GET_PLAYER_STATS = gql`
  query PlayerStats($season: Int, $steamId: String!) {
    playerSummary(season: $season, steamId: $steamId) {
      name
      adr
      utilDmg
      tRating
      rating
      kast
      impact
      gameCount
      ef
      ctRating
    }
  }
`;

const StatCell = ({ value, isPercentage = false }) => {
  if (value === undefined || value === null) return <td className="py-2">-</td>;
  
  const displayValue = isPercentage 
    ? `${(value * 100).toFixed(1)}%`
    : typeof value === 'number' 
      ? value.toFixed(2)
      : value;

  return <td className="py-2 px-4 text-center">{displayValue}</td>;
};

const PlayerStats = ({ steamId, season }) => {
  const { data, loading, error } = useQuery(GET_PLAYER_STATS, {
    variables: { 
      steamId,
      season
    },
    skip: !steamId || !season,
    context: {
      clientName: 'stats',  // Re-adding this to ensure we use the stats API
      headers: {
        'Authorization': `JWT ${localStorage.getItem('auth_token')}`
      }
    }
  });
  
  console.log('Player Stats Query:', { 
    steamId, 
    season, 
    data,
    loading,
    error: error ? error.message : null,
    token: localStorage.getItem('auth_token')
  });

  if (loading) return (
    <>
      {[...Array(8)].map((_, i) => (
        <td key={`loading-${i}`} className="py-2 px-4 text-center">...</td>
      ))}
    </>
  );
  
  if (error) return (
    <>
      {[...Array(8)].map((_, i) => (
        <td key={`error-${i}`} className="py-2 px-4 text-center text-red-500">!</td>
      ))}
    </>
  );

  const stats = data?.playerSummary || {};

  return (
    <>
      <StatCell value={stats.gameCount} index="games" />
      <StatCell value={stats.adr} index="adr" />
      <StatCell value={stats.rating} index="rating" />
      <StatCell value={stats.ctRating} index="ctRating" />
      <StatCell value={stats.tRating} index="tRating" />
      <StatCell value={stats.impact} index="impact" />
      <StatCell value={stats.kast} isPercentage={true} index="kast" />
      <StatCell value={stats.ef} isPercentage={false} index="ef" />
    </>
  );
};

const PlayerList = ({ players, season }) => {
  const relevantPlayers = players?.filter(player => 
    ["SIGNED", "PERMFA_TEMP_SIGNED", "FA_TEMP_SIGNED", "SIGNED_SUBBED"].includes(player.type)
  );

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-max">
        <thead>
          <tr className="text-gray-400 text-sm border-b border-gray-700">
            <th className="text-left py-2 px-4 w-64">Player</th>
            <th className="text-center py-2 px-4 w-24">Games</th>
            <th className="text-center py-2 px-4 w-24">ADR</th>
            <th className="text-center py-2 px-4 w-24">Rating</th>
            <th className="text-center py-2 px-4 w-24">CT Rating</th>
            <th className="text-center py-2 px-4 w-24">T Rating</th>
            <th className="text-center py-2 px-4 w-24">Impact</th>
            <th className="text-center py-2 px-4 w-24">KAST</th>
            <th className="text-center py-2 px-4 w-24">EF</th>
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
              <td className="py-2 px-2">
                <div className="flex items-center space-x-2">
                  {player.avatarUrl && (
                    <img 
                      src={player.avatarUrl} 
                      alt={`${player.name}'s avatar`}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span>{player.name}</span>
                </div>
              </td>
              <PlayerStats steamId={player.steam64Id} season={season} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MatchStats = ({ matchId }) => {
  // Get match details
  const { loading: matchLoading, error: matchError, data: matchData } = useQuery(GET_MATCH_DETAILS, {
    variables: { matchId },
    context: {
      headers: {
        'Authorization': `JWT ${localStorage.getItem('auth_token')}`
      }
    }
  });

  // Get current season
  const { data: seasonData, loading: seasonLoading, error: seasonError } = useQuery(GET_LATEST_SEASON, {
    context: {
      headers: {
        'Authorization': `JWT ${localStorage.getItem('auth_token')}`
      }
    }
  });

  console.log('Season Query:', {
    data: seasonData,
    loading: seasonLoading,
    error: seasonError ? seasonError.message : null,
    token: localStorage.getItem('auth_token')
  });

  if (matchLoading) {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <p className="text-xl text-gray-400">Loading match details...</p>
      </div>
    );
  }

  if (matchError) {
    console.error('Match stats error:', matchError);
    return (
      <div className="w-full p-4 bg-red-500/10 text-red-500 rounded">
        Error loading match details: {matchError.message}
      </div>
    );
  }

  const { match } = matchData;
  const currentSeason = seasonData?.latestActiveSeason?.number;

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
        <div className="grid grid-cols-1 gap-8">
          {/* Home Team Players */}
          <div>
            <h3 className="text-xl font-bold mb-4">Home Roster</h3>
            <PlayerList players={match.home.players} season={currentSeason} />
          </div>

          {/* Away Team Players */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Away Roster</h3>
            <PlayerList players={match.away.players} season={currentSeason} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchStats;