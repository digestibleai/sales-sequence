import React from 'react';
import { useImagePreloader } from '@/hooks/use-image-preloader';

interface ImagePreloaderProps {
  imageUrls: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showProgress?: boolean;
}

const ImagePreloader: React.FC<ImagePreloaderProps> = ({
  imageUrls,
  children,
  fallback,
  showProgress = false,
}) => {
  const { isLoading, progress } = useImagePreloader(imageUrls);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        padding: '2rem',
      }}>
        {showProgress && (
          <div style={{
            width: '200px',
            height: '4px',
            backgroundColor: '#e0e0e0',
            borderRadius: '2px',
            marginBottom: '1rem',
            overflow: 'hidden',
          }}>
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#013f32',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        )}
        {fallback || (
          <div style={{
            color: '#013f32',
            fontSize: '16px',
            fontFamily: 'Poppins, sans-serif',
          }}>
            Loading...
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

export { ImagePreloader };
