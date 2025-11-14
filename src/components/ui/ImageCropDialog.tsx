'use client';

import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  ImageCrop,
  ImageCropApply,
  ImageCropReset,
} from '@/components/kibo-ui/image-crop';
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

// Componente customizado que aplica zoom com transform-origin dinâmico
const CustomImageCropContent = forwardRef<CustomImageCropContentRef, { 
  zoom: number;
  aspect?: number;
  circularCrop?: boolean;
  file: File;
  onCropComplete: (croppedImage: string) => void;
}>(({ zoom, aspect, circularCrop, file, onCropComplete }, ref) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [crop, setCrop] = useState<PercentCrop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [transformOrigin, setTransformOrigin] = useState<string>('center');

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
      // Para crop circular (aspect 1:1), usar a menor dimensão para garantir círculo perfeito
      const minDimension = Math.min(width, height);
      const cropSize = (minDimension / Math.max(width, height)) * 90; // 90% da menor dimensão
      
      centerCrop = {
        unit: '%',
        width: width <= height ? 90 : cropSize,
        height: height <= width ? 90 : cropSize,
        x: width <= height ? 5 : (100 - cropSize) / 2,
        y: height <= width ? 5 : (100 - cropSize) / 2,
      };
    } else if (aspect) {
      // Para outros aspectos, usar cálculo original
      centerCrop = {
        unit: '%',
        width: 90,
        height: (90 / aspect),
        x: 5,
        y: 5 + ((90 - (90 / aspect)) / 2),
      };
    } else {
      // Sem aspect definido
      centerCrop = { unit: '%', width: 90, height: 90, x: 5, y: 5 };
    }
    
    setCrop(centerCrop);
    
    // Atualizar transform-origin para o centro do crop inicial
    const originX = centerCrop.x + (centerCrop.width / 2);
    const originY = centerCrop.y + (centerCrop.height / 2);
    setTransformOrigin(`${originX}% ${originY}%`);
  }, [aspect]);

  const handleChange = useCallback((pixelCrop: PixelCrop, percentCrop: PercentCrop) => {
    setCrop(percentCrop);
    
    // Calcular transform-origin baseado no centro do crop
    const originX = percentCrop.x + (percentCrop.width / 2);
    const originY = percentCrop.y + (percentCrop.height / 2);
    setTransformOrigin(`${originX}% ${originY}%`);
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

    // Usar offsetWidth/offsetHeight que não são afetados pelo transform
    const displayWidth = imgRef.current.offsetWidth;
    const displayHeight = imgRef.current.offsetHeight;
    
    const scaleX = imgRef.current.naturalWidth / displayWidth;
    const scaleY = imgRef.current.naturalHeight / displayHeight;

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

  const shadcnStyle = {
    '--rc-border-color': 'var(--color-border)',
    '--rc-focus-color': 'var(--color-primary)',
  } as CSSProperties;

  return (
    <ReactCrop
      className="max-h-96 max-w-full"
      crop={crop}
      onChange={handleChange}
      onComplete={handleComplete}
      style={shadcnStyle}
      aspect={aspect}
      circularCrop={circularCrop}
    >
      {imgSrc && (
        <img
          alt="crop"
          className="size-full"
          onLoad={onImageLoad}
          ref={imgRef}
          src={imgSrc}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: transformOrigin,
            transition: 'transform 0.2s ease-out',
          }}
        />
      )}
    </ReactCrop>
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
  const [zoom, setZoom] = useState<number>(1);
  const [isCropApplied, setIsCropApplied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropRef = useRef<CustomImageCropContentRef>(null);

  // Load external file if provided
  useEffect(() => {
    if (externalFile) {
      setFile(externalFile);
      setIsCropApplied(false);
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
    setZoom(1);
    setIsCropApplied(false);
    onClose();
  };

  const handleCropComplete = (croppedImage: string) => {
    onSave(croppedImage);
    setFile(null);
    setZoom(1);
    setIsCropApplied(false);
    onClose();
  };

  const handleApplyCrop = () => {
    // Apenas marca que o crop foi aplicado, forçando re-render do completedCrop
    setIsCropApplied(true);
  };

  const handleSave = async () => {
    if (cropRef.current) {
      await cropRef.current.applyCrop();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={circularCrop ? "max-w-xl" : "max-w-3xl"}>
        <DialogHeader>
          <DialogTitle>Recortar Imagem</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!file ? (
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                  <svg
                    className="w-8 h-8 text-gray-400 mb-2"
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
                  <p className="text-sm text-gray-600 text-center">
                    Clique para selecionar uma imagem
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
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
              {/* Zoom Slider */}
              <div className="space-y-2">
                <Label htmlFor="zoom-slider" className="text-sm font-medium">
                  Zoom: {zoom.toFixed(1)}x
                </Label>
                <input
                  id="zoom-slider"
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 overflow-hidden">
                <CustomImageCropContent 
                  ref={cropRef}
                  zoom={zoom}
                  aspect={aspect}
                  circularCrop={circularCrop}
                  file={file}
                  onCropComplete={handleCropComplete}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleApplyCrop}
                  >
                    Aplicar Recorte
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setZoom(1)}
                  >
                    Reset Zoom
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSave}
                    disabled={!isCropApplied}
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
