import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { NavButton } from '@/components/nav-button/nav-button.tsx';
import image from '@/assets/problem-agitation.png';
import '../../../../fonts.css';
import '../../index.css';
import './problem-agitation-page.css';

interface ProblemAgitationPageProps {
  onClick: () => void;
}

const ProblemAgitationPage = ({ onClick }: ProblemAgitationPageProps): React.ReactNode => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="problem-agitation-container">
      <div className="problem-agitation-content-row">
        <div className="headline-section">
          <p className="poppins-black problem-agitation-headline" style={{ color: 'rgb(1, 63, 50)' }}>
            Your Coworkers Are Using AI.
            You're Not.
          </p>
          <p className="poppins-regular problem-agitation-body-text">
            Kevin built AI at AWS. Reyhan built AI for Fortune 500 companies.
          </p>
          <p className="poppins-regular problem-agitation-body-text">
            They saw the same thing everywhere: Smart people getting left behind
          </p>
          <p className="poppins-regular problem-agitation-body-text">
            Why? AI was creating a knowledge divide
          </p>
        </div>
        <div className="image-section">
          <img src={image} alt="Problem Agitation" className="problem-agitation-image" />
        </div>
      </div>
      <div className="button-section">
        <NavButton onClick={onClick} text={isMobile ? "Continue" : "Get Started →"} />
      </div>
    </div>
  );
};

export { ProblemAgitationPage };
