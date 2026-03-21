// src/components/admin/cloudinary/CloudinaryImage.tsx
'use client';

import { CldImage } from 'next-cloudinary';

interface CloudinaryImageProps {
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
  crop?: 'fill' | 'scale' | 'limit' | 'thumb' | 'crop';
  gravity?: 'auto' | 'face' | 'center' | 'faces';
  className?: string;
  priority?: boolean;
  rounded?: boolean;
  effects?: {
    blur?: number;
    brightness?: number;
    sepia?: boolean;
    grayscale?: boolean;
    sharpen?: number;
  };
}

export function CloudinaryImage({ 
  publicId, 
  alt, 
  width = 800, 
  height = 600,
  crop = 'fill',
  gravity = 'auto',
  className = '',
  priority = false,
  rounded = false,
  effects
}: CloudinaryImageProps) {
  // Construir las transformaciones
  const transformations: any = {
    crop,
    gravity,
    format: 'auto',
    quality: 'auto',
  };

  // Aplicar efectos si existen
  if (effects?.blur) transformations.effect = `blur:${effects.blur}`;
  if (effects?.brightness) transformations.effect = `brightness:${effects.brightness}`;
  if (effects?.sepia) transformations.effect = 'sepia';
  if (effects?.grayscale) transformations.effect = 'grayscale';
  if (effects?.sharpen) transformations.effect = `sharpen:${effects.sharpen}`;

  return (
    <CldImage
      src={publicId}
      alt={alt}
      width={width}
      height={height}
      {...transformations}
      className={`${rounded ? 'rounded-lg' : ''} ${className}`}
      priority={priority}
    />
  );
}