import React, { useEffect } from 'react';

const BackgroundWaves = () => {
  useEffect(() => {
    const createCloud = () => {
      const cloud = document.createElement('div');
      cloud.className = 'cloud';
      cloud.style.top = `${Math.random() * 100}%`;
      cloud.style.animation = `cloudFloat ${20 + Math.random() * 30}s linear`;
      document.querySelector('.background-waves')?.appendChild(cloud);

      cloud.addEventListener('animationend', () => cloud.remove());
    };

    const interval = setInterval(createCloud, 10000);
    createCloud(); // Create initial cloud

    return () => clearInterval(interval);
  }, []);

  return <div className="background-waves" />;
};

export default BackgroundWaves;
