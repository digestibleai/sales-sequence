import React from 'react';
import { useMediaQuery } from 'react-responsive';
import image from '@/assets/digestibly_times_sq.jpeg';
import './our-story-page.css';
import { NavButton } from '@/components/nav-button/nav-button.tsx';

interface OurStoryPageProps {
  onClick: () => void;
}

const OurStoryPage = ({ onClick }: OurStoryPageProps): React.ReactNode => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  return (
    <div className="our-story-container">
      <div className="story-headline-section">
        <span className="poppins-black our-story-headline" style={{ color: 'rgb(1, 63, 50)' }}>
          We Built Simple, but Powerful AI Education
        </span>
      </div>
      <div className="poppins-regular content-section">
        <p className="our-story-body-text">
          We launched at $29/month.
          Teachers and small business owners couldn't afford it.
        </p>
        <p className="our-story-body-text">
          So we dropped to <b> $5.99/month</b>. Less than Netflix. Less than coffee.
        </p>
      </div>
      <div className="story-image-section">
        <img src={image} alt="Our Story" />
      </div>
      <div className="button-section">
        <NavButton onClick={onClick} text={isMobile ? "Continue" : "Next: See What They Built →"} />
      </div>
    </div >
  );
};

export { OurStoryPage };
