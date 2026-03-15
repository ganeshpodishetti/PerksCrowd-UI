'use client';

import { cn } from '@/lib/utils';
import NextImage from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';

interface StoreLogoAvatarProps {
  name?: string;
  fallbackName?: string;
  logoUrl?: string;
  fitMode?: 'fill' | 'fit';
  className?: string;
  imageClassName?: string;
  initialClassName?: string;
  testIdPrefix?: string;
}

const looksLikePlaceholderLogo = (url?: string): boolean => {
  if (!url) return true;
  const normalized = url.toLowerCase();
  return (
    normalized.includes('no-image') ||
    normalized.includes('noimage') ||
    normalized.includes('placeholder') ||
    normalized.includes('not-found') ||
    normalized.includes('notfound') ||
    normalized.includes('missing') ||
    normalized.includes('default.png') ||
    normalized.includes('default-image') ||
    normalized.includes('image-not-found')
  );
};

const getInitial = (name?: string, fallbackName?: string): string => {
  const candidate = name?.trim() || fallbackName?.trim() || '?';
  return candidate.charAt(0).toUpperCase();
};

const StoreLogoAvatar: React.FC<StoreLogoAvatarProps> = ({
  name,
  fallbackName,
  logoUrl,
  fitMode = 'fill',
  className,
  imageClassName,
  initialClassName,
  testIdPrefix,
}) => {
  const [imageError, setImageError] = useState(false);
  const initial = useMemo(() => getInitial(name, fallbackName), [name, fallbackName]);

  useEffect(() => {
    setImageError(false);
  }, [logoUrl]);

  const showImage = Boolean(logoUrl && !imageError && !looksLikePlaceholderLogo(logoUrl));
  const imageFitClass = fitMode === 'fit' ? 'object-contain' : 'object-cover';

  return (
    <div
      className={cn(
        'relative aspect-square w-10 h-10 sm:w-11 sm:h-11 overflow-hidden rounded-xl bg-neutral-50 dark:bg-neutral-900 flex-shrink-0',
        className,
      )}
    >
      {showImage ? (
        <NextImage
          src={logoUrl as string}
          alt={`${name || fallbackName || 'Store'} logo`}
          fill
          sizes="64px"
          className={cn('w-full h-full', imageFitClass, imageClassName)}
          onError={() => setImageError(true)}
          unoptimized
          data-testid={testIdPrefix ? `${testIdPrefix}-image` : undefined}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800"
          data-testid={testIdPrefix ? `${testIdPrefix}-fallback` : undefined}
        >
          <span
            className={cn('text-sm sm:text-base font-semibold text-neutral-700 dark:text-neutral-200', initialClassName)}
            aria-label="store logo initial"
          >
            {initial}
          </span>
        </div>
      )}
    </div>
  );
};

export default StoreLogoAvatar;


