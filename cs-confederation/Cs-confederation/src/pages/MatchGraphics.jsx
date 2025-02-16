import React from 'react';
import { useParams } from 'react-router-dom';

const MatchGraphics = () => {
  const { matchId } = useParams();

  // Remove any default margins/padding from body
  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.background = 'transparent';
    
    // Cleanup function to restore original styles
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.background = '';
    };
  }, []);

  return (
    <main style={{
      background: 'transparent',
      margin: 0,
      padding: 0,
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      pointerEvents: 'none' // Allows clicking through when no graphics are displayed
    }}>
      {/* Graphics will be rendered here */}
    </main>
  );
};

export default MatchGraphics;