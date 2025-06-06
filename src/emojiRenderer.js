
// Emoji rendering and animation system
class EmojiRenderer {
  constructor() {
    this.container = null;
    this.emojiMap = {
      thumbsUp: ['👍', '🔥', '💪', '✨'],
      peace: ['✌️', '😎', '🌟', '🎉'],
      wave: ['👋', '😊', '💫', '🌈'],
      heart: ['❤️', '💖', '💕', '🥰']
    };
    this.init();
  }
  
  init() {
    // Create emoji container
    this.container = document.createElement('div');
    this.container.id = 'gesture-emoji-container';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 10000;
      overflow: hidden;
    `;
    document.body.appendChild(this.container);
    
    console.log('Emoji Renderer: Initialized');
  }
  
  triggerEmoji(gesture) {
    const emojis = this.emojiMap[gesture];
    if (!emojis) return;
    
    // Create multiple emoji elements
    const count = Math.floor(Math.random() * 3) + 3; // 3-5 emojis
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.createEmojiElement(emojis, gesture);
      }, i * 100);
    }
  }
  
  createEmojiElement(emojis, gesture) {
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const element = document.createElement('div');
    
    element.textContent = emoji;
    element.style.cssText = `
      position: absolute;
      font-size: ${Math.random() * 20 + 30}px;
      pointer-events: none;
      user-select: none;
      z-index: 10001;
    `;
    
    // Random starting position
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + 50;
    
    element.style.left = startX + 'px';
    element.style.top = startY + 'px';
    
    this.container.appendChild(element);
    
    // Animate with GSAP
    this.animateEmoji(element, gesture);
  }
  
  animateEmoji(element, gesture) {
    const endY = -100;
    const endX = parseFloat(element.style.left) + (Math.random() * 200 - 100);
    const duration = Math.random() * 2 + 3; // 3-5 seconds
    
    // Create timeline
    const tl = gsap.timeline({
      onComplete: () => {
        element.remove();
      }
    });
    
    // Main animation based on gesture type
    switch (gesture) {
      case 'thumbsUp':
        tl.to(element, {
          x: endX,
          y: endY,
          rotation: Math.random() * 720 - 360,
          scale: 0.5,
          duration: duration,
          ease: "power2.out"
        });
        break;
        
      case 'peace':
        tl.to(element, {
          x: endX,
          y: endY,
          rotation: 360,
          scale: 0.8,
          duration: duration,
          ease: "bounce.out"
        });
        break;
        
      case 'wave':
        tl.to(element, {
          x: endX,
          y: endY,
          rotation: Math.sin(Date.now() * 0.01) * 30,
          scale: 0.6,
          duration: duration,
          ease: "sine.inOut"
        });
        break;
        
      case 'heart':
        tl.to(element, {
          x: endX,
          y: endY,
          scale: 1.2,
          duration: duration * 0.3,
          ease: "back.out"
        })
        .to(element, {
          scale: 0,
          duration: duration * 0.7,
          ease: "power2.in"
        });
        break;
        
      default:
        tl.to(element, {
          x: endX,
          y: endY,
          scale: 0.5,
          duration: duration,
          ease: "power2.out"
        });
    }
    
    // Add floating effect
    tl.to(element, {
      x: `+=${Math.sin(Date.now() * 0.01) * 50}`,
      duration: duration,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    }, 0);
    
    // Fade out
    tl.to(element, {
      opacity: 0,
      duration: duration * 0.3,
      ease: "power2.in"
    }, duration * 0.7);
  }
}
