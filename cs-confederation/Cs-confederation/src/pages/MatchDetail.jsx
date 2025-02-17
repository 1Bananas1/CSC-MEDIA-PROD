import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MatchStats from '../components/MatchStats';

const MatchDetail = () => {
  const { matchId } = useParams();
  const [activeTab, setActiveTab] = useState('HEAD TO HEAD');

  const tabs = [
    'HEAD TO HEAD',
    'HOME STATS',
    'AWAY STATS',
    'PLAY BY PLAY',
    'NOTES'
  ];

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Match Header Section */}
      <div className="w-full bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold">Match Details</h2>
            </div>
            <div className="text-xl font-bold">
              {/* Score would go here */}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="w-full bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium transition-colors duration-150 ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
            
            {/* Divider */}
            <div className="border-l border-gray-700 mx-2"></div>
            
            {/* Producer and Graphics links */}
            <Link
              to={`/matches/${matchId}/producer`}
              className="px-4 py-2 font-medium text-gray-300 hover:bg-gray-700 transition-colors duration-150"
            >
              GRAPHICS MANAGER
            </Link>
            <Link
              to={`/matches/${matchId}/graphics`}
              className="px-4 py-2 font-medium text-gray-300 hover:bg-gray-700 transition-colors duration-150"
            >
              GRAPHICS DISPLAYED
            </Link>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'HEAD TO HEAD' && (
          <div>
            <MatchStats matchId={matchId} />
            {/* Future stats tables will go here */}
          </div>
        )}
        {activeTab === 'HOME STATS' && (
          <div>Home Stats Content</div>
        )}
        {activeTab === 'AWAY STATS' && (
          <div>Away Stats Content</div>
        )}
        {activeTab === 'PLAY BY PLAY' && (
          <div>Play by Play Content</div>
        )}
        {activeTab === 'NOTES' && (
          <div>Notes Content</div>
        )}
      </div>
    </main>
  );
};

export default MatchDetail;