import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { FocusableElement } from '../types';

interface LinkIndexerProps {
  showNumbers: boolean;
  onElementFocus: (index: number) => void;
}

const LinkNumberOverlay = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 400;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const LinkNumber = styled.div<{ $isFocused: boolean }>`
  position: absolute;
  background: ${props => props.$isFocused 
    ? 'rgba(76, 175, 80, 0.9)' 
    : 'rgba(255, 193, 7, 0.9)'
  };
  color: ${props => props.$isFocused ? '#fff' : '#000'};
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
  animation: ${props => props.$isFocused ? 'focusedPulse 1s infinite' : 'linkNumberPulse 2s infinite'};
  transform: translate(-50%, -50%);

  @keyframes linkNumberPulse {
    0%, 100% {
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.1);
    }
  }

  @keyframes focusedPulse {
    0%, 100% {
      transform: translate(-50%, -50%) scale(1);
      box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
      box-shadow: 0 4px 16px rgba(76, 175, 80, 0.6);
    }
  }
`;

const LinkIndexer: React.FC<LinkIndexerProps> = ({ showNumbers, onElementFocus }) => {
  const [focusableElements, setFocusableElements] = useState<FocusableElement[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const observerRef = useRef<MutationObserver | null>(null);

  // Find all focusable elements
  const findFocusableElements = (): FocusableElement[] => {
    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ];

    const elements = document.querySelectorAll(selectors.join(', '));
    const focusableElements: FocusableElement[] = [];

    elements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      
      // Skip hidden elements
      if (htmlElement.offsetParent === null) return;
      
      // Skip elements with display: none
      const style = window.getComputedStyle(htmlElement);
      if (style.display === 'none' || style.visibility === 'hidden') return;

      let type: FocusableElement['type'] = 'link';
      let text = htmlElement.textContent || htmlElement.getAttribute('aria-label') || '';
      let href: string | undefined;

      if (htmlElement.tagName === 'A') {
        type = 'link';
        href = htmlElement.getAttribute('href') || undefined;
      } else if (htmlElement.tagName === 'BUTTON') {
        type = 'button';
      } else if (htmlElement.tagName === 'INPUT' || htmlElement.tagName === 'TEXTAREA') {
        type = 'input';
      } else if (htmlElement.tagName.match(/^H[1-6]$/)) {
        type = 'heading';
      }

      focusableElements.push({
        element: htmlElement,
        index,
        type,
        text: text.trim(),
        href
      });
    });

    return focusableElements;
  };

  // Update element positions when needed
  const updateElementPositions = () => {
    const elements = findFocusableElements();
    setFocusableElements(elements);
  };

  // Handle focus changes
  const handleFocusChange = (event: FocusEvent) => {
    const target = event.target as HTMLElement;
    const index = focusableElements.findIndex(el => el.element === target);
    setFocusedIndex(index);
  };

  // Initialize
  useEffect(() => {
    updateElementPositions();

    // Set up mutation observer to watch for DOM changes
    observerRef.current = new MutationObserver(() => {
      updateElementPositions();
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'hidden', 'aria-hidden']
    });

    // Listen for focus events
    document.addEventListener('focusin', handleFocusChange);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      document.removeEventListener('focusin', handleFocusChange);
    };
  }, []);

  // Update positions when window resizes
  useEffect(() => {
    const handleResize = () => {
      updateElementPositions();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <LinkNumberOverlay visible={showNumbers}>
      {focusableElements.map((element, index) => {
        const rect = element.element.getBoundingClientRect();
        const isFocused = index === focusedIndex;

        return (
          <LinkNumber
            key={`${element.type}-${index}`}
            $isFocused={isFocused}
            style={{
              left: rect.left + rect.width / 2,
              top: rect.top + rect.height / 2,
            }}
            onClick={() => onElementFocus(index)}
          >
            {index + 1}
          </LinkNumber>
        );
      })}
    </LinkNumberOverlay>
  );
};

export default LinkIndexer;
