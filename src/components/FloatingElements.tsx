import React from 'react';

const FloatingElements = () => {
  return (
    <div className="floating-elements">
      <div className="floating-circle" style={{ left: '10%', top: '20%' }}></div>
      <div className="floating-square" style={{ right: '15%', top: '60%' }}></div>
      <div className="floating-triangle" style={{ left: '20%', top: '70%' }}></div>
      <div className="floating-dot" style={{ right: '25%', top: '30%' }}></div>
      <div className="floating-ring" style={{ left: '30%', top: '40%' }}></div>
      <div className="floating-plus" style={{ right: '35%', top: '50%' }}></div>
      <div className="floating-cross" style={{ left: '40%', top: '25%' }}></div>
      <div className="floating-hexagon" style={{ right: '20%', top: '80%' }}></div>
      <div className="floating-blur-circle" style={{ left: '25%', top: '15%' }}></div>
      <div className="floating-line" style={{ right: '30%', top: '45%' }}></div>
      
      {/* Add glowing dots */}
      <div className="glow-dot" style={{ left: '50%', top: '20%' }}></div>
      <div className="glow-dot" style={{ right: '40%', top: '60%' }}></div>
      <div className="glow-dot" style={{ left: '30%', top: '80%' }}></div>
      
      {/* Add animated gradient circles */}
      <div className="gradient-circle" style={{ left: '60%', top: '30%' }}></div>
      <div className="gradient-circle" style={{ right: '50%', top: '70%' }}></div>
    </div>
  );
};

export default FloatingElements;
