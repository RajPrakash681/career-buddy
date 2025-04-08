import React from 'react';
import { RocketLaunch } from 'phosphor-react';

interface CallToActionProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonClick: () => void;
}

const CallToAction: React.FC<CallToActionProps> = ({
  title,
  subtitle,
  buttonText,
  onButtonClick
}) => {
  return (
    <section className="cta-section">
      <div className="cta-content">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <button 
          onClick={onButtonClick} 
          className="cta-button"
          aria-label="Get Started"
        >
          {buttonText}
          <RocketLaunch weight="duotone" />
        </button>
      </div>
    </section>
  );
};

export default CallToAction;
