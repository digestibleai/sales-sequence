import React from 'react';
import { useMediaQuery } from 'react-responsive';
import CheckIcon from '@mui/icons-material/Check';
import { NavButton } from '@/components/nav-button/nav-button.tsx';
import '../../../../fonts.css';
import './value-prop-page.css';

const ListBulletIcon = () => {
  return (
    <CheckIcon style={{ color: 'white', marginRight: '8px', fontSize: '20px' }} />
  )
}

const ValuePropPage = (): React.ReactNode => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  return (
    <div className="value-prop-page-container">
      <span className="poppins-black value-prop-headline">Start Your AI Transformation Today</span>
      <div className="containers-wrapper">
        <div className="value-prop-container">
          <p className="poppins-extrabold price-text">Free Trial</p>
          <ul className="features-list">
            <li className="feature-item">
              <ListBulletIcon />
              <span className="poppins-regular"><b>100+ AI lessons</b> covering fundamentals, agents, LLMs, prompts & automations</span>
            </li>
            <li className="feature-item">
              <ListBulletIcon />
              <span className="poppins-regular"><b>Weekly content updates</b>to keep all lessons current with AI changes</span>
            </li>
            <li className="feature-item">
              <ListBulletIcon />
              <span className="poppins-regular"><b>New lessons every month</b> (20+) on emerging AI topics</span>
            </li>
            <li className="feature-item">
              <ListBulletIcon />
              <span className="poppins-regular"><b>Cancel anytime</b> - no long-term contracts</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="button-section">
        <NavButton
          href="https://www.digestibly.ai/offers/rXwTSUjT/checkout"
          text={isMobile ? "Start Free Trial!" : "Start my Free Trial! →"}
        />
      </div>
    </div>
  );
};

export { ValuePropPage };
