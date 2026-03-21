// src/components/admin/cloudinary/CloudinaryUploader.tsx
'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Image as ImageIcon, Video } from 'lucide-react';

interface CloudinaryAsset {
  publicId: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
  resourceType: 'image' | 'video' | 'raw';
}

interface CloudinaryUploaderProps {
  onUpload: (asset: CloudinaryAsset) => void;
  onRemove?: (publicId: string) => void;
  folder?: string;
  resourceType?: 'image' | 'video' | 'auto';
  maxFiles?: number;
  preset?: string;
  showPreview?: boolean;
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
}

export function CloudinaryUploader({ 
  onUpload, 
  onRemove,
  folder = 'centro-medico',
  resourceType = 'auto',
  maxFiles = 1,
  preset = 'medicos_preset',
  showPreview = true,
  multiple = false,
  className = '',
  disabled = false
}: CloudinaryUploaderProps) {
  const [uploadedAssets, setUploadedAssets] = useState<CloudinaryAsset[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = useCallback((result: any) => {
    if (!result?.info) return;
    
    const asset: CloudinaryAsset = {
      publicId: result.info.public_id,
      url: result.info.secure_url,
      width: result.info.width,
      height: result.info.height,
      format: result.info.format,
      resourceType: result.info.resource_type
    };
    
    setUploadedAssets(prev => multiple ? [...prev, asset] : [asset]);
    onUpload(asset);
  }, [multiple, onUpload]);

  const handleRemove = useCallback((publicId: string) => {
    setUploadedAssets(prev => prev.filter(a => a.publicId !== publicId));
    if (onRemove) onRemove(publicId);
  }, [onRemove]);

  const handleWidgetOpen = useCallback((openWidget: () => void) => {
    try {
      openWidget();
    } catch (error) {
      console.error('Error al abrir el widget de Cloudinary:', error);
    }
  }, []);

  if (!preset) {
    console.error('CloudinaryUploader: Se requiere un uploadPreset');
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <CldUploadWidget
        uploadPreset={preset}
        options={{
          folder,
          resourceType,
          maxFiles,
          clientAllowedFormats: resourceType === 'auto' ? ['image', 'video'] : [resourceType],
          maxFileSize: resourceType === 'video' ? 50000000 : 10000000, // 50MB para video, 10MB para imagen
          sources: ['local', 'url', 'camera', 'google_drive', 'dropbox'],
          multiple,
          styles: {
            palette: {
              window: '#FFFFFF',
              windowBorder: '#0A3D62',
              tabIcon: '#FFC300',
              menuIcons: '#0A3D62',
              textDark: '#0A3D62',
              textLight: '#FFFFFF',
              link: '#FFC300',
              action: '#FFC300',
              inactiveTabIcon: '#8E9AA6',
              error: '#EF4444',
              inProgress: '#FFC300',
              complete: '#10B981',
              sourceBg: '#F3F4F6'
            }
          }
        }}
        onSuccess={handleSuccess}
        onError={(error) => {
          console.error('Error subiendo a Cloudinary:', error);
        }}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => handleWidgetOpen(open)}
            disabled={disabled || !open}
            className={`
              flex items-center justify-center gap-2 w-full px-4 py-8 border-2 border-dashed 
              ${disabled || !open 
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                : 'border-gray-300 hover:border-[#FFC300] hover:bg-[#FFF9E6]'
              } 
              rounded-lg transition-all group
            `}
          >
            {resourceType === 'video' ? (
              <Video size={24} className={`${disabled || !open ? 'text-gray-300' : 'text-gray-400 group-hover:text-[#FFC300]'}`} />
            ) : (
              <Upload size={24} className={`${disabled || !open ? 'text-gray-300' : 'text-gray-400 group-hover:text-[#FFC300]'}`} />
            )}
            <span className={`${disabled || !open ? 'text-gray-300' : 'text-gray-600 group-hover:text-[#0A3D62]'}`}>
              {!open 
                ? 'Widget no disponible' 
                : `Haz clic para subir ${resourceType === 'video' ? 'video' : 'archivo'}`
              }
            </span>
          </button>
        )}
      </CldUploadWidget>

      {/* Vista previa de los archivos subidos */}
      {showPreview && uploadedAssets.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {uploadedAssets.map((asset) => (
            <div key={asset.publicId} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                {asset.resourceType === 'video' ? (
                  <video 
                    src={asset.url} 
                    className="w-full h-full object-cover" 
                    controls 
                  />
                ) : (
                  <Image
                    src={asset.url}
                    alt="Archivo subido"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(asset.publicId)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}