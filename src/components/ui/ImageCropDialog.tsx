'use client';

import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ReactCrop, { type PercentCrop, type PixelCrop } from 'react-image-crop';
import type { SyntheticEvent, CSSProperties } from 'react';

import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
  aspect?: number;
  file?: File | null;
  circularCrop?: boolean;
}

interface CustomImageCropContentRef {
  applyCrop: () => Promise<void>;
}

const CustomImageCropContent = forwardRef<CustomImageCropContentRef, { 
  aspect?: number;
  circularCrop?: boolean;
  file: File;
  onCropComplete: (croppedImage: string) => void;
}>(({ aspect, circularCrop, file, onCropComplete }, ref) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [crop, setCrop] = useState<PercentCrop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.addEventListener('load', () =>
      setImgSrc(reader.result?.toString() || '')
    );
    reader.readAsDataURL(file);
  }, [file]);

  const onImageLoad = useCallback((e: SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    let centerCrop: PercentCrop;
    
    if (aspect === 1) {
      // Para crop circular, sempre usar a menor dimensão como referência
      // Isso garante um círculo perfeito independente da proporção da imagem
      const minDimension = Math.min(width, height);
      const cropSizeInPixels = minDimension * 0.6; // 60% da menor dimensão
      
      // Converter para porcentagem baseado na largura e altura reais
      const cropWidthPercent = (cropSizeInPixels / width) * 100;
      const cropHeightPercent = (cropSizeInPixels / height) * 100;
      
      centerCrop = {
        unit: '%',
        width: cropWidthPercent,
        height: cropHeightPercent,
        x: (100 - cropWidthPercent) / 2,
        y: (100 - cropHeightPercent) / 2,
      };
    } else if (aspect) {
      centerCrop = {
        unit: '%',
        width: 60,
        height: (60 / aspect),
        x: 20,
        y: 20 + ((60 - (60 / aspect)) / 2),
      };
    } else {
      centerCrop = { unit: '%', width: 60, height: 60, x: 20, y: 20 };
    }
    
    setCrop(centerCrop);
  }, [aspect]);

  const handleChange = useCallback((pixelCrop: PixelCrop, percentCrop: PercentCrop) => {
    setCrop(percentCrop);
  }, []);

  const handleComplete = useCallback((pixelCrop: PixelCrop) => {
    setCompletedCrop(pixelCrop);
  }, []);

  const applyCrop = useCallback(async () => {
    if (!(imgRef.current && completedCrop)) {
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const croppedImageUrl = canvas.toDataURL('image/png');
    onCropComplete(croppedImageUrl);
  }, [completedCrop, onCropComplete]);

  useImperativeHandle(ref, () => ({
    applyCrop,
  }));

  const customStyle = {
    '--rc-border-color': 'hsl(204, 94.5%, 54%)',
    '--rc-focus-color': 'hsl(204, 94.5%, 54%)',
  } as CSSProperties;

  return (
    <div className="relative flex items-center justify-center w-full h-[500px] bg-[repeating-conic-gradient(#e5e5e5_0%_25%,transparent_0%_50%)_50%_50%/20px_20px] rounded-lg overflow-hidden">
      <ReactCrop
        className="max-w-full max-h-full"
        crop={crop}
        onChange={handleChange}
        onComplete={handleComplete}
        style={customStyle}
        aspect={circularCrop ? 1 : aspect}
        circularCrop={circularCrop}
        ruleOfThirds
      >
        {imgSrc && (
          <img
            alt="crop"
            className="max-h-[500px] w-auto"
            onLoad={onImageLoad}
            ref={imgRef}
            src={imgSrc}
            style={{
              display: 'block',
            }}
          />
        )}
      </ReactCrop>
    </div>
  );
});

CustomImageCropContent.displayName = 'CustomImageCropContent';

export function ImageCropDialog({
  isOpen,
  onClose,
  onSave,
  aspect,
  file: externalFile,
  circularCrop = false,
}: ImageCropDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropRef = useRef<CustomImageCropContentRef>(null);

  useEffect(() => {
    if (externalFile) {
      setFile(externalFile);
    }
  }, [externalFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleClose = () => {
    setFile(null);
    onClose();
  };

  const handleCropComplete = (croppedImage: string) => {
    onSave(croppedImage);
    setFile(null);
    onClose();
  };

  const handleContinueWithoutCrop = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onSave(reader.result as string);
        setFile(null);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSelection = async () => {
    if (cropRef.current) {
      await cropRef.current.applyCrop();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Recortar Imagem</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          {!file ? (
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                  <svg
                    className="w-10 h-10 text-gray-400 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 text-center font-medium">
                    Clique para selecionar uma imagem
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG ou GIF (máx. 5MB)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <CustomImageCropContent 
                ref={cropRef}
                aspect={aspect}
                circularCrop={circularCrop}
                file={file}
                onCropComplete={handleCropComplete}
              />
              
              <div className="flex justify-end items-center gap-2 pt-2">
                <Button 
                  variant="secondary"
                  onClick={handleContinueWithoutCrop}
                >
                  Continue sem recortar
                </Button>
                <Button 
                  onClick={handleCropSelection}
                >
                  Recortar seleção
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Exemplo de uso
export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Image Crop Dialog</h1>
          <p className="text-gray-600 mb-6">
            Clique no botão abaixo para abrir o dialog de crop com imagem fixa
          </p>
          
          <Button 
            onClick={() => setIsOpen(true)}
          >
            Abrir Dialog de Crop
          </Button>
        </div>

        {croppedImage && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Imagem Recortada</h2>
            <img 
              src={croppedImage} 
              alt="Cropped" 
              className="max-w-full rounded-lg border"
            />
          </div>
        )}

        <ImageCropDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSave={(dataUrl) => setCroppedImage(dataUrl)}
          aspect={1}
          circularCrop={true}
        />
      </div>
    </div>
  );
}