import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

interface GestureControllerProps {
  isActive: boolean;
  onToggle: () => void;
  onStart: () => void;
  onStop: () => void;
  isDetecting: boolean;
}

const GestureButton = styled.button<{ isActive: boolean; isDetecting: boolean }>`
  position: fixed;
  bottom: 20px;
  left: 120px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: none;
  background: ${props => 
    props.isDetecting 
      ? 'linear-gradient(45deg, #ff6b6b, #ee5a24)' 
      : props.isActive 
        ? 'linear-gradient(45deg, #2196F3, #1976D2)' 
        : 'linear-gradient(45deg, #6c757d, #5a6268)'
  };
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }

  ${props => props.isDetecting && `
    animation: pulse 1.5s infinite;
    
    @keyframes pulse {
      0% {
        box-shadow: 0 4px 20px rgba(255, 107, 107, 0.4);
      }
      50% {
        box-shadow: 0 4px 30px rgba(255, 107, 107, 0.8);
      }
      100% {
        box-shadow: 0 4px 20px rgba(255, 107, 107, 0.4);
      }
    }
  `}
`;

const GestureStatus = styled.div<{ isDetecting: boolean }>`
  position: fixed;
  bottom: 110px;
  left: 120px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 14px;
  z-index: 1000;
  opacity: ${props => props.isDetecting ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: none;
`;

const CameraPreview = styled.div<{ isActive: boolean }>`
  position: fixed;
  top: 20px;
  left: 20px;
  width: 200px;
  height: 150px;
  background: #000;
  border-radius: 10px;
  overflow: hidden;
  z-index: 999;
  opacity: ${props => props.isActive ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: none;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const GestureController: React.FC<GestureControllerProps> = ({
  isActive,
  onToggle,
  onStart,
  onStop,
  isDetecting
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleClick = () => {
    if (isActive) {
      if (isDetecting) {
        onStop();
      } else {
        onStart();
      }
    } else {
      onToggle();
    }
  };

  const getIcon = () => {
    if (isDetecting) return '👋';
    if (isActive) return '✋';
    return '👋';
  };

  const getStatusText = () => {
    if (isDetecting) return 'Detecting gestures...';
    if (isActive) return 'Gesture Active';
    return 'Gesture Inactive';
  };

  // Set up video element for camera preview
  useEffect(() => {
    if (isActive && videoRef.current) {
      // Show the video element
      videoRef.current.style.display = 'block';
      
      // Start camera if not already started
      if (!videoRef.current.srcObject) {
        navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 200, 
            height: 150,
            facingMode: 'user'
          } 
        }).then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        }).catch(error => {
          console.error('Error accessing camera:', error);
        });
      }
    } else if (videoRef.current) {
      // Hide video and stop camera
      videoRef.current.style.display = 'none';
      if (videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isActive]);

  return (
    <>
      <GestureButton
        isActive={isActive}
        isDetecting={isDetecting}
        onClick={handleClick}
        aria-label={isDetecting ? 'Stop gesture detection' : 'Start gesture control'}
        title={isDetecting ? 'Stop gesture detection' : 'Start gesture control'}
      >
        {getIcon()}
      </GestureButton>
      
      <GestureStatus isDetecting={isDetecting || isActive}>
        {getStatusText()}
      </GestureStatus>

      <CameraPreview isActive={isActive}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ display: isActive ? 'block' : 'none' }}
        />
        <canvas
          ref={canvasRef}
          width={200}
          height={150}
        />
      </CameraPreview>
    </>
  );
};

export default GestureController;
