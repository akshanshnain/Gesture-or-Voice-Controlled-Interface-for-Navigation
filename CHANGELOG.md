# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2024-12-19

### Added
- **Complete project scaffold** with React + TypeScript
- **Voice recognition** using Web Speech API
- **Gesture recognition** using MediaPipe Tasks Vision
- **PDF viewer** with pdf.js integration
- **Accessibility features** with ARIA compliance
- **Focus management** system for keyboard navigation
- **Link indexing** with numbered overlays
- **Live feedback** overlay for commands and gestures

### Enhanced
- **README clarity** - One-paragraph overview with exact install/run commands
- **Privacy note** - Clear statement about on-device processing
- **Troubleshooting section** - Browser support, permissions, performance tips
- **Sample PDFs** - Added `/public/samples/` directory with placeholder files
- **Documentation** - Comprehensive contributing guide and roadmap

### Fixed
- **PDF navigation** - Voice commands for "next page" and "previous page" now work
- **Local PDF loading** - Updated to use local sample PDFs instead of external URLs
- **TypeScript errors** - Resolved ref forwarding issues in PdfViewer component

### Documentation
- **MIT License** - Added proper licensing
- **ROADMAP.md** - Detailed development roadmap with short/medium/long term goals
- **CONTRIBUTING.md** - Comprehensive contribution guidelines
- **CHANGELOG.md** - This changelog file

### Repository Structure
```
├── README.md              # Clear overview with quick start
├── LICENSE                # MIT License
├── ROADMAP.md             # Development roadmap
├── CONTRIBUTING.md        # Contribution guidelines
├── CHANGELOG.md           # This changelog
├── public/
│   └── samples/           # Sample PDF files
│       ├── sample-1.pdf
│       ├── sample-2.pdf
│       ├── sample-3.pdf
│       └── README.md
└── src/                   # Source code
```

## [0.1.0] - 2024-12-18

### Initial Release
- Basic voice and gesture recognition
- PDF viewer integration
- Accessibility features
- Focus management system
