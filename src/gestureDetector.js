// Gesture detection using MediaPipe Hands
class GestureDetector {
  constructor() {
    this.hands = null;
    this.camera = null;
    this.videoElement = null;
    this.canvasElement = null;
    this.isRunning = false;
    this.onGestureDetected = null;
    this.lastGestureTime = {};
    this.gestureThreshold = 1000; // Minimum time between same gestures (ms)
  }
  
  async init() {
    try {
      // Create hidden video element for camera feed
      this.videoElement = document.createElement('video');
      this.videoElement.style.display = 'none';
      this.videoElement.autoplay = true;
      this.videoElement.muted = true;
      document.body.appendChild(this.videoElement);
      
      // Create hidden canvas for processing
      this.canvasElement = document.createElement('canvas');
      this.canvasElement.style.display = 'none';
      document.body.appendChild(this.canvasElement);
      
      // Initialize MediaPipe Hands
      this.hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });
      
      this.hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      
      this.hands.onResults(this.onResults.bind(this));
      
      console.log('Gesture Detector: Initialized');
    } catch (error) {
      console.error('Gesture Detector: Initialization failed', error);
    }
  }
  
  async start() {
    if (this.isRunning) return;
    
    try {
      await this.init();
      
      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      
      this.videoElement.srcObject = stream;
      this.isRunning = true;
      
      // Start processing
      this.processFrame();
      
      console.log('Gesture Detector: Started');
    } catch (error) {
      console.error('Gesture Detector: Failed to start', error);
    }
  }
  
  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    
    // Stop camera stream
    if (this.videoElement && this.videoElement.srcObject) {
      const tracks = this.videoElement.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      this.videoElement.srcObject = null;
    }
    
    console.log('Gesture Detector: Stopped');
  }
  
  async processFrame() {
    if (!this.isRunning) return;
    
    if (this.videoElement.readyState >= 2) {
      await this.hands.send({ image: this.videoElement });
    }
    
    requestAnimationFrame(() => this.processFrame());
  }
  
  onResults(results) {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      return;
    }
    
    for (const landmarks of results.multiHandLandmarks) {
      const gesture = this.recognizeGesture(landmarks);
      if (gesture) {
        this.triggerGesture(gesture);
      }
    }
  }
  
  recognizeGesture(landmarks) {
    // Landmark indices for finger tips and joints
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];
    
    const indexPip = landmarks[6];
    const middlePip = landmarks[10];
    const ringPip = landmarks[14];
    const pinkyPip = landmarks[18];
    
    // Check for thumbs up
    if (this.isThumbsUp(landmarks)) {
      return 'thumbsUp';
    }
    
    // Check for peace sign
    if (this.isPeaceSign(landmarks)) {
      return 'peace';
    }
    
    // Check for wave
    if (this.isWave(landmarks)) {
      return 'wave';
    }
    
    // Check for heart (two hands together)
    if (this.isHeart(landmarks)) {
      return 'heart';
    }
    
    return null;
  }
  
  isThumbsUp(landmarks) {
    const thumbTip = landmarks[4];
    const thumbMcp = landmarks[2];
    const indexMcp = landmarks[5];
    const indexPip = landmarks[6];
    const indexTip = landmarks[8];
    
    // Thumb is extended upward
    const thumbExtended = thumbTip.y < thumbMcp.y;
    
    // Other fingers are folded
    const indexFolded = indexTip.y > indexPip.y;
    const middleFolded = landmarks[12].y > landmarks[10].y;
    const ringFolded = landmarks[16].y > landmarks[14].y;
    const pinkyFolded = landmarks[20].y > landmarks[18].y;
    
    return thumbExtended && indexFolded && middleFolded && ringFolded && pinkyFolded;
  }
  
  isPeaceSign(landmarks) {
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const indexPip = landmarks[6];
    const middlePip = landmarks[10];
    
    // Index and middle fingers extended
    const indexExtended = indexTip.y < indexPip.y;
    const middleExtended = middleTip.y < middlePip.y;
    
    // Ring and pinky folded
    const ringFolded = landmarks[16].y > landmarks[14].y;
    const pinkyFolded = landmarks[20].y > landmarks[18].y;
    
    // Fingers are separated
    const fingersSpread = Math.abs(indexTip.x - middleTip.x) > 0.05;
    
    return indexExtended && middleExtended && ringFolded && pinkyFolded && fingersSpread;
  }
  
  isWave(landmarks) {
    // Simple wave detection based on hand movement
    const wrist = landmarks[0];
    const fingertips = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
    
    // All fingertips should be above wrist (hand open)
    const handOpen = fingertips.every(tip => tip.y < wrist.y + 0.1);
    
    return handOpen;
  }
  
  isHeart(landmarks) {
    // For now, use thumbs up as heart gesture
    // This could be expanded for two-hand heart detection
    return false;
  }
  
  triggerGesture(gesture) {
    const now = Date.now();
    const lastTime = this.lastGestureTime[gesture] || 0;
    
    if (now - lastTime > this.gestureThreshold) {
      this.lastGestureTime[gesture] = now;
      
      if (this.onGestureDetected) {
        this.onGestureDetected(gesture);
      }
      
      console.log('Gesture detected:', gesture);
    }
  }
}
