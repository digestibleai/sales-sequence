import { useState, useEffect } from 'react';

interface ImagePreloaderState {
  isLoading: boolean;
  loadedImages: Set<string>;
  failedImages: Set<string>;
  progress: number;
}

export const useImagePreloader = (imageUrls: string[]) => {
  const [state, setState] = useState<ImagePreloaderState>({
    isLoading: true,
    loadedImages: new Set(),
    failedImages: new Set(),
    progress: 0,
  });

  useEffect(() => {
    if (imageUrls.length === 0) {
      setState(prev => ({ ...prev, isLoading: false, progress: 100 }));
      return;
    }

    let loadedCount = 0;
    const loadedImages = new Set<string>();
    const failedImages = new Set<string>();

    const loadImage = (url: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => {
          loadedImages.add(url);
          loadedCount++;
          const progress = (loadedCount / imageUrls.length) * 100;

          setState(prev => ({
            ...prev,
            loadedImages: new Set(loadedImages),
            progress,
            isLoading: loadedCount < imageUrls.length,
          }));

          resolve();
        };

        img.onerror = () => {
          failedImages.add(url);
          loadedCount++;
          const progress = (loadedCount / imageUrls.length) * 100;

          setState(prev => ({
            ...prev,
            failedImages: new Set(failedImages),
            progress,
            isLoading: loadedCount < imageUrls.length,
          }));

          resolve(); // Still resolve to continue loading other images
        };

        img.src = url;
      });
    };

    // Load all images in parallel
    Promise.all(imageUrls.map(loadImage)).then(() => {
      setState(prev => ({ ...prev, isLoading: false }));
    });
  }, [imageUrls]);

  return state;
};
