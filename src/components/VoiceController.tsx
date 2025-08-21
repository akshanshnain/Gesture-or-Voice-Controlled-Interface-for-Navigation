import React from 'react';
import styled from 'styled-components';

interface VoiceControllerProps {
  isActive: boolean;
  onToggle: () => void;
  onStart: () => void;
  onStop: () => void;
  isListening: boolean;
}

const VoiceButton = styled.button<{ isActive: boolean; isListening: boolean }>`
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: none;
  background: ${props => 
    props.isListening 
      ? 'linear-gradient(45deg, #ff6b6b, #ee5a24)' 
      : props.isActive 
        ? 'linear-gradient(45deg, #4CAF50, #45a049)' 
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

  ${props => props.isListening && `
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

const VoiceStatus = styled.div<{ isListening: boolean }>`
  position: fixed;
  bottom: 110px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 14px;
  z-index: 1000;
  opacity: ${props => props.isListening ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: none;
`;

const VoiceController: React.FC<VoiceControllerProps> = ({
  isActive,
  onToggle,
  onStart,
  onStop,
  isListening
}) => {
  const handleClick = () => {
    if (isActive) {
      if (isListening) {
        onStop();
      } else {
        onStart();
      }
    } else {
      onToggle();
    }
  };

  const getIcon = () => {
    if (isListening) return '🎤';
    if (isActive) return '🔇';
    return '🎤';
  };

  const getStatusText = () => {
    if (isListening) return 'Listening...';
    if (isActive) return 'Voice Active';
    return 'Voice Inactive';
  };

  return (
    <>
      <VoiceButton
        isActive={isActive}
        isListening={isListening}
        onClick={handleClick}
        aria-label={isListening ? 'Stop listening' : 'Start voice control'}
        title={isListening ? 'Stop listening' : 'Start voice control'}
      >
        {getIcon()}
      </VoiceButton>
      
      <VoiceStatus isListening={isListening || isActive}>
        {getStatusText()}
      </VoiceStatus>
    </>
  );
};

export default VoiceController;
