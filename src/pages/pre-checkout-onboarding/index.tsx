import React from 'react';
import { useState } from 'react';
import { ProblemAgitationPage } from './pages/problem-agitation/problem-agitation-page'
import { Flashcards } from './pages/flashcards/flashcards';
import { ValuePropPage } from './pages/value-prop/value-prop-page';
import { GamifiedLesson } from './pages/gamified-lesson/gamified-lesson';
import '../../fonts.css'
import './index.css'
import { ImagePreloader } from '@/components/ImagePreloader/ImagePreloader.tsx';

// Import all images for preloading
import problemAgitationImage from '@/assets/problem-agitation.png';
import ourStoryImage from '@/assets/digestibly_times_sq.jpeg';
import socialProofImage from '@/assets/social-proof.png';
import contentPreviewImage from '@/assets/content-preview.png';
import goalImage from '@/assets/goal.png';
import arrowImage from '@/assets/arrow.png';

// All images used in the app
const allImages = [
  problemAgitationImage,
  ourStoryImage,
  socialProofImage,
  contentPreviewImage,
  goalImage,
  arrowImage,
];

const PreCheckoutOnboarding = (): React.ReactNode => {
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [displayPage, setDisplayPage] = useState<string>('problem-agitation');

  const handlePageChange = (newPage: string) => {
    if (newPage === displayPage) return;

    setIsTransitioning(true);
    // Scroll to top immediately when page change starts
    window.scrollTo(0, 0);

    setTimeout(() => {
      setDisplayPage(newPage);
      setIsTransitioning(false);
    }, 500);
  };

  const renderPage = () => {
    switch (displayPage) {
      case 'problem-agitation':
        return <ProblemAgitationPage onClick={() => { handlePageChange('flashcards') }} />;
      case 'flashcards':
        return <Flashcards onNext={() => { handlePageChange('gamified-lesson') }} />;
      case 'gamified-lesson':
        return <GamifiedLesson onComplete={() => { handlePageChange('value-prop') }} />;
      case 'value-prop':
        return <ValuePropPage />;
      default:
        return <></>;
    }
  }

  return (
    <ImagePreloader
      imageUrls={allImages}
      showProgress={true}
      fallback={
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          color: '#013f32',
          fontFamily: 'Poppins, sans-serif',
        }}>
          <div style={{ fontSize: '24px', marginBottom: '1rem' }}>
            Loading Digestibly...
          </div>
          <div style={{ fontSize: '16px', opacity: 0.7 }}>
            Preparing your AI learning experience
          </div>
        </div>
      }
    >
      <div className={`page-container ${isTransitioning ? 'transitioning' : ''}`}>
        {renderPage()}
      </div>
    </ImagePreloader>
  )
}

export { PreCheckoutOnboarding };
