# Contributing to Gesture & Voice-Controlled Navigation Interface

Thank you for your interest in contributing to this accessibility-focused project! This guide will help you get started.

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/gesture-voice-navigation.git
   cd gesture-voice-navigation
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Start development server**
   ```bash
   npm start
   ```

## 🎯 Development Guidelines

### Code Style
- Use **TypeScript** for all new code
- Follow **ESLint** rules (run `npm run lint` to check)
- Use **Prettier** for code formatting
- Write **descriptive commit messages**

### Testing
- Write tests for new features
- Ensure accessibility compliance
- Test on multiple browsers (Chrome, Firefox, Safari)
- Test with screen readers (NVDA, JAWS, VoiceOver)

### Accessibility
- Follow **WCAG 2.1 AA** guidelines
- Use semantic HTML elements
- Provide proper ARIA labels and roles
- Ensure keyboard navigation works
- Test with assistive technologies

## 🐛 Bug Reports

When reporting bugs, please include:
- **Browser and version**
- **Operating system**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Console errors** (if any)
- **Screenshots or videos** (if helpful)

## ✨ Feature Requests

For new features, please:
- Describe the **use case** and **benefit**
- Consider **accessibility implications**
- Check if it aligns with the [roadmap](ROADMAP.md)
- Provide **mockups or examples** if possible

## 🔧 Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code
   - Add tests
   - Update documentation

3. **Test your changes**
   ```bash
   npm test
   npm run test:accessibility
   npm run cypress:open
   ```

4. **Commit your changes**
   ```bash
   git commit -m "feat: add new voice command support"
   ```

5. **Push and create a PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Commit Message Format

Use conventional commit format:
```
type(scope): description

feat(voice): add multi-language support
fix(gesture): resolve camera permission issue
docs(readme): update installation instructions
test(accessibility): add screen reader tests
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 🧪 Testing Guidelines

### Unit Tests
- Test individual components and hooks
- Mock external dependencies
- Test edge cases and error conditions

### Integration Tests
- Test component interactions
- Test voice and gesture workflows
- Test PDF navigation features

### Accessibility Tests
- Run axe-core tests
- Test with keyboard navigation
- Verify screen reader compatibility
- Check color contrast ratios

### Manual Testing
- Test on different devices and browsers
- Test with various lighting conditions
- Test with different microphone/camera setups
- Test with assistive technologies

## 📚 Documentation

When adding new features:
- Update the README.md if needed
- Add JSDoc comments to functions
- Update the ROADMAP.md if applicable
- Create or update relevant documentation

## 🤝 Code Review Process

1. **Self-review** your changes before submitting
2. **Request review** from maintainers
3. **Address feedback** promptly
4. **Merge** when approved

## 🎉 Recognition

Contributors will be:
- Listed in the README.md
- Mentioned in release notes
- Invited to join the maintainer team (for significant contributions)

## 📞 Getting Help

- **Issues**: Use GitHub Issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Email**: Contact maintainers directly for sensitive issues

Thank you for helping make the web more accessible! 🌟
