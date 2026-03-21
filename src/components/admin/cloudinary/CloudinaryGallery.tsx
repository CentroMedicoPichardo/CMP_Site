// src/components/admin/cloudinary/CloudinaryGallery.tsx
'use client';

import { useState } from 'react';
import { CloudinaryImage } from './CloudinaryImage';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  publicId: string;
  alt: string;
  title?: string;
}

interface CloudinaryGalleryProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function CloudinaryGallery({ 
  images, 
  columns = 3,
  className = ''
}: CloudinaryGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const handlePrevious = () => {
    setSelectedIndex(prev => 
      prev !== null ? (prev - 1 + images.length) % images.length : null
    );
  };

  const handleNext = () => {
    setSelectedIndex(prev => 
      prev !== null ? (prev + 1) % images.length : null
    );
  };

  return (
    <>
      {/* Grid de imágenes */}
      <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
        {images.map((image, index) => (
          <div
            key={image.publicId}
            className="cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setSelectedIndex(index)}
          >
            <CloudinaryImage
              publicId={image.publicId}
              alt={image.alt}
              width={400}
              height={300}
              rounded={true}
              className="w-full h-48 object-cover"
            />
            {image.title && (
              <p className="mt-2 text-sm font-medium text-gray-700">{image.title}</p>
            )}
          </div>
        ))}
      </div>

      {/* Modal de visualización */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 text-white hover:text-[#FFC300] transition-colors"
          >
            <X size={24} />
          </button>

          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[#FFC300] transition-colors"
          >
            <ChevronLeft size={36} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#FFC300] transition-colors"
          >
            <ChevronRight size={36} />
          </button>

          <div className="max-w-5xl max-h-[90vh] p-4">
            <CloudinaryImage
              publicId={images[selectedIndex].publicId}
              alt={images[selectedIndex].alt}
              width={1200}
              height={800}
              className="max-w-full max-h-[80vh] object-contain"
            />
            {images[selectedIndex].title && (
              <p className="text-white text-center mt-4 text-lg">
                {images[selectedIndex].title}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}