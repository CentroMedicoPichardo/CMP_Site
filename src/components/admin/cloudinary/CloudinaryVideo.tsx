// src/components/admin/cloudinary/CloudinaryVideo.tsx
'use client';

import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';

interface CloudinaryVideoProps {
  publicId: string;
  width?: string | number;
  height?: string | number;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  poster?: string;
}

export function CloudinaryVideo({ 
  publicId,
  width = '100%',
  height = 'auto',
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  className = '',
  poster
}: CloudinaryVideoProps) {
  return (
    <CldVideoPlayer
      src={publicId}
      width={width}
      height={height}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      className={className}
      poster={poster}
      // Transformaciones de video
      transformation={{
        quality: 'auto',
        format: 'auto'
      }}
    />
  );
}