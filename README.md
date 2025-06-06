
# Meet Gesture Reactions Chrome Extension

A Chrome extension that enhances Google Meet with real-time hand gesture recognition and floating emoji reactions.

## Features

- 🤚 **Real-time Gesture Detection**: Uses MediaPipe Hands to detect thumbs up, peace sign, and wave gestures
- 🎉 **Floating Emoji Animations**: Beautiful GSAP-powered animations with physics-based movement
- 🎮 **Easy Toggle Control**: Integrated button in Google Meet's interface
- 🔒 **Secure & Private**: All processing happens locally, no data sent to servers
- 📱 **Responsive Design**: Works on all screen sizes and devices

## Supported Gestures

| Gesture | Emoji Reactions |
|---------|----------------|
| 👍 Thumbs Up | 👍 🔥 💪 ✨ |
| ✌️ Peace Sign | ✌️ 😎 🌟 🎉 |
| 👋 Wave | 👋 😊 💫 🌈 |

## Installation

1. Download the extension files
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. Join a Google Meet call
6. Look for the "Gestures" button in the Meet control bar

## Usage

1. **Enable**: Click the "Gestures" button in Google Meet
2. **Gesture**: Show hand gestures to your camera
3. **Enjoy**: Watch beautiful emoji reactions float across the screen!

## Technical Architecture

### Core Components

- **`contentScript.js`**: Main orchestrator that initializes all components
- **`gestureDetector.js`**: MediaPipe Hands integration for real-time gesture recognition
- **`emojiRenderer.js`**: GSAP-powered animation system for floating emojis
- **`meetIntegration.js`**: Google Meet UI integration and controls

### Gesture Recognition

The extension uses MediaPipe Hands for accurate hand landmark detection:

- **21 hand landmarks** tracked in real-time
- **Custom gesture algorithms** for recognizing specific poses
- **Debouncing** to prevent spam reactions
- **Multi-hand support** for advanced gestures

### Animation System

GSAP powers smooth, physics-based animations:

- **Randomized trajectories** for natural movement
- **Gesture-specific animations** (bounce, rotation, scaling)
- **Performance optimized** with requestAnimationFrame
- **Automatic cleanup** to prevent memory leaks

## Expanding Gestures

To add new gestures:

1. **Add recognition logic** in `gestureDetector.js`:
```javascript
recognizeGesture(landmarks) {
  // Add your gesture detection logic
  if (this.isCustomGesture(landmarks)) {
    return 'customGesture';
  }
}
```

2. **Add emoji mapping** in `emojiRenderer.js`:
```javascript
this.emojiMap = {
  customGesture: ['🎯', '⚡', '🚀', '💥']
};
```

3. **Add animation style** in `animateEmoji()`:
```javascript
case 'customGesture':
  tl.to(element, {
    // Custom animation properties
  });
  break;
```

## Browser Compatibility

- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Opera 74+
- ❌ Firefox (Manifest V3 support pending)
- ❌ Safari (WebExtensions API limitations)

## Privacy & Security

- **Local processing only**: All gesture detection happens in your browser
- **No data collection**: Extension doesn't store or transmit personal data
- **Minimal permissions**: Only requires access to Google Meet pages
- **Open source**: Code is fully auditable and transparent

## Performance

- **60 FPS gesture detection** on modern hardware
- **Optimized animations** with hardware acceleration
- **Memory efficient** with automatic cleanup
- **Low CPU usage** with smart frame processing

## Troubleshooting

**Gestures not detected?**
- Ensure good lighting and clear hand visibility
- Check camera permissions in Chrome
- Try different hand positions and angles

**Button not appearing?**
- Refresh the Meet page
- Check if extension is enabled
- Look in different areas of the control bar

**Poor performance?**
- Close other tabs and applications
- Reduce gesture sensitivity in settings
- Use a faster computer or better camera

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your improvements
4. Test thoroughly in Google Meet
5. Submit a pull request

## License

MIT License - feel free to use and modify for your projects!

## Credits

- **MediaPipe** for hand tracking technology
- **GSAP** for smooth animations
- **Google Meet** for the awesome video platform
- **Community** for feature requests and feedback
