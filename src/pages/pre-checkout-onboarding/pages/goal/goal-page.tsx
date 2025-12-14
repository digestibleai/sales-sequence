import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { NavButton } from '@/components/nav-button/nav-button.tsx';
import image from '@/assets/goal.png';
import './goal-page.css';

interface GoalPageProps {
  goal: string;
  onClick: () => void;
}

const GoalPage = ({ goal, onClick }: GoalPageProps): React.ReactNode => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  return (
    <div className="goal-page-container">
      <div className="content-section">
        <p className="poppins-black goal-headline" style={{ color: 'rgb(1, 63, 50)' }}>
          Your Roadmap Updates Weekly
        </p>
        <span className="poppins-extrabold goal-subheading" style={{ color: 'rgb(1, 63, 50)' }}> Your Goal: </span>
        <p className="poppins-regular-italic goal-user-goal" style={{ color: 'rgb(1, 63, 50)' }}>
          {goal}
        </p>
        <p className="poppins-regular goal-body-text">
          We have your exact path. Updated every <b> week </b> with the latest tools.
        </p>
      </div>
      <div className="image-section">
        <img src={image} alt="Goal" />
      </div>
      <div className="button-section">
        <NavButton onClick={onClick} text={isMobile ? "Continue" : "Next: Take a Peek at Our Lessons →"} />
      </div>
    </div>
  );
};

export { GoalPage };
