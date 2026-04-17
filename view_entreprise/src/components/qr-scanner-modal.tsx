'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BrowserQRCodeReader } from '@zxing/library';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
}

export function QRScannerModal({ isOpen, onClose, onScan }: QRScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);

  useEffect(() => {
    console.log('📷 QRScannerModal isOpen changé:', isOpen);
    if (isOpen) {
      console.log('🎬 Démarrage du scan...');
      startScanning();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isOpen]);

  const startScanning = async () => {
    try {
      setError('');
      setIsScanning(true);

      const codeReader = new BrowserQRCodeReader();
      codeReaderRef.current = codeReader;

      // Get available video devices
      const videoInputDevices = await codeReader.listVideoInputDevices();

      if (videoInputDevices.length === 0) {
        setError('Aucune caméra détectée sur cet appareil.');
        return;
      }

      // Try to find back camera or use first available
      const selectedDeviceId = videoInputDevices.find(device =>
        device.label.toLowerCase().includes('back') ||
        device.label.toLowerCase().includes('arrière')
      )?.deviceId || videoInputDevices[0].deviceId;

      // Start continuous scanning
      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current!,
        (result, error) => {
          if (result) {
            // QR Code detected!
            console.log('QR Code détecté:', result.getText());
            onScan(result.getText());
            stopScanning();
            onClose();
          }
          // Ignore errors (they're thrown continuously when no QR is in view)
        }
      );
    } catch (err) {
      console.error('Erreur accès caméra:', err);
      setError('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
    setIsScanning(false);
  };

  const handleClose = () => {
    stopScanning();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black">
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-black/50 backdrop-blur">
        <div className="flex items-center gap-2 text-white">
          <Camera className="h-5 w-5" />
          <h2 className="font-semibold">Scanner le QR Code</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="text-white hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="relative w-full h-full flex items-center justify-center">
        {error ? (
          <div className="text-center p-6">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={startScanning} variant="outline">
              Réessayer
            </Button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Dark Overlay with transparent center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-64">
                {/* Overlay effect - makes everything dark except the center */}
                <div className="absolute inset-0" style={{
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)'
                }}></div>

                {/* Corner borders */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white"></div>

                {/* Scanning line */}
                {isScanning && (
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-full h-1 bg-white/50 animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/50 backdrop-blur text-center text-white">
        <p>Placez le QR code dans le cadre</p>
      </div>
    </div>
  );
}
