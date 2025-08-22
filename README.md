# Gesture & Voice-Controlled Navigation Interface

A hands-free web navigation prototype that enables users to browse websites and PDF documents using voice commands and hand gestures. Built with React, TypeScript, and Web APIs, this application provides an accessible alternative to traditional keyboard and mouse navigation, making web browsing easier for users with limited mobility or those who prefer hands-free interaction.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open http://localhost:3000 in your browser
```

## 🎯 Demo Features

### Voice Commands
- **"Scroll up/down"** - Navigate through content
- **"Zoom in/out"** - Adjust page zoom level  
- **"Show links"** - Display numbered link overlays
- **"Open link 3"** - Focus on specific link by number
- **"Activate"** - Click the currently focused element
- **"Load sample PDF"** - Open a sample PDF document
- **"Next page" / "Previous page"** - Navigate PDF pages

### Hand Gestures
- **Swipe up/down** - Scroll through content
- **Pinch** - Toggle link number display
- **Thumbs up** - Activate focused element

## 📸 Demo Walkthrough

1. **Show Links** → Click microphone, say "Show links" to display numbered overlays
2. **Open Link 3** → Say "Open link 3" to focus on the third link
3. **Next PDF Page** → Load PDF, say "Next page" to navigate
4. **Scroll/Zoom** → Use "Scroll down" or "Zoom in" commands

## 🔒 Privacy

**All processing is on-device; no audio or video media is stored or transmitted.**

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript
- **Voice Recognition**: Web Speech API
- **Gesture Recognition**: MediaPipe Tasks Vision
- **PDF Viewer**: pdf.js
- **Styling**: Styled Components
- **Testing**: Cypress + axe-core

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
│   ├── useGestureRecognition.ts   # Gesture detection
│   └── useFocusManagement.ts      # ARIA focus management
└── types/
    └── index.ts              # TypeScript definitions
```

## 🧪 Testing

```bash
# Run accessibility tests
npm run test:accessibility

# Run all tests
npm test

# Run Cypress tests
npm run cypress:open
```

## 🔧 Troubleshooting

### Browser Support
- **Chrome/Edge**: Full support for voice and gesture features
- **Firefox**: Voice commands work, gesture recognition limited
- **Safari**: Voice commands work, gesture recognition not supported

### Permissions
- **Microphone**: Required for voice commands
- **Camera**: Required for gesture recognition
- **File Access**: Required for PDF uploads

### Performance Tips
- **Good lighting** improves gesture recognition accuracy
- **Clear speech** enhances voice command detection
- **Stable internet** for PDF loading and Web Speech API

### Common Issues
- **"Voice not working"**: Check microphone permissions and HTTPS requirement
- **"Camera black screen"**: Grant camera permissions and check browser support
- **"PDF won't load"**: Try uploading local PDF files instead of external URLs

## 🗺️ Roadmap

- [ ] **Multi-language voice support** (Spanish, French, German)
- [ ] **Advanced gesture recognition** (sign language, custom gestures)
- [ ] **Mobile app version** with native camera integration

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [MediaPipe](https://mediapipe.dev/) for hand gesture recognition
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for voice recognition
- [pdf.js](https://mozilla.github.io/pdf.js/) for PDF rendering
- [axe-core](https://github.com/dequelabs/axe-core) for accessibility testing
