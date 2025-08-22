import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import VoiceController from './components/VoiceController';
import GestureController from './components/GestureController';
import Overlay from './components/Overlay';
import LinkIndexer from './components/LinkIndexer';
import PdfViewer from './components/PdfViewer';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useGestureRecognition } from './hooks/useGestureRecognition';
import { useFocusManagement } from './hooks/useFocusManagement';
import { NavigationCommand, GestureType } from './types';

interface PdfViewerRef {
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (pageNumber: number) => void;
}

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const ControlPanel = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  z-index: 1000;
`;

const StatusIndicator = styled.div<{ isActive: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.isActive ? '#4CAF50' : '#f44336'};
  margin-right: 8px;
  display: inline-block;
`;

const VoiceCommandFeedback = styled.div<{ $show: boolean }>`
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
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.3s ease;
  z-index: 1002;
  text-align: center;
`;

const App: React.FC = () => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isGestureActive, setIsGestureActive] = useState(false);
  const [currentCommand, setCurrentCommand] = useState<string>('');
  const [showLinkNumbers, setShowLinkNumbers] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string | null>(null);
  const [showVoiceFeedback, setShowVoiceFeedback] = useState(false);

  const pdfViewerRef = useRef<PdfViewerRef>(null);

  // Custom hooks
  const { 
    transcript, 
    isListening, 
    startListening, 
    stopListening,
    resetTranscript 
  } = useSpeechRecognition();

  const { 
    gestureType, 
    gestureConfidence, 
    isGestureDetected,
    startGestureDetection,
    stopGestureDetection 
  } = useGestureRecognition();

  const { 
    focusedElement, 
    focusNextElement, 
    focusPreviousElement,
    focusElementByIndex,
    scrollToElement 
  } = useFocusManagement();

  // Handle voice commands
  const handleVoiceCommand = (command: NavigationCommand) => {
    setCurrentCommand(command.text);
    console.log('🎯 Executing voice command:', command.type);
    
    switch (command.type) {
      case 'scroll':
        if (command.direction === 'up') {
          console.log('📜 Scrolling up...');
          window.scrollBy(0, -100);
        } else if (command.direction === 'down') {
          console.log('📜 Scrolling down...');
          window.scrollBy(0, 100);
        }
        break;
      
        case 'zoom':
          if (command.direction === 'in') {
            console.log('🔍 Zooming in...');
            // Use a more reliable zoom method
            const currentZoom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--zoom') || '1');
            const newZoom = Math.min(currentZoom * 1.2, 3);
            document.documentElement.style.setProperty('--zoom', newZoom.toString());
            document.body.style.transform = `scale(${newZoom})`;
            document.body.style.transformOrigin = 'top left';
          } else if (command.direction === 'out') {
            console.log(' Zooming out...');
            const currentZoom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--zoom') || '1');
            const newZoom = Math.max(currentZoom * 0.8, 0.5);
            document.documentElement.style.setProperty('--zoom', newZoom.toString());
            document.body.style.transform = `scale(${newZoom})`;
            document.body.style.transformOrigin = 'top left';
          }
          break;
      
      case 'openLink':
        if (command.linkIndex !== undefined) {
          console.log('🔗 Opening link', command.linkIndex);
          focusElementByIndex(command.linkIndex);
        }
        break;
      
      case 'toggleLinks':
        console.log('🔗 Toggling link numbers...');
        setShowLinkNumbers(!showLinkNumbers);
        break;
      
      case 'activate':
        console.log('🖱️ Activating focused element...');
        if (focusedElement) {
          focusedElement.click();
        } else {
          console.log('⚠️ No focused element to activate');
        }
        break;

      case 'loadPdf':
        console.log('🖼️ Loading sample PDF...');
        setCurrentPdfUrl('/samples/Benchmark 1.pdf');
        break;

      case 'closePdf':
        console.log('❌ Closing PDF...');
        if (currentPdfUrl && currentPdfUrl.startsWith('blob:')) {
          URL.revokeObjectURL(currentPdfUrl);
        }
        setCurrentPdfUrl(null);
        break;

      case 'nextPage':
        console.log('📄 Next page...');
        if (pdfViewerRef.current) {
          pdfViewerRef.current.nextPage();
        } else {
          console.log('⚠️ PDF viewer not available');
        }
        break;

      case 'prevPage':
        console.log('📄 Previous page...');
        if (pdfViewerRef.current) {
          pdfViewerRef.current.prevPage();
        } else {
          console.log('⚠️ PDF viewer not available');
        }
        break;

      case 'goToPage':
        if (command.pageNumber !== undefined) {
          console.log('📄 Going to page', command.pageNumber);
          if (pdfViewerRef.current) {
            pdfViewerRef.current.goToPage(command.pageNumber);
          } else {
            console.log('⚠️ PDF viewer not available');
          }
        }
        break;
    }
    
    // Clear the command after a short delay
    setTimeout(() => {
      setCurrentCommand('');
    }, 2000);
  };

  // Handle gesture commands
  const handleGestureCommand = (gesture: GestureType) => {
    switch (gesture) {
      case 'swipe_up':
        window.scrollBy(0, -100);
        break;
      
      case 'swipe_down':
        window.scrollBy(0, 100);
        break;
      
      case 'pinch':
        setShowLinkNumbers(!showLinkNumbers);
        break;
      
      case 'thumbs_up':
        if (focusedElement) {
          focusedElement.click();
        }
        break;
      
      case 'point':
        // Handle pointing gesture for element selection
        break;
    }
  };

  // Effect to process voice transcript
  useEffect(() => {
    if (transcript && isListening) {
      console.log('🎤 Processing transcript:', transcript);
      
      // Process transcript and convert to commands
      const command = processVoiceTranscript(transcript);
      if (command) {
        console.log('✅ Voice command detected:', command);
        handleVoiceCommand(command);
        // Reset transcript after processing
        resetTranscript();
      }
    }
  }, [transcript, isListening, resetTranscript]);

  // Effect to process gesture detection
  useEffect(() => {
    if (isGestureDetected && gestureType) {
      handleGestureCommand(gestureType);
    }
  }, [isGestureDetected, gestureType]);

  // Effect to show voice feedback
  useEffect(() => {
    if (currentCommand) {
      setShowVoiceFeedback(true);
      const timer = setTimeout(() => {
        setShowVoiceFeedback(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentCommand]);

  // Voice command processing function
  const processVoiceTranscript = (text: string): NavigationCommand | null => {
    const lowerText = text.toLowerCase().trim();
    console.log('🔍 Processing voice text:', lowerText);
    
    if (lowerText.includes('scroll up') || lowerText.includes('scroll up')) {
      return { type: 'scroll', direction: 'up', text };
    }
    if (lowerText.includes('scroll down') || lowerText.includes('scroll down')) {
      return { type: 'scroll', direction: 'down', text };
    }
    if (lowerText.includes('zoom in') || lowerText.includes('zoomin')) {
      return { type: 'zoom', direction: 'in', text };
    }
    if (lowerText.includes('zoom out') || lowerText.includes('zoomout')) {
      return { type: 'zoom', direction: 'out', text };
    }
    if (lowerText.includes('open link') || lowerText.includes('link')) {
      const match = text.match(/(\d+)/);
      if (match) {
        return { type: 'openLink', linkIndex: parseInt(match[1]), text };
      }
    }
    if (lowerText.includes('show links') || lowerText.includes('toggle links') || lowerText.includes('show link')) {
      return { type: 'toggleLinks', text };
    }
    if (lowerText.includes('activate') || lowerText.includes('click') || lowerText.includes('enter')) {
      return { type: 'activate', text };
    }
    
    // PDF commands - simplified
    if (lowerText.includes('load pdf') || lowerText.includes('open pdf') || 
        lowerText.includes('load sample pdf') || lowerText.includes('sample pdf')) {
      return { type: 'loadPdf', text };
    }
    if (lowerText.includes('close pdf') || lowerText.includes('exit pdf')) {
      return { type: 'closePdf', text };
    }
    if (lowerText.includes('next page') || lowerText.includes('page next')) {
      return { type: 'nextPage', text };
    }
    if (lowerText.includes('previous page') || lowerText.includes('page previous')) {
      return { type: 'prevPage', text };
    }
    if (lowerText.includes('page') && lowerText.match(/\d+/)) {
      const match = lowerText.match(/(\d+)/);
      if (match) {
        return { type: 'goToPage', pageNumber: parseInt(match[1]), text };
      }
    }
    
    console.log('❌ No command matched for:', lowerText);
    return null;
  };

  const handleFileUpload = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }
    
    const fileUrl = URL.createObjectURL(file);
    setCurrentPdfUrl(fileUrl);
    console.log('📄 Loading uploaded PDF:', file.name);
  };

  return (
    <AppContainer>
      <ControlPanel>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <StatusIndicator isActive={isVoiceActive} />
          <span>Voice Control</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <StatusIndicator isActive={isGestureActive} />
          <span>Gesture Control</span>
        </div>
      </ControlPanel>

      <VoiceController
        isActive={isVoiceActive}
        onToggle={() => setIsVoiceActive(!isVoiceActive)}
        onStart={startListening}
        onStop={stopListening}
        isListening={isListening}
      />

      <GestureController
        isActive={isGestureActive}
        onToggle={() => {
          console.log('🔄 Toggling gesture control:', !isGestureActive);
          setIsGestureActive(!isGestureActive);
        }}
        onStart={() => {
          console.log('🚀 Starting gesture detection...');
          startGestureDetection();
        }}
        onStop={() => {
          console.log('🛑 Stopping gesture detection...');
          stopGestureDetection();
        }}
        isDetecting={isGestureDetected}
      />

      <Overlay
        transcript={transcript}
        currentCommand={currentCommand}
        gestureType={gestureType}
        gestureConfidence={gestureConfidence}
        showLinkNumbers={showLinkNumbers}
      />

      <VoiceCommandFeedback $show={showVoiceFeedback}>
        {currentCommand && (
          <>
            <div>✅ Voice Command Executed!</div>
            <div style={{ fontSize: '14px', marginTop: '5px' }}>{currentCommand}</div>
          </>
        )}
      </VoiceCommandFeedback>

      <ContentArea>
        {currentPdfUrl ? (
          <PdfViewer ref={pdfViewerRef} url={currentPdfUrl} />
        ) : (
          <div>
            <h1>Gesture & Voice-Controlled Navigation</h1>
            <p>This is a hands-free navigation prototype that enables users to interact with websites and documents using either voice commands or hand gestures.</p>
            
            <h2>PDF Controls</h2>
            <div style={{ marginBottom: '20px' }}>
              <button 
                onClick={() => setCurrentPdfUrl('/samples/Benchmark 1.pdf')}
                style={{ 
                  background: '#007bff', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: '5px', 
                  marginRight: '10px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                📄 Load Sample PDF
              </button>
              
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.type !== 'application/pdf') {
                      alert('Please select a PDF file');
                      return;
                    }
                    const fileUrl = URL.createObjectURL(file);
                    setCurrentPdfUrl(fileUrl);
                    console.log('📄 Loading uploaded PDF:', file.name);
                  }
                }}
                style={{ display: 'none' }}
                id="pdf-file-input"
              />
              
              <button 
                onClick={() => document.getElementById('pdf-file-input')?.click()}
                style={{ 
                  background: '#28a745', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: '5px',
                  marginRight: '10px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                📁 Upload PDF from Computer
              </button>
              
              {currentPdfUrl && (
                <button 
                  onClick={() => {
                    if (currentPdfUrl.startsWith('blob:')) {
                      URL.revokeObjectURL(currentPdfUrl);
                    }
                    setCurrentPdfUrl(null);
                  }}
                  style={{ 
                    background: '#dc3545', 
                    color: 'white', 
                    border: 'none', 
                    padding: '10px 20px', 
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ❌ Close PDF
                </button>
              )}
            </div>
            
            <h2>Voice Commands</h2>
            <ul>
              <li>"Scroll up" / "Scroll down" - Navigate through content</li>
              <li>"Zoom in" / "Zoom out" - Adjust page zoom</li>
              <li>"Open link [number]" - Focus on specific link</li>
              <li>"Show links" - Toggle link number display</li>
              <li>"Activate" - Click the focused element</li>
              <li><strong>"Load PDF"</strong> - Open a sample PDF document</li>
              <li><strong>"Close PDF"</strong> - Return to normal view</li>
              <li><strong>"Next page" / "Previous page"</strong> - Navigate PDF pages</li>
              <li><strong>"Page [number]"</strong> - Go to specific PDF page</li>
            </ul>

            <h2>Gesture Controls</h2>
            <ul>
              <li>Swipe up/down - Scroll through content</li>
              <li>Pinch - Toggle link numbers</li>
              <li>Thumbs up - Activate focused item</li>
              <li>Point - Select elements</li>
            </ul>

            <h2>Sample Links</h2>
            <p><a href="https://example.com">Example Link 1</a></p>
            <p><a href="https://example.org">Example Link 2</a></p>
            <p><a href="https://example.net">Example Link 3</a></p>
            <p><a href="https://example.edu">Example Link 4</a></p>
            <p><a href="https://example.gov">Example Link 5</a></p>
          </div>
        )}
      </ContentArea>

      <LinkIndexer 
        showNumbers={showLinkNumbers}
        onElementFocus={focusElementByIndex}
      />
    </AppContainer>
  );
};

export default App;
