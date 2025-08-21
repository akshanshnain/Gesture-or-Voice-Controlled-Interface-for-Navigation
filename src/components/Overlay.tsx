import React from 'react';
import styled from 'styled-components';
import { GestureType } from '../types';

interface OverlayProps {
  transcript: string;
  currentCommand: string;
  gestureType: GestureType | null;
  gestureConfidence: number;
  showLinkNumbers: boolean;
}

const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 500;
`;

const TranscriptPanel = styled.div<{ hasContent: boolean }>`
  position: fixed;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px 20px;
  border-radius: 25px;
  font-size: 16px;
  max-width: 80%;
  max-height: 100px;
  overflow-y: auto;
  backdrop-filter: blur(10px);
  opacity: ${props => props.hasContent ? 1 : 0};
  transition: opacity 0.3s ease;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const CommandDisplay = styled.div<{ hasCommand: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(76, 175, 80, 0.9);
  color: white;
  padding: 20px 30px;
  border-radius: 15px;
  font-size: 18px;
  font-weight: bold;
  backdrop-filter: blur(10px);
  opacity: ${props => props.hasCommand ? 1 : 0};
  transition: opacity 0.3s ease;
  transform: translate(-50%, -50%) scale(${props => props.hasCommand ? 1 : 0.8});
  animation: ${props => props.hasCommand ? 'commandPulse 0.5s ease-out' : 'none'};

  @keyframes commandPulse {
    0% {
      transform: translate(-50%, -50%) scale(0.8);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.1);
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

const GestureIndicator = styled.div<{ isActive: boolean }>`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(33, 150, 243, 0.9);
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  backdrop-filter: blur(10px);
  opacity: ${props => props.isActive ? 1 : 0};
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ConfidenceBar = styled.div<{ confidence: number }>`
  width: 60px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${props => props.confidence * 100}%;
    height: 100%;
    background: #4CAF50;
    transition: width 0.3s ease;
  }
`;

const LinkNumbersOverlay = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 400;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const LinkNumber = styled.div`
  position: absolute;
  background: rgba(255, 193, 7, 0.9);
  color: #000;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  animation: linkNumberPulse 2s infinite;

  @keyframes linkNumberPulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;

const Overlay: React.FC<OverlayProps> = ({
  transcript,
  currentCommand,
  gestureType,
  gestureConfidence,
  showLinkNumbers
}) => {
  const getGestureIcon = (gesture: GestureType): string => {
    switch (gesture) {
      case 'swipe_up': return '⬆️';
      case 'swipe_down': return '⬇️';
      case 'swipe_left': return '⬅️';
      case 'swipe_right': return '➡️';
      case 'pinch': return '🤏';
      case 'thumbs_up': return '👍';
      case 'point': return '👆';
      case 'fist': return '✊';
      case 'open_palm': return '🖐️';
      default: return '👋';
    }
  };

  const getGestureText = (gesture: GestureType): string => {
    switch (gesture) {
      case 'swipe_up': return 'Swipe Up';
      case 'swipe_down': return 'Swipe Down';
      case 'swipe_left': return 'Swipe Left';
      case 'swipe_right': return 'Swipe Right';
      case 'pinch': return 'Pinch';
      case 'thumbs_up': return 'Thumbs Up';
      case 'point': return 'Point';
      case 'fist': return 'Fist';
      case 'open_palm': return 'Open Palm';
      default: return 'Unknown Gesture';
    }
  };

  return (
    <OverlayContainer>
      {/* Voice Transcript */}
      <TranscriptPanel hasContent={!!transcript.trim()}>
        {transcript || 'Say something...'}
      </TranscriptPanel>

      {/* Current Command Display */}
      <CommandDisplay hasCommand={!!currentCommand}>
        {currentCommand}
      </CommandDisplay>

      {/* Gesture Indicator */}
      <GestureIndicator isActive={!!gestureType}>
        {gestureType && (
          <>
            <span>{getGestureIcon(gestureType)}</span>
            <span>{getGestureText(gestureType)}</span>
            <ConfidenceBar confidence={gestureConfidence} />
          </>
        )}
      </GestureIndicator>

      {/* Link Numbers Overlay */}
      <LinkNumbersOverlay $visible={showLinkNumbers}>
        {/* This will be populated by LinkIndexer component */}
      </LinkNumbersOverlay>
    </OverlayContainer>
  );
};

export default Overlay;
