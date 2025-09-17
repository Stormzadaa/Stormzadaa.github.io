// ========================================
// CAROUSEL PERFORMANCE MONITOR
// ========================================

class CarouselPerformanceMonitor {
  constructor() {
    this.metrics = {
      frameRate: [],
      cpuUsage: [],
      memoryUsage: [],
      animationFrameTime: [],
      carouselUpdates: 0,
      droppedFrames: 0,
      isMonitoring: false
    };
    
    this.lastFrameTime = performance.now();
    this.targetFPS = 60;
    this.frameThreshold = 1000 / this.targetFPS; // 16.67ms for 60fps
    
    this.startTime = 0;
    this.frameCount = 0;
    
    // Create performance overlay
    this.createOverlay();
  }

  createOverlay() {
    // Create performance overlay UI
    const overlay = document.createElement('div');
    overlay.id = 'perf-monitor';
    overlay.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: #00ff00;
      padding: 15px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      z-index: 10000;
      max-width: 300px;
      backdrop-filter: blur(5px);
      display: none;
    `;
    
    overlay.innerHTML = `
      <div style="margin-bottom: 10px; font-weight: bold; color: #00ffff;">
        🔍 CAROUSEL PERFORMANCE MONITOR
      </div>
      <div id="perf-stats"></div>
      <div style="margin-top: 10px;">
        <button id="start-monitor" style="margin-right: 5px; padding: 5px 10px; background: #007700; color: white; border: none; border-radius: 3px; cursor: pointer;">Start</button>
        <button id="stop-monitor" style="margin-right: 5px; padding: 5px 10px; background: #770000; color: white; border: none; border-radius: 3px; cursor: pointer;">Stop</button>
        <button id="export-data" style="padding: 5px 10px; background: #000077; color: white; border: none; border-radius: 3px; cursor: pointer;">Export</button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Add control buttons
    document.getElementById('start-monitor').addEventListener('click', () => this.startMonitoring());
    document.getElementById('stop-monitor').addEventListener('click', () => this.stopMonitoring());
    document.getElementById('export-data').addEventListener('click', () => this.exportData());
    
    // Toggle overlay with Ctrl+Shift+P
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
      }
    });
  }

  startMonitoring() {
    if (this.metrics.isMonitoring) return;
    
    this.metrics.isMonitoring = true;
    this.startTime = performance.now();
    this.frameCount = 0;
    
    // Reset metrics
    Object.keys(this.metrics).forEach(key => {
      if (Array.isArray(this.metrics[key])) {
        this.metrics[key] = [];
      }
    });
    this.metrics.carouselUpdates = 0;
    this.metrics.droppedFrames = 0;
    
    console.log('🔍 Starting carousel performance monitoring...');
    
    // Monitor animation frames
    this.monitorAnimationFrames();
    
    // Monitor memory usage
    this.monitorMemory();
    
    // Hook into carousel animation
    this.hookCarouselAnimation();
    
    // Update display every second
    this.displayInterval = setInterval(() => this.updateDisplay(), 1000);
  }

  stopMonitoring() {
    if (!this.metrics.isMonitoring) return;
    
    this.metrics.isMonitoring = false;
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    if (this.displayInterval) {
      clearInterval(this.displayInterval);
    }
    
    console.log('🛑 Performance monitoring stopped');
    this.generateReport();
  }

  monitorAnimationFrames() {
    const monitor = (currentTime) => {
      if (!this.metrics.isMonitoring) return;
      
      this.frameCount++;
      
      // Calculate frame time
      const frameTime = currentTime - this.lastFrameTime;
      this.metrics.animationFrameTime.push(frameTime);
      
      // Check for dropped frames
      if (frameTime > this.frameThreshold * 1.5) {
        this.metrics.droppedFrames++;
      }
      
      // Calculate FPS
      const fps = 1000 / frameTime;
      this.metrics.frameRate.push(fps);
      
      this.lastFrameTime = currentTime;
      this.animationFrameId = requestAnimationFrame(monitor);
    };
    
    this.animationFrameId = requestAnimationFrame(monitor);
  }

  monitorMemory() {
    if (!performance.memory) return;
    
    const memoryCheck = () => {
      if (!this.metrics.isMonitoring) return;
      
      const memory = performance.memory;
      this.metrics.memoryUsage.push({
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        timestamp: performance.now()
      });
      
      setTimeout(memoryCheck, 1000);
    };
    
    memoryCheck();
  }

  hookCarouselAnimation() {
    // Hook into the existing carousel animation
    const originalRAF = window.requestAnimationFrame;
    let carouselRAFCount = 0;
    
    window.requestAnimationFrame = (callback) => {
      return originalRAF((time) => {
        carouselRAFCount++;
        if (carouselRAFCount % 10 === 0) { // Sample every 10th frame
          this.metrics.carouselUpdates++;
        }
        return callback(time);
      });
    };
  }

  updateDisplay() {
    const statsDiv = document.getElementById('perf-stats');
    if (!statsDiv) return;
    
    const avgFPS = this.getAverage(this.metrics.frameRate.slice(-60)); // Last 60 frames
    const avgFrameTime = this.getAverage(this.metrics.animationFrameTime.slice(-60));
    const currentMemory = this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1];
    
    let memoryInfo = 'Memory: N/A';
    if (currentMemory) {
      memoryInfo = `Memory: ${(currentMemory.used / 1024 / 1024).toFixed(1)}MB`;
    }
    
    const runTime = ((performance.now() - this.startTime) / 1000).toFixed(1);
    
    statsDiv.innerHTML = `
      <div>📊 Runtime: ${runTime}s</div>
      <div>🎯 FPS: ${avgFPS.toFixed(1)} / ${this.targetFPS}</div>
      <div>⏱️ Frame Time: ${avgFrameTime.toFixed(2)}ms</div>
      <div>⚠️ Dropped Frames: ${this.metrics.droppedFrames}</div>
      <div>🔄 Carousel Updates: ${this.metrics.carouselUpdates}</div>
      <div>💾 ${memoryInfo}</div>
      <div style="margin-top: 5px; font-size: 10px; color: ${avgFPS < 55 ? '#ff6666' : avgFPS < 58 ? '#ffff66' : '#66ff66'}">
        Status: ${avgFPS < 55 ? 'POOR' : avgFPS < 58 ? 'FAIR' : 'GOOD'}
      </div>
    `;
  }

  getAverage(arr) {
    return arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  }

  generateReport() {
    const report = {
      summary: {
        totalRunTime: (performance.now() - this.startTime) / 1000,
        totalFrames: this.frameCount,
        avgFPS: this.getAverage(this.metrics.frameRate),
        minFPS: Math.min(...this.metrics.frameRate),
        maxFPS: Math.max(...this.metrics.frameRate),
        droppedFrames: this.metrics.droppedFrames,
        carouselUpdates: this.metrics.carouselUpdates,
        avgFrameTime: this.getAverage(this.metrics.animationFrameTime)
      },
      recommendations: this.generateRecommendations()
    };
    
    console.log('📊 CAROUSEL PERFORMANCE REPORT:', report);
    return report;
  }

  generateRecommendations() {
    const avgFPS = this.getAverage(this.metrics.frameRate);
    const avgFrameTime = this.getAverage(this.metrics.animationFrameTime);
    const recommendations = [];
    
    if (avgFPS < 55) {
      recommendations.push('🔴 CRITICAL: FPS is below 55. Consider reducing animation complexity.');
    }
    
    if (avgFrameTime > 20) {
      recommendations.push('🟡 WARNING: Frame time is above 20ms. Optimize animation loops.');
    }
    
    if (this.metrics.droppedFrames > this.frameCount * 0.05) {
      recommendations.push('🔴 CRITICAL: More than 5% frames dropped. Check for blocking operations.');
    }
    
    if (this.metrics.carouselUpdates > this.frameCount * 0.8) {
      recommendations.push('🟡 WARNING: High carousel update frequency. Consider throttling.');
    }
    
    return recommendations;
  }

  exportData() {
    const data = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      report: this.generateReport()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carousel-performance-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// ========================================
// QUICK PERFORMANCE TESTS
// ========================================

window.CarouselPerformanceTests = {
  // Test 1: Measure carousel animation overhead
  measureAnimationOverhead: () => {
    console.log('🧪 Testing carousel animation overhead...');
    
    const startTime = performance.now();
    let frameCount = 0;
    const testDuration = 5000; // 5 seconds
    
    const testFrame = () => {
      frameCount++;
      if (performance.now() - startTime < testDuration) {
        requestAnimationFrame(testFrame);
      } else {
        const actualFPS = frameCount / (testDuration / 1000);
        console.log(`📊 Baseline FPS without carousel: ${actualFPS.toFixed(1)}`);
      }
    };
    
    // Stop carousel temporarily
    if (window.CarouselAPI) {
      window.CarouselAPI.stop();
    }
    
    requestAnimationFrame(testFrame);
  },

  // Test 2: Memory leak detection
  detectMemoryLeaks: () => {
    if (!performance.memory) {
      console.log('❌ Memory API not available');
      return;
    }
    
    console.log('🧪 Testing for memory leaks...');
    
    const initialMemory = performance.memory.usedJSHeapSize;
    let measurements = [];
    
    const measure = (iteration) => {
      if (iteration > 10) {
        const finalMemory = performance.memory.usedJSHeapSize;
        const memoryIncrease = finalMemory - initialMemory;
        
        console.log(`📊 Memory change after 10 cycles: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
        
        if (memoryIncrease > 10 * 1024 * 1024) { // 10MB
          console.log('🔴 POTENTIAL MEMORY LEAK DETECTED!');
        } else {
          console.log('✅ No significant memory leaks detected');
        }
        return;
      }
      
      // Force garbage collection if available
      if (window.gc) {
        window.gc();
      }
      
      measurements.push(performance.memory.usedJSHeapSize);
      
      setTimeout(() => measure(iteration + 1), 1000);
    };
    
    measure(0);
  },

  // Test 3: CPU usage estimation
  estimateCPUUsage: () => {
    console.log('🧪 Estimating CPU usage...');
    
    const iterations = 1000000;
    const startTime = performance.now();
    
    // Baseline test
    for (let i = 0; i < iterations; i++) {
      // Empty loop
    }
    
    const baselineTime = performance.now() - startTime;
    
    // Test with carousel running
    const carouselStartTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      // Empty loop while carousel runs
    }
    
    const carouselTime = performance.now() - carouselStartTime;
    
    const overhead = ((carouselTime - baselineTime) / baselineTime) * 100;
    
    console.log(`📊 Estimated CPU overhead: ${overhead.toFixed(2)}%`);
    
    if (overhead > 20) {
      console.log('🔴 HIGH CPU USAGE detected!');
    } else if (overhead > 10) {
      console.log('🟡 MODERATE CPU USAGE detected');
    } else {
      console.log('✅ CPU usage is acceptable');
    }
  }
};

// ========================================
// AUTO-INITIALIZATION
// ========================================

// Initialize performance monitor
window.carouselPerfMonitor = new CarouselPerformanceMonitor();

console.log(`
🔍 CAROUSEL PERFORMANCE MONITOR LOADED!

USAGE:
• Press Ctrl+Shift+P to toggle performance overlay
• Use the Start/Stop buttons to monitor performance
• Export data for detailed analysis

QUICK TESTS:
• CarouselPerformanceTests.measureAnimationOverhead()
• CarouselPerformanceTests.detectMemoryLeaks()  
• CarouselPerformanceTests.estimateCPUUsage()

RECOMMENDATIONS:
${window.carouselPerfMonitor.metrics.isMonitoring ? 'Monitoring is ready!' : 'Press Ctrl+Shift+P and click Start to begin monitoring.'}
`);