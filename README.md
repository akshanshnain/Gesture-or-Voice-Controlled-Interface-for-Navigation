# Gesture or Voice-Controlled Interface for Navigation

A hands-free navigation prototype that enables users to interact with websites and documents using either:
- **Voice commands** (via Web Speech API)
- **Hand gestures** (via MediaPipe/OpenCV)

🎯 **Goal**: Improve accessibility for people with limited mobility by providing an alternative to keyboard and mouse navigation.

## ✨ Features

### Voice Commands
- **Scroll**: "Scroll up" / "Scroll down" - Navigate through content
- **Zoom**: "Zoom in" / "Zoom out" - Adjust page zoom level
- **Link Navigation**: "Open link [number]" - Focus on specific link by number
- **Toggle**: "Show links" / "Toggle links" - Display/hide link numbers
- **Activation**: "Activate" / "Click" - Click the currently focused element

### Gesture Controls
- **Swipe up/down** - Scroll through content
- **Pinch** - Toggle link number display
- **Thumbs up** - Activate focused item
- **Point** - Select elements (future enhancement)
- **Open palm** - General navigation gesture

### Accessibility Features
- **ARIA-compliant focus management** with visible focus ring
- **Live on-screen feedback** (command transcript + gesture overlay)
- **Link indexing** with numbered overlays for easy selection
- **Screen reader support** with proper announcements
- **Keyboard navigation** fallback for all features

### PDF Support
- **pdf.js integration** for viewing PDF documents
- **Voice-controlled PDF navigation** (page turning, zoom)
- **Gesture-controlled PDF interaction**

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript
- **Styling**: Styled Components
- **Voice Recognition**: Web Speech API
- **Gesture Recognition**: MediaPipe Hands / OpenCV
- **PDF Viewer**: pdf.js
- **Testing**: Cypress + axe-core for accessibility testing
- **Build Tool**: Create React App

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern browser with Web Speech API support
- Camera access for gesture recognition

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gesture-voice-navigation.git
   cd gesture-voice-navigation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Usage

#### Voice Control
1. Click the microphone button (🎤) in the bottom-left corner
2. Grant microphone permissions when prompted
3. Speak commands like:
   - "Scroll down"
   - "Zoom in"
   - "Show links"
   - "Open link 3"
   - "Activate"

#### Gesture Control
1. Click the hand button (👋) next to the microphone
2. Grant camera permissions when prompted
3. Use hand gestures:
   - **Swipe up/down** to scroll
   - **Pinch** to toggle link numbers
   - **Thumbs up** to activate focused element

#### Keyboard Navigation
- Use **Tab** to navigate between focusable elements
- Use **Enter** or **Space** to activate elements
- Use **Arrow keys** for additional navigation

## 🧪 Testing

### Run Accessibility Tests
```bash
npm run test:accessibility
```

### Run All Tests
```bash
npm test
```

### Run Cypress Tests
```bash
npm run cypress:open
```

## 📁 Project Structure

```
src/
├── components/
│   ├── VoiceController.tsx    # Voice command interface
│   ├── GestureController.tsx  # Hand gesture interface
│   ├── Overlay.tsx           # Live feedback display
│   ├── LinkIndexer.tsx       # Link numbering system
│   └── PdfViewer.tsx         # PDF document viewer
├── hooks/
│   ├── useSpeechRecognition.ts    # Web Speech API integration
│   ├── useGestureRecognition.ts   # MediaPipe gesture detection
│   └── useFocusManagement.ts      # ARIA focus management
├── types/
│   └── index.ts              # TypeScript type definitions
└── App.tsx                   # Main application component
```

## 🔧 Configuration

### Voice Recognition
The voice recognition system uses the Web Speech API and supports:
- Continuous listening mode
- Interim results for real-time feedback
- English language recognition
- Custom command processing

### Gesture Recognition
The gesture system uses MediaPipe Hands for:
- Real-time hand tracking
- Multiple gesture detection
- Confidence scoring
- Camera feed processing

### Accessibility
The application follows WCAG 2.1 guidelines with:
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast focus indicators

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [MediaPipe](https://mediapipe.dev/) for hand gesture recognition
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for voice recognition
- [pdf.js](https://mozilla.github.io/pdf.js/) for PDF rendering
- [axe-core](https://github.com/dequelabs/axe-core) for accessibility testing

## 🐛 Known Issues

- Voice recognition requires HTTPS in production
- Gesture recognition works best with good lighting
- PDF viewer may have performance issues with large documents
- Some browsers may have limited Web Speech API support

## 🔮 Future Enhancements

- [ ] Multi-language voice support
- [ ] Advanced gesture recognition (sign language)
- [ ] Eye tracking integration
- [ ] Mobile app version
- [ ] Offline voice processing
- [ ] Custom gesture training
- [ ] Integration with assistive technologies
