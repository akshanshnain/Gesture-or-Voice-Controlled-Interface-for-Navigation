import { useState, useEffect, useCallback, useRef } from 'react';
import { FocusableElement } from '../types';

interface FocusManagementHook {
  focusedElement: HTMLElement | null;
  focusableElements: FocusableElement[];
  focusNextElement: () => void;
  focusPreviousElement: () => void;
  focusElementByIndex: (index: number) => void;
  scrollToElement: (element: HTMLElement) => void;
  refreshFocusableElements: () => void;
}

export const useFocusManagement = (): FocusManagementHook => {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);
  const [focusableElements, setFocusableElements] = useState<FocusableElement[]>([]);
  const [currentFocusIndex, setCurrentFocusIndex] = useState<number>(-1);
  const observerRef = useRef<MutationObserver | null>(null);

  // Find all focusable elements on the page
  const findFocusableElements = useCallback((): FocusableElement[] => {
    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
      'h1, h2, h3, h4, h5, h6'
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
  }, []);

  // Refresh focusable elements when DOM changes
  const refreshFocusableElements = useCallback(() => {
    const elements = findFocusableElements();
    setFocusableElements(elements);
    
    // Update current focus index if needed
    if (focusedElement) {
      const newIndex = elements.findIndex(el => el.element === focusedElement);
      setCurrentFocusIndex(newIndex >= 0 ? newIndex : -1);
    }
  }, [findFocusableElements]); // Removed focusedElement dependency

  // Focus next element
  const focusNextElement = useCallback(() => {
    if (focusableElements.length === 0) return;

    const nextIndex = currentFocusIndex < focusableElements.length - 1 
      ? currentFocusIndex + 1 
      : 0;
    
    const nextElement = focusableElements[nextIndex];
    if (nextElement) {
      nextElement.element.focus();
      setFocusedElement(nextElement.element);
      setCurrentFocusIndex(nextIndex);
      scrollToElement(nextElement.element);
    }
  }, [focusableElements, currentFocusIndex]);

  // Focus previous element
  const focusPreviousElement = useCallback(() => {
    if (focusableElements.length === 0) return;

    const prevIndex = currentFocusIndex > 0 
      ? currentFocusIndex - 1 
      : focusableElements.length - 1;
    
    const prevElement = focusableElements[prevIndex];
    if (prevElement) {
      prevElement.element.focus();
      setFocusedElement(prevElement.element);
      setCurrentFocusIndex(prevIndex);
      scrollToElement(prevElement.element);
    }
  }, [focusableElements, currentFocusIndex]);

  // Focus element by index
  const focusElementByIndex = useCallback((index: number) => {
    if (index >= 0 && index < focusableElements.length) {
      const element = focusableElements[index];
      element.element.focus();
      setFocusedElement(element.element);
      setCurrentFocusIndex(index);
      scrollToElement(element.element);
    }
  }, [focusableElements]);

  // Scroll element into view
  const scrollToElement = useCallback((element: HTMLElement) => {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    });
  }, []);

  // Handle focus changes
  const handleFocusChange = useCallback((event: FocusEvent) => {
    const target = event.target as HTMLElement;
    setFocusedElement(target);
    
    const index = focusableElements.findIndex(el => el.element === target);
    setCurrentFocusIndex(index);
  }, [focusableElements]);

  // Initialize focus management
  useEffect(() => {
    // Initial scan for focusable elements
    refreshFocusableElements();

    // Set up mutation observer to watch for DOM changes
    observerRef.current = new MutationObserver(() => {
      refreshFocusableElements();
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
  }, []); // Removed dependencies to prevent infinite loop

  return {
    focusedElement,
    focusableElements,
    focusNextElement,
    focusPreviousElement,
    focusElementByIndex,
    scrollToElement,
    refreshFocusableElements,
  };
};
