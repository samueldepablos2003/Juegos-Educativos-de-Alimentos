import React, { memo, useEffect, useState } from 'react';
import {
  getCachedProcessedAsset,
  loadAndProcessAsset,
  ProcessedAsset,
} from '../utils/imagePreloader';

interface ProcessedFoodImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ProcessedFoodImage: React.FC<ProcessedFoodImageProps> = memo(
  ({ src, alt, className = 'w-16 h-16', style }) => {
    const [asset, setAsset] = useState<ProcessedAsset | null>(
      () => getCachedProcessedAsset(src) ?? null
    );
    const [fallbackToRaw, setFallbackToRaw] = useState<boolean>(false);

    useEffect(() => {
      setFallbackToRaw(false);
      const cached = getCachedProcessedAsset(src);
      if (cached) {
        setAsset(cached);
        return;
      }

      setAsset(null);
      let cancelled = false;
      loadAndProcessAsset(src).then((result) => {
        if (!cancelled) {
          setAsset(result);
        }
      });

      return () => {
        cancelled = true;
      };
    }, [src]);

    const resolvedSrc = fallbackToRaw ? src : asset ? asset.url : src;
    const isVisible = fallbackToRaw || asset !== null;

    return (
      <img
        src={resolvedSrc}
        alt={alt}
        decoding="async"
        draggable={false}
        style={style}
        onError={() => {
          if (!fallbackToRaw && asset && asset.url !== src) {
            setFallbackToRaw(true);
          }
        }}
        className={`${className} crisp-raster-art object-contain select-none pointer-events-none ${
          isVisible ? 'opacity-100' : 'opacity-0 transition-opacity duration-120'
        }`}
      />
    );
  }
);

ProcessedFoodImage.displayName = 'ProcessedFoodImage';
