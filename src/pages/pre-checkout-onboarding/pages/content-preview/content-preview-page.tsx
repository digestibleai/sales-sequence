import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { NavButton } from '@/components/nav-button/nav-button';
import '../../../../fonts.css';
import '../../index.css';
import image from '@/assets/content-preview.png';
import './content-preview-page.css';

interface ContentPreviewPageProps {
  onClick: () => void;
}

const ContentPreviewPage = ({ onClick }: ContentPreviewPageProps): React.ReactNode => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  return (
    <div className="content-preview-container">
      <div className="content-row">
        <p className="poppins-black content-preview-headline" style={{ color: 'rgb(1, 63, 50)' }}>
          Lessons That Actually Go Deep, Here's What You'll Master
        </p>
        <p className="poppins-regular content-preview-body-text">
          Not another surface-level AI overview. You will achieve your AI goal by learning
          specific tools, workflows, and prompts that work in real business situations.
          In your first 3 days,
          <b> you'll master things like prompting, research and automation with the latest, cutting-edge tools. </b>
        </p>
      </div>
      <div className="image-section">
        <img src={image} alt="Content Preview" />
      </div>
      <div className="button-section">
        <NavButton onClick={onClick} text={isMobile ? "Continue" : "Start Your AI Transformation! →"} />
      </div>
    </div>
  );
};

export { ContentPreviewPage };
