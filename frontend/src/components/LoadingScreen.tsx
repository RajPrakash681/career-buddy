import React from 'react';
import { RocketLaunch } from 'phosphor-react';

const LoadingScreen = () => {
  return (
    <div className="global-loading-screen">
      <div className="loader-content">
        <RocketLaunch size={32} weight="bold" className="loader-icon" />
        <span className="loader-text">CB</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
