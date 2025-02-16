import React from 'react';
import { useParams } from 'react-router-dom';

const MatchDetail = () => {
  const { matchId } = useParams();

  return (
    <main className="min-h-screen bg-gray-900 text-white pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Match Details</h1>
        <div className="bg-gray-800 rounded-lg p-6">
          <p>Match ID: {matchId}</p>
        </div>
      </div>
    </main>
  );
};

export default MatchDetail;