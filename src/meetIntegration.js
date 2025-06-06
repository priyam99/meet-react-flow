
// Google Meet UI integration
class MeetIntegration {
  constructor() {
    this.toggleButton = null;
    this.isEnabled = false;
    this.onToggle = null;
  }
  
  async init() {
    await this.createToggleButton();
    console.log('Meet Integration: Initialized');
  }
  
  async createToggleButton() {
    // Wait for Meet's control bar to load
    const controlBar = await this.waitForElement([
      '[data-call-id] [role="toolbar"]',
      '[jsname="A5il2e"]',
      '.VfPpkd-LgbsSe-OWXEXe-dgl2Hf'
    ]);
    
    if (!controlBar) {
      console.warn('Meet Integration: Control bar not found');
      return;
    }
    
    // Create toggle button
    this.toggleButton = document.createElement('button');
    this.toggleButton.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 20px;">👋</span>
        <span style="font-size: 12px; font-weight: 500;">Gestures</span>
      </div>
    `;
    
    this.toggleButton.style.cssText = `
      background: #1a73e8;
      border: none;
      border-radius: 20px;
      color: white;
      padding: 8px 16px;
      margin: 0 8px;
      cursor: pointer;
      font-family: 'Google Sans', sans-serif;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    `;
    
    // Add hover effects
    this.toggleButton.addEventListener('mouseenter', () => {
      this.toggleButton.style.transform = 'scale(1.05)';
      this.toggleButton.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    });
    
    this.toggleButton.addEventListener('mouseleave', () => {
      this.toggleButton.style.transform = 'scale(1)';
      this.toggleButton.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
    });
    
    // Add click handler
    this.toggleButton.addEventListener('click', () => {
      this.toggle();
    });
    
    // Insert button into control bar
    controlBar.appendChild(this.toggleButton);
    
    console.log('Meet Integration: Toggle button created');
  }
  
  async waitForElement(selectors, timeout = 10000) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const check = () => {
        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element) {
            resolve(element);
            return;
          }
        }
        
        if (Date.now() - startTime > timeout) {
          resolve(null);
          return;
        }
        
        setTimeout(check, 500);
      };
      
      check();
    });
  }
  
  toggle() {
    this.isEnabled = !this.isEnabled;
    
    // Update button appearance
    if (this.isEnabled) {
      this.toggleButton.style.background = '#34a853';
      this.toggleButton.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">🎉</span>
          <span style="font-size: 12px; font-weight: 500;">ON</span>
        </div>
      `;
    } else {
      this.toggleButton.style.background = '#5f6368';
      this.toggleButton.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">👋</span>
          <span style="font-size: 12px; font-weight: 500;">OFF</span>
        </div>
      `;
    }
    
    // Trigger callback
    if (this.onToggle) {
      this.onToggle(this.isEnabled);
    }
    
    // Show feedback
    this.showFeedback();
    
    console.log('Meet Integration: Gestures', this.isEnabled ? 'enabled' : 'disabled');
  }
  
  showFeedback() {
    const feedback = document.createElement('div');
    feedback.textContent = this.isEnabled ? 
      'Gesture reactions enabled! 👋' : 
      'Gesture reactions disabled';
    
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${this.isEnabled ? '#34a853' : '#5f6368'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-family: 'Google Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      z-index: 10002;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(feedback);
    
    // Animate in
    gsap.fromTo(feedback, 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.3, ease: "back.out" }
    );
    
    // Remove after delay
    setTimeout(() => {
      gsap.to(feedback, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "back.in",
        onComplete: () => feedback.remove()
      });
    }, 2000);
  }
}
