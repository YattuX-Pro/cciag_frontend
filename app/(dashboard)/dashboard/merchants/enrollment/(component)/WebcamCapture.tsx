'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface WebcamCaptureProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
  initialImage: string
}

export default function WebcamCapture({ onCapture, onCancel, initialImage }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true, // tu peux préciser `deviceId` ici si besoin
          audio: false
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError("Impossible d'accéder à la caméra. Vérifie les autorisations.");
      }
    };

    startWebcam();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const captureImage = () => {
    if (!canvasRef.current || !videoRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      setCaptured(imageData);
    }
  };

  const confirmCapture = () => {
    if (captured) {
      onCapture(captured);
      stream?.getTracks().forEach(track => track.stop());
    }
  };

  const retake = () => {
    setCaptured(null);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      {!captured ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full max-w-md rounded shadow"
        />
      ) : (
        <img src={captured} alt="Capture" className="w-full max-w-md rounded shadow" />
      )}

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        {!captured ? (
          <Button onClick={captureImage}>
            Capturer
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={retake}>
              Reprendre
            </Button>
            <Button onClick={confirmCapture}>
              Utiliser
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
