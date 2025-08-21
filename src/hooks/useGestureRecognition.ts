import { useState, useEffect, useCallback, useRef } from 'react';
import { GestureType, GestureData } from '../types';

interface GestureRecognitionHook {
  gestureType: GestureType | null;
  gestureConfidence: number;
  isGestureDetected: boolean;
  isSupported: boolean;
  startGestureDetection: () => void;
  stopGestureDetection: () => void;
}

export const useGestureRecognition = (): GestureRecognitionHook => {
  const [gestureType, setGestureType] = useState<GestureType | null>(null);
  const [gestureConfidence, setGestureConfidence] = useState<number>(0);
  const [isGestureDetected, setIsGestureDetected] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastGestureTime = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);

  // Simple gesture detection using basic image analysis
  const detectGestures = (canvas: HTMLCanvasElement): GestureData | null => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Calculate brightness
    let brightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    brightness /= (data.length / 4);

    // Prevent gesture spam (minimum 2 seconds between gestures)
    const now = Date.now();
    const timeSinceLastGesture = now - lastGestureTime.current;
    
    if (timeSinceLastGesture < 2000) {
      return null;
    }

    let detectedGesture: GestureType | null = null;
    let confidence = 0;

    // Brightness-based gesture detection
    if (brightness > 150) {
      detectedGesture = 'open_palm';
      confidence = 0.7;
    } else if (brightness < 80) {
      detectedGesture = 'fist';
      confidence = 0.6;
    } else if (brightness > 100 && brightness < 140) {
      detectedGesture = 'thumbs_up';
      confidence = 0.5;
    }

    if (detectedGesture && confidence > 0.4) {
      lastGestureTime.current = now;
      console.log(`🎯 Gesture detected: ${detectedGesture} (brightness: ${brightness.toFixed(0)}, confidence: ${confidence.toFixed(2)})`);
      
      return {
        type: detectedGesture,
        confidence: confidence,
        timestamp: now
      };
    }
    
    return null;
  };

  const processFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || isProcessingRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
      try {
        isProcessingRef.current = true;
        
        // Draw current video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Detect gestures
        const gesture = detectGestures(canvas);
        
        if (gesture) {
          setGestureType(gesture.type);
          setGestureConfidence(gesture.confidence);
          setIsGestureDetected(true);
          
          console.log(`✅ Gesture recognized: ${gesture.type} (${(gesture.confidence * 100).toFixed(0)}% confidence)`);
        } else {
          setIsGestureDetected(false);
        }
      } catch (error) {
        console.error('Error processing frame:', error);
      } finally {
        isProcessingRef.current = false;
      }
    }

    // Continue processing frames
    animationFrameRef.current = requestAnimationFrame(processFrame);
  }, []);

  const startGestureDetection = useCallback(async () => {
    try {
      console.log('🚀 Starting gesture detection...');
      
      // Wait a bit for video to be ready
      setTimeout(() => {
        if (videoRef.current && canvasRef.current) {
          processFrame();
        }
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error starting gesture detection:', error);
    }
  }, [processFrame]);

  const stopGestureDetection = useCallback(() => {
    console.log('🛑 Stopping gesture detection...');
    isProcessingRef.current = true;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    setIsGestureDetected(false);
    setGestureType(null);
  }, []);

  useEffect(() => {
    return () => {
      stopGestureDetection();
    };
  }, [stopGestureDetection]);

  return {
    gestureType,
    gestureConfidence,
    isGestureDetected,
    isSupported,
    startGestureDetection,
    stopGestureDetection,
  };
};
