export type GestureType = 
  | 'swipe_up' 
  | 'swipe_down' 
  | 'swipe_left' 
  | 'swipe_right'
  | 'pinch' 
  | 'thumbs_up' 
  | 'point' 
  | 'fist' 
  | 'open_palm';

export type ScrollDirection = 'up' | 'down';
export type ZoomDirection = 'in' | 'out';

export interface NavigationCommand {
  type: 'scroll' | 'zoom' | 'openLink' | 'toggleLinks' | 'activate' | 'loadPdf' | 'closePdf' | 'nextPage' | 'prevPage' | 'goToPage' | 'loadSamplePdf' | 'loadTestPdf';
  direction?: ScrollDirection | ZoomDirection;
  linkIndex?: number;
  pageNumber?: number;
  text: string;
}

export interface GestureData {
  type: GestureType;
  confidence: number;
  landmarks?: number[][];
  timestamp: number;
}

export interface VoiceCommand {
  text: string;
  confidence: number;
  timestamp: number;
}

export interface FocusableElement {
  element: HTMLElement;
  index: number;
  type: 'link' | 'button' | 'input' | 'heading';
  text: string;
  href?: string;
}

export interface PdfDocument {
  url: string;
  title: string;
  pageCount: number;
  currentPage: number;
}

export interface AccessibilityFeatures {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
}
