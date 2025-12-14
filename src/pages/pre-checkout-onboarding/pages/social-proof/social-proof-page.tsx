import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { NavButton } from '@/components/nav-button/nav-button.tsx';
import '../../../../fonts.css';
import '../../../../index.css';
import image from '@/assets/social-proof.png';
import './social-proof-page.css';

interface SocialProofPageProps {
  onClick: () => void;
}

const SocialProofPage = ({ onClick }: SocialProofPageProps): React.ReactNode => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  return (
    <div className="social-proof-container">
      <div className="social-proof-content-row">
        <div className="image-section">
          <img src={image} alt="Social Proof" />
        </div>
        <div className="headline-section">
          <div className="headline">
            <p className="poppins-black social-proof-headline">
              6,000+ People Already Started
            </p>
            <p className="poppins-regular social-proof-body-text">
              They all did one thing first: Wrote down their AI goal. <br />
              Google execs. Startup founders. High school teachers.
            </p>

            <p className="poppins-regular-italic social-proof-body-text">
              What's yours?
            </p>
          </div>
        </div>
      </div>
      <div className="button-section">
        <NavButton onClick={onClick} text={isMobile ? "Continue" : "Next: Decide Your AI Goal →"} />
      </div>
    </div>
  );
};

export { SocialProofPage };
