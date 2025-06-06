
// Main content script that initializes the extension
(function() {
  'use strict';
  
  console.log('Meet Gesture Reactions: Initializing...');
  
  let gestureDetector = null;
  let emojiRenderer = null;
  let meetIntegration = null;
  let isEnabled = false;
  
  // Wait for Meet to fully load
  function waitForMeet() {
    return new Promise((resolve) => {
      const checkMeet = () => {
        const meetContainer = document.querySelector('[data-call-id]') || 
                            document.querySelector('[jsname="HKfGHc"]') ||
                            document.querySelector('.u6vdEc');
        
        if (meetContainer) {
          console.log('Meet Gesture Reactions: Meet interface detected');
          resolve();
        } else {
          setTimeout(checkMeet, 1000);
        }
      };
      checkMeet();
    });
  }
  
  // Initialize all components
  async function initialize() {
    try {
      await waitForMeet();
      
      // Initialize components
      emojiRenderer = new EmojiRenderer();
      gestureDetector = new GestureDetector();
      meetIntegration = new MeetIntegration();
      
      // Set up gesture detection callbacks
      gestureDetector.onGestureDetected = (gesture) => {
        if (isEnabled) {
          emojiRenderer.triggerEmoji(gesture);
        }
      };
      
      // Set up meet integration callbacks
      meetIntegration.onToggle = (enabled) => {
        isEnabled = enabled;
        if (enabled) {
          gestureDetector.start();
        } else {
          gestureDetector.stop();
        }
      };
      
      // Initialize meet integration
      await meetIntegration.init();
      
      console.log('Meet Gesture Reactions: Successfully initialized');
    } catch (error) {
      console.error('Meet Gesture Reactions: Initialization failed', error);
    }
  }
  
  // Start initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // Handle navigation in Meet (SPA)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(initialize, 2000); // Reinitialize after navigation
    }
  }).observe(document, { subtree: true, childList: true });
})();
