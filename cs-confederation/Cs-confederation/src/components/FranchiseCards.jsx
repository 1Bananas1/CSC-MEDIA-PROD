import React from 'react';
import { gql, useQuery } from '@apollo/client';

const GET_FRANCHISES = gql`
  query Logo($active: Boolean) {
    franchises(active: $active) {
      logo {
        path
        url
      }
      name
      prefix
    }
  }
`;

// Add the base URL for the images
const IMAGE_BASE_URL = 'https://core.csconfederation.com';

const FranchiseCards = () => {
  const { data, loading, error } = useQuery(GET_FRANCHISES, {
    variables: { active: true }
  });

  // Helper function to construct full image URL
  const getFullImageUrl = (relativeUrl) => {
    if (!relativeUrl) return '';
    return `${IMAGE_BASE_URL}${relativeUrl}`;
  };

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse h-48"/>
      ))}
    </div>
  );

  if (error) return (
    <div className="text-red-500 p-4">
      Error loading franchises: {error.message}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {data?.franchises.map((franchise) => (
        <div 
          key={franchise.prefix}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="p-4 flex flex-col items-center">
            <img
              src={getFullImageUrl(franchise.logo.url)}
              alt={`${franchise.name} logo`}
              className="w-32 h-32 object-contain mb-4"
            />
            <div className="text-center">
              <h3 className="text-xl font-bold mb-1">{franchise.name}</h3>
              <p className="text-gray-600">{franchise.prefix}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FranchiseCards;