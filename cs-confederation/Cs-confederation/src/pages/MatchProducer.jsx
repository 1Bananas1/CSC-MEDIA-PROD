import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MatchProducer = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('GRAPHICS MANAGER');

  const tabs = [
    'GRAPHICS MANAGER',
    'GRAPHICS DISPLAYED'
  ];

  const handleTabClick = (tab) => {
    if (tab === 'GRAPHICS DISPLAYED') {
      // Open in a new window/tab
      window.open(`/matches/${matchId}/graphics`, '_blank');
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Match Header Section */}
      <div className="w-full bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold">Match Producer Controls</h2>
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
                onClick={() => handleTabClick(tab)}
                className={`px-4 py-2 font-medium transition-colors duration-150 ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'GRAPHICS MANAGER' && (
          <div>Graphics Manager Content</div>
        )}
      </div>
    </main>
  );
};

export default MatchProducer;