// ---- Loading Screen Logic ----
window.addEventListener('load', function() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    // Add fade-out class to trigger transition
    loadingScreen.classList.add('fade-out');
    
    // Remove the element completely after transition and start video
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      
      // Signal that the loading screen is fully gone — theme transitions can now begin
      document.dispatchEvent(new CustomEvent('loadingScreenHidden'));

      // Start video playback on grocery store page after loading screen disappears
      const heroVideo = document.querySelector('.hero-video video');
      if (heroVideo) {
        heroVideo.play().catch(e => {
          // Handle autoplay restrictions gracefully
          console.log('Video autoplay was prevented:', e);
        });
      }
    }, 200); // Match the transition duration in CSS
  } else {
    // No loading screen on this page — signal immediately when window is ready
    document.dispatchEvent(new CustomEvent('loadingScreenHidden'));
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // ---- Infinite Background Loop Animation Logic ----
  const fundoPoligonos = document.querySelector(".fundo-poligonos");
  let bgAnimationFrameId;
  // Use localStorage keys for sync
  const BG_STATE_KEY = "bgIsAnimationRunning";
  const BG_POS_KEY = "bgScrollPosition";

  // Helper: get/set state from localStorage
  function getBgState() {
    const running = localStorage.getItem(BG_STATE_KEY);
    return running === null ? true : running === "true";
  }
  function setBgState(val) {
    localStorage.setItem(BG_STATE_KEY, val ? "true" : "false");
  }
  function getBgPos() {
    const pos = localStorage.getItem(BG_POS_KEY);
    return pos === null ? 0 : parseFloat(pos);
  }
  function setBgPos(val) {
    localStorage.setItem(BG_POS_KEY, val);
  }

  let bgIsAnimationRunning = getBgState();
  let bgScrollPosition = getBgPos();

  if (fundoPoligonos) {
    let bgContentHeight = fundoPoligonos.scrollHeight;
    let bgScrollSpeed = 0.05;

    const fundoClone = fundoPoligonos.cloneNode(true);
    fundoClone.classList.add("fundo-poligonos-clone");
    fundoPoligonos.parentNode.appendChild(fundoClone);

    function scrollBgUp() {
      if (!bgIsAnimationRunning) return;
      bgScrollPosition -= bgScrollSpeed;
      if (bgScrollPosition <= -bgContentHeight) {
        bgScrollPosition = 0;
      }
      fundoPoligonos.style.transform = `translateY(${bgScrollPosition}px)`;
      fundoClone.style.transform = `translateY(${
        bgScrollPosition + bgContentHeight
      }px)`;
      setBgPos(bgScrollPosition); // Save position on every frame
      bgAnimationFrameId = requestAnimationFrame(scrollBgUp);
    }

    // Set initial position from storage
    fundoPoligonos.style.transform = `translateY(${bgScrollPosition}px)`;
    fundoClone.style.transform = `translateY(${
      bgScrollPosition + bgContentHeight
    }px)`;

    // Responsive: update heights and reset position on resize
    window.addEventListener("resize", () => {
      const newBgContentHeight = fundoPoligonos.scrollHeight;
      if (bgContentHeight !== newBgContentHeight) {
        bgContentHeight = newBgContentHeight;
        // Keep the same scroll position ratio
        fundoPoligonos.style.transform = `translateY(${bgScrollPosition}px)`;
        fundoClone.style.transform = `translateY(${
          bgScrollPosition + bgContentHeight
        }px)`;
      }
    });

    // Adjust scroll speed based on screen size
    const bgMediaQuery = window.matchMedia("(max-width: 768px)");
    function updateBgScrollSpeed() {
      bgScrollSpeed = bgMediaQuery.matches ? 0.05 : 0.1;
    }
    bgMediaQuery.addEventListener("change", updateBgScrollSpeed);
    updateBgScrollSpeed();

    // ---- Play/Pause Button for Background Animation Only ----
    const toggleSwitch = document.querySelector(".toggle-switch");
    const playIcon = document.querySelector(".play-icon");
    const pauseIcon = document.querySelector(".pause-icon");

    function updateToggleIcons() {
      if (bgIsAnimationRunning) {
        playIcon.classList.remove("active");
        pauseIcon.classList.add("active");
      } else {
        playIcon.classList.add("active");
        pauseIcon.classList.remove("active");
      }
    }

    if (toggleSwitch && playIcon && pauseIcon) {
      toggleSwitch.addEventListener("click", () => {
        bgIsAnimationRunning = !bgIsAnimationRunning;
        setBgState(bgIsAnimationRunning);
        updateToggleIcons();
        if (bgIsAnimationRunning) {
          scrollBgUp();
        } else {
          cancelAnimationFrame(bgAnimationFrameId);
          setBgPos(bgScrollPosition); // Save position when paused
        }
      });
      updateToggleIcons();
    }

    // Listen for storage changes (sync across tabs/pages)
    window.addEventListener("storage", (e) => {
      if (e.key === BG_STATE_KEY) {
        bgIsAnimationRunning = getBgState();
        updateToggleIcons();
        if (bgIsAnimationRunning) {
          scrollBgUp();
        } else {
          cancelAnimationFrame(bgAnimationFrameId);
        }
      }
      if (e.key === BG_POS_KEY) {
        bgScrollPosition = getBgPos();
        fundoPoligonos.style.transform = `translateY(${bgScrollPosition}px)`;
        fundoClone.style.transform = `translateY(${
          bgScrollPosition + bgContentHeight
        }px)`;
      }
    });

    // Start or pause animation on load
    updateToggleIcons();
    if (bgIsAnimationRunning) {
      scrollBgUp();
    } else {
      cancelAnimationFrame(bgAnimationFrameId);
      fundoPoligonos.style.transform = `translateY(${bgScrollPosition}px)`;
      fundoClone.style.transform = `translateY(${
        bgScrollPosition + bgContentHeight
      }px)`;
    }
  }
  // Removed animated background and play/pause button logic

  // ---- Nav Underline Toggle Logic ----
  const contactLink = document.getElementById("contactLink");
  const contactUnderline = document.getElementById("contactUnderline");
  const workUnderline = document.getElementById("workUnderline");
  const footer = document.querySelector("footer");

  // Check if the current page is index.html
  const isIndexPage =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/";

  contactLink.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    smoothScrollTo(document.body.scrollHeight, 1000); // Scroll to the bottom of the page
  });

  window.addEventListener("scroll", () => {
    const footerRect = footer.getBoundingClientRect();
    const isFooterVisible =
      footerRect.top < window.innerHeight && footerRect.bottom >= 0;

    if (isFooterVisible) {
      contactUnderline.classList.add("active");
    } else {
      contactUnderline.classList.remove("active");
    }

    // Keep "Work" underline always active only on index.html
    if (isIndexPage) {
      workUnderline.classList.add("active");
    } else {
      workUnderline.classList.remove("active");
    }
  });

  // Smooth scroll function
  function smoothScrollTo(target, duration) {
    const start = window.scrollY;
    const distance = target - start;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, start, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }

  // Function to move the toggle-switch into the header for small screens
  function adjustToggleSwitchPlacement() {
    const headerBox = document.querySelector(".headerBox");
    const toggleSwitch = document.querySelector(".toggle-switch");
    const body = document.querySelector(".body");
    const screenWidth = window.innerWidth;

    // Only proceed if all required elements exist
    if (!toggleSwitch) {
      console.log("Toggle switch not found, skipping placement adjustment");
      return;
    }

    if (screenWidth <= 768) {
      // Move toggle-switch into headerBox for mobile screens
      if (headerBox && toggleSwitch && !headerBox.contains(toggleSwitch)) {
        headerBox.appendChild(toggleSwitch);
      }
    } else {
      // Move toggle-switch back to its original position for larger screens
      if (body && toggleSwitch && !body.contains(toggleSwitch)) {
        body.appendChild(toggleSwitch);
      }
    }
  }

  // Call the function initially and whenever the window is resized
  adjustToggleSwitchPlacement();
  window.addEventListener("resize", adjustToggleSwitchPlacement);

  // ============================================================================
  // ---- INFINITE TEXT CAROUSEL ANIMATION LOGIC ----
  // ============================================================================
  
  const carouselContent = document.getElementById("carouselContent");
  
  if (carouselContent) {
    // Configuration
    const config = {
      speed: 0.5, // Base speed (pixels per frame)
      responsive: {
        mobile: { maxWidth: 430, speed: 0.4 },
        tablet: { maxWidth: 768, speed: 0.5 },
        tabletLarge: { maxWidth: 1279, speed: 0.6 },
        desktop: { minWidth: 1280, speed: 0.75 }
      }
    };

    // State variables
    let animationId = null;
    let currentPosition = 0;
    let carouselWidth = 0;
    let containerWidth = 0;
    let speed = config.speed;
    let isRunning = true;
    let isInitialized = false;
    let initializationAttempts = 0;
    
    // Cache DOM elements for performance
    let cachedElements = null;
    let xPositions = [];
    let container = null;
    
    // Track last known mouse position so animate() can detect stale hover
    let lastMouseX = -1;
    let lastMouseY = -1;
    let checkHoverPosition = null; // set by setupHoverEffects
    
    // Track event listeners for cleanup
    let eventListeners = [];

    // Much more aggressive layout detection
    function isLayoutReady() {
      const container = carouselContent.parentElement;
      const contentWidth = carouselContent.offsetWidth;
      const containerWidthCheck = container.offsetWidth;
      const contentHeight = carouselContent.offsetHeight;
      
      // Check computed styles are applied
      const computedStyle = window.getComputedStyle(carouselContent);
      const hasComputedStyles = computedStyle.display !== '' && computedStyle.fontSize !== '';
      
      return (
        contentWidth > 0 && 
        containerWidthCheck > 0 && 
        contentWidth > 100 && 
        contentHeight > 0 &&
        hasComputedStyles
      );
    }

    // Robust initialization with multiple strategies
    function attemptInitialization() {
      initializationAttempts++;
      
      if (isLayoutReady()) {
        actuallyInitialize();
        return true;
      } else if (initializationAttempts < 10) {
        // Try again with increasing delays
        const delay = Math.min(50 + (initializationAttempts * 25), 300);
        setTimeout(attemptInitialization, delay);
        return false;
      } else {
        // Force initialization after reasonable attempts
        actuallyInitialize();
        return true;
      }
    }

    // The actual initialization function
    function actuallyInitialize() {
      if (isInitialized) return;
      
      // Set up the carousel structure
      setupCarousel();
      
      // If dimensions couldn't be measured, retry via attemptInitialization
      if (carouselWidth === 0) {
        if (initializationAttempts < 10) {
          const delay = Math.min(50 + (initializationAttempts * 25), 300);
          setTimeout(attemptInitialization, delay);
        }
        return;
      }
      
      // Set up hover effects
      setupHoverEffects();
      
      // Start animation
      start();
      
      // Mark as initialized
      isInitialized = true;
    }

    // Create seamless infinite effect by duplicating content
    function setupCarousel() {
      container = carouselContent.parentElement;
      
      // Clear any existing clones and click blockers
      const existingClones = container.querySelectorAll('[id*="carouselContentClone"]');
      existingClones.forEach(clone => clone.remove());
      
      const existingBlockers = container.querySelectorAll('[data-carousel-blocker]');
      existingBlockers.forEach(blocker => blocker.remove());
      
      // Make carousel elements completely unclickable with CSS
      container.style.cssText += 'user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;';
      carouselContent.style.cssText += 'user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; pointer-events: none !important;';
      
      // Apply complete unclickable styles to all spans
      const spans = carouselContent.querySelectorAll('span');
      spans.forEach(span => {
        span.style.cssText += 'cursor: default !important; user-select: none !important; -webkit-user-select: none !important; -moz-user-select: none !important; -ms-user-select: none !important; pointer-events: none !important;';
        // Also add data attribute to identify carousel elements
        span.setAttribute('data-carousel-element', 'true');
      });
      
      // Force accurate dimension measurement
      container.style.visibility = 'hidden';
      container.offsetHeight; // Force reflow
      container.style.visibility = 'visible';
      
      // Get accurate dimensions after forced reflow
      containerWidth = container.offsetWidth;
      carouselWidth = carouselContent.offsetWidth;
      
      // If still no dimensions, try again with different approach
      if (carouselWidth === 0) {
        // Temporarily make visible and measure
        const originalDisplay = carouselContent.style.display;
        carouselContent.style.display = 'inline-flex';
        carouselContent.style.whiteSpace = 'nowrap';
        carouselWidth = carouselContent.offsetWidth;
        
        if (originalDisplay) {
          carouselContent.style.display = originalDisplay;
        }
      }
      
      // Guard: if carouselWidth is still 0, bail out — actuallyInitialize will retry
      if (carouselWidth === 0) {
        return;
      }

      // Create enough clones to ensure seamless scrolling with buffer
      const clonesNeeded = Math.max(3, Math.ceil((containerWidth * 2.5) / carouselWidth));
      
      for (let i = 1; i <= clonesNeeded; i++) {
        const clone = carouselContent.cloneNode(true);
        clone.id = `carouselContentClone${i}`;
        clone.style.cssText = 'position: absolute; left: 0; top: 0; white-space: nowrap; display: inline-flex; user-select: none !important; -webkit-user-select: none !important; -moz-user-select: none !important; -ms-user-select: none !important; pointer-events: none !important;';
        
        // Make clone spans completely unclickable
        const cloneSpans = clone.querySelectorAll('span');
        cloneSpans.forEach(span => {
          span.style.cssText += 'cursor: default !important; user-select: none !important; -webkit-user-select: none !important; -moz-user-select: none !important; -ms-user-select: none !important; pointer-events: none !important;';
          span.setAttribute('data-carousel-element', 'true');
        });
        
        container.appendChild(clone);
      }
      
      // Make sure container allows hover detection but nothing else
      container.style.cssText += 'pointer-events: auto !important;';
      
      // Add absolute click prevention directly to container
      container.style.cssText += 'position: relative;';
      
      // Create invisible overlay to block all clicks
      const clickBlocker = document.createElement('div');
      clickBlocker.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        pointer-events: none;
        background: transparent;
      `;
      clickBlocker.setAttribute('data-carousel-blocker', 'true');
      container.appendChild(clickBlocker);
      
      // Cache all elements for animation performance
      cachedElements = container.querySelectorAll('#carouselContent, [id*="carouselContentClone"]');
      
      // Set initial positions with fresh start
      resetPositions();
      
      // Update speed based on screen size
      updateSpeed();
    }

    // Reset all element positions
    function resetPositions() {
      if (!cachedElements) {
        cachedElements = container.querySelectorAll('#carouselContent, [id*="carouselContentClone"]');
      }
      
      // Force recalculation of carousel width if it's zero or seems wrong
      if (carouselWidth === 0 || !carouselWidth) {
        carouselWidth = carouselContent.offsetWidth;
      }
      
      xPositions = [];
      cachedElements.forEach((element, index) => {
        const xPos = index * carouselWidth;
        xPositions.push(xPos);
        element.style.transform = `translate3d(${xPos}px, 0, 0)`;
      });
      
      // Reset current position to start fresh
      currentPosition = 0;
    }

    // Update speed based on screen size
    function updateSpeed() {
      const width = window.innerWidth;
      
      if (width <= config.responsive.mobile.maxWidth) {
        speed = config.responsive.mobile.speed;
      } else if (width <= config.responsive.tablet.maxWidth) {
        speed = config.responsive.tablet.speed;
      } else if (width <= config.responsive.tabletLarge.maxWidth) {
        speed = config.responsive.tabletLarge.speed;
      } else {
        speed = config.responsive.desktop.speed;
      }
    }

    // Main animation loop - per-element wrapping for seamless infinite scroll
    function animate() {
      if (!isRunning || !cachedElements || carouselWidth === 0) return;
      
      const n = cachedElements.length;
      
      // Move every element left by speed
      for (let i = 0; i < n; i++) {
        xPositions[i] -= speed;
      }
      
      // Wrap any element whose right edge has passed the left side of the container
      for (let i = 0; i < n; i++) {
        if (xPositions[i] + carouselWidth <= 0) {
          // Find the current rightmost position
          let maxX = xPositions[0];
          for (let j = 1; j < n; j++) {
            if (xPositions[j] > maxX) maxX = xPositions[j];
          }
          // Place this element immediately after the rightmost one
          xPositions[i] = maxX + carouselWidth;
        }
      }
      
      // Apply transforms
      for (let i = 0; i < n; i++) {
        cachedElements[i].style.transform = `translate3d(${xPositions[i]}px, 0, 0)`;
      }
      
      // Reset hover if the hovered span has scrolled away from a stationary cursor
      if (checkHoverPosition) checkHoverPosition();
      
      animationId = requestAnimationFrame(animate);
    }

    // Start the carousel
    function start() {
      if (isRunning && animationId) return;
      isRunning = true;
      animate();
    }

    // Stop the carousel
    function stop() {
      isRunning = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }
    
    // Safeguard: Override any external attempts to stop the carousel
    const originalStop = stop;
    function protectedStop() {
      // Only allow stopping if it's a legitimate call (not from click interactions)
      const stack = new Error().stack;
      if (stack && !stack.includes('preventCarouselInteraction')) {
        originalStop();
      }
    }

    // Handle window resize
    let resizeTimeout;
    function handleResize() {
      if (!isInitialized) return;
      
      // Stop the animation immediately
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      isRunning = false;
      
      // Clear any existing resize timeout
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      
      // Debounce the resize to avoid multiple reinitializations
      resizeTimeout = setTimeout(() => {
        // Reset initialization flag
        isInitialized = false;
        initializationAttempts = 0;
        
        // Reset position state
        currentPosition = 0;
        carouselWidth = 0;
        containerWidth = 0;
        
        // Clear all clones
        if (container) {
          const existingClones = container.querySelectorAll('[id*="carouselContentClone"]');
          existingClones.forEach(clone => clone.remove());
        }
        
        // Reset transforms on original carousel content
        if (carouselContent) {
          carouselContent.style.transform = 'translate3d(0px, 0, 0)';
        }
        
        // Force reflow
        if (container) {
          container.offsetHeight;
        }
        
        // Clear cached elements
        cachedElements = null;
        xPositions = [];
        checkHoverPosition = null;
        lastMouseX = -1;
        lastMouseY = -1;
        
        // Clean up accumulated event listeners from previous setups
        cleanupEventListeners();
        
        // Reinitialize completely
        actuallyInitialize();
      }, 150);
    }
    
    // Complete carousel restart function
    function restartCarousel() {
      // Reset position state
      currentPosition = 0;
      carouselWidth = 0;
      containerWidth = 0;
      
      // Clear any existing clones completely
      if (container) {
        const existingClones = container.querySelectorAll('[id*="carouselContentClone"]');
        existingClones.forEach(clone => clone.remove());
        
        // Reset original carousel content position
        if (carouselContent) {
          carouselContent.style.transform = 'translateX(0px)';
        }
      }
      
      // Force a complete reflow to get accurate dimensions
      if (carouselContent && container) {
        container.style.visibility = 'hidden';
        container.offsetHeight; // Force reflow
        container.style.visibility = 'visible';
      }
      
      // Wait one more frame for layout to stabilize
      requestAnimationFrame(() => {
        setTimeout(() => {
          attemptInitialization();
        }, 50);
      });
    }
    
    // Helper function to track and clean up event listeners
    function addTrackedEventListener(element, event, handler, options) {
      element.addEventListener(event, handler, options);
      eventListeners.push({ element, event, handler, options });
    }
    
    function cleanupEventListeners() {
      eventListeners.forEach(({ element, event, handler, options }) => {
        try {
          element.removeEventListener(event, handler, options);
        } catch (e) {
          // Ignore errors if element no longer exists
        }
      });
      eventListeners = [];
    }

    // Handle visibility change (pause when tab is not visible)
    function handleVisibilityChange() {
      if (document.hidden) {
        originalStop(); // Use original stop for legitimate visibility change
      } else {
        start();
      }
    }

    // Add hover effects for individual spans with optimized event delegation
    function setupHoverEffects() {
      let baseSpeed = speed; // Store the initial speed
      let isHovering = false;
      let currentHoveredSpan = null;
      
      // Ultra-aggressive click prevention with multiple detection methods
      const preventCarouselInteraction = (e) => {
        const target = e.target;
        
        // Multiple ways to detect carousel elements
        const isCarouselElement = 
          target.tagName === 'SPAN' ||
          target.hasAttribute('data-carousel-element') ||
          target.closest('#carouselContent') || 
          target.closest('[id*="carouselContentClone"]') ||
          target.closest('.carousel-content') ||
          target.closest('.carousel-container') ||
          target.closest('[data-carousel-element]') ||
          target.closest('[data-carousel-blocker]');
        
        if (isCarouselElement) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          
          // Force cursor to default
          if (target.style) {
            target.style.cursor = 'default';
          }
          
          return false;
        }
      };
      
      // Add global click prevention with highest priority
      const globalClickPrevention = (e) => {
        const target = e.target;
        if (target.hasAttribute && target.hasAttribute('data-carousel-element')) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return false;
        }
        
        // Check parent elements too
        let parent = target.parentElement;
        while (parent) {
          if (parent.hasAttribute && parent.hasAttribute('data-carousel-element')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
          }
          parent = parent.parentElement;
        }
      };
      
      // Prevent all types of interaction events using tracked listeners
      ['click', 'mousedown', 'mouseup', 'dblclick', 'touchstart', 'touchend'].forEach(eventType => {
        addTrackedEventListener(container, eventType, preventCarouselInteraction, { capture: true });
        addTrackedEventListener(document, eventType, preventCarouselInteraction, { capture: true });
        addTrackedEventListener(document, eventType, globalClickPrevention, { capture: true });
      });
      
      // Prevent context menu and drag events using tracked listeners
      addTrackedEventListener(container, 'contextmenu', preventCarouselInteraction, { capture: true });
      addTrackedEventListener(container, 'dragstart', preventCarouselInteraction, { capture: true });
      addTrackedEventListener(container, 'selectstart', preventCarouselInteraction, { capture: true });
      addTrackedEventListener(document, 'contextmenu', globalClickPrevention, { capture: true });
      
      // Expose a per-frame check so animate() can drop a stale hover
      checkHoverPosition = () => {
        if (!currentHoveredSpan || lastMouseX < 0) return;
        const r = currentHoveredSpan.getBoundingClientRect();
        if (lastMouseX < r.left || lastMouseX > r.right || lastMouseY < r.top || lastMouseY > r.bottom) {
          currentHoveredSpan.style.setProperty('opacity', '0.5', 'important');
          currentHoveredSpan.style.setProperty('transform', 'scale(1)', 'important');
          currentHoveredSpan = null;
          speed = baseSpeed;
          isHovering = false;
        }
      };

      // Use mousemove to detect which span is being hovered
      const handleMouseMove = (e) => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Find the span at this position by checking coordinates
        const allSpans = container.querySelectorAll('span[data-carousel-element]');
        let hoveredSpan = null;
        
        for (let span of allSpans) {
          const spanRect = span.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const relativeLeft = spanRect.left - containerRect.left;
          const relativeRight = spanRect.right - containerRect.left;
          const relativeTop = spanRect.top - containerRect.top;
          const relativeBottom = spanRect.bottom - containerRect.top;
          
          if (x >= relativeLeft && x <= relativeRight && y >= relativeTop && y <= relativeBottom) {
            hoveredSpan = span;
            break;
          }
        }
        
        // Handle hover state changes
        if (hoveredSpan && hoveredSpan !== currentHoveredSpan) {
          // New span hovered
          if (currentHoveredSpan) {
            // Reset previous span
            currentHoveredSpan.style.setProperty('opacity', '0.5', 'important');
            currentHoveredSpan.style.setProperty('transform', 'scale(1)', 'important');
          }
          
          currentHoveredSpan = hoveredSpan;
          
          if (!isHovering) {
            baseSpeed = speed;
            isHovering = true;
          }
          speed = baseSpeed * 0.3;
          
          // Apply hover styles
          hoveredSpan.style.setProperty('opacity', '1', 'important');
          hoveredSpan.style.setProperty('transform', 'scale(1.05)', 'important');
          hoveredSpan.style.setProperty('transition', 'opacity 0.2s ease, transform 0.2s ease', 'important');
          
        } else if (!hoveredSpan && currentHoveredSpan) {
          // No longer hovering any span
          currentHoveredSpan.style.setProperty('opacity', '0.5', 'important');
          currentHoveredSpan.style.setProperty('transform', 'scale(1)', 'important');
          currentHoveredSpan = null;
          
          speed = baseSpeed;
          isHovering = false;
        }
      };
      
      addTrackedEventListener(container, 'mousemove', handleMouseMove, { passive: true });
      
      // Handle mouse leave from container
      const handleMouseLeave = () => {
        if (currentHoveredSpan) {
          currentHoveredSpan.style.setProperty('opacity', '0.5', 'important');
          currentHoveredSpan.style.setProperty('transform', 'scale(1)', 'important');
          currentHoveredSpan = null;
        }
        speed = baseSpeed;
        isHovering = false;
      };
      
      addTrackedEventListener(container, 'mouseleave', handleMouseLeave, { passive: true });
      
      // Update base speed when speed changes due to screen size
      const originalUpdateSpeed = updateSpeed;
      updateSpeed = function() {
        originalUpdateSpeed();
        if (!isHovering) {
          baseSpeed = speed;
        }
      };
    }

    // Public API (if needed)
    window.CarouselAPI = {
      start,
      stop: protectedStop,
      restart: () => {
        protectedStop();
        isInitialized = false;
        initializationAttempts = 0;
        cachedElements = null;
        attemptInitialization();
      },
      forceInit: () => {
        isInitialized = false;
        initializationAttempts = 0;
        cachedElements = null;
        actuallyInitialize();
      }
    };

    // Core listeners are NOT tracked — they must survive across reinitializations
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });

    // Optimized initialization strategies (reduced from 6 to 3)
    
    // Strategy 1: Immediate attempt after DOM ready
    setTimeout(attemptInitialization, 0);
    
    // Strategy 2: After layout paint (using RAF for optimal timing)
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (!isInitialized) attemptInitialization();
      }, 100);
    });
    
    // Strategy 3: Ultimate fallback after reasonable delay
    setTimeout(() => {
      if (!isInitialized) {
        actuallyInitialize();
      }
    }, 1000);
  }
});

// Check if the current page is index.html
const isIndexPage =
  window.location.pathname.endsWith("index.html") ||
  window.location.pathname === "/";

// Initialize "Work" underline as always active only on index.html
if (isIndexPage) {
  document.getElementById("workUnderline").classList.add("active");
} else {
  document.getElementById("workUnderline").classList.remove("active");
}

// Event listener for "About" link
document
  .getElementById("aboutLink")
  .addEventListener("click", function (event) {
    if (isAboutPage) {
      if (window.scrollY !== 0) {
        event.preventDefault(); // Prevent scroll jump when not at the top
        smoothScrollTo(0, 500); // Smooth scroll to top
      }
    } else {
      window.location.href = "about.html";
    }
  });

// Initialize "About" underline as always active only on about.html
const isAboutPage = window.location.pathname.endsWith("about.html");
if (isAboutPage) {
  document.getElementById("aboutUnderline").classList.add("active");
} else {
  document.getElementById("aboutUnderline").classList.remove("active");
}

// Function to handle "Work" link click event
function handleWorkLinkClick(event) {
  const isIndexPage =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/";
  if (isIndexPage) {
    if (window.scrollY === 0) {
      event.preventDefault(); // Prevent scroll jump when at the top
    } else {
      smoothScrollTo(0, 500); // Smooth scroll to top
    }
    document.getElementById("workUnderline").classList.add("active");
    document.getElementById("contactUnderline").classList.remove("active");
  } else {
    window.location.href = "index.html"; // Redirect to index.html
  }
}

// Event listener for "Work" link
document
  .getElementById("workLink")
  .addEventListener("click", handleWorkLinkClick);

// Scroll event to toggle "Contact" underline and keep "Work" and "About" underlines active only on their respective pages
window.addEventListener("scroll", function () {
  const footer = document.querySelector("footer");
  const footerRect = footer.getBoundingClientRect();
  const isFooterVisible =
    footerRect.top < window.innerHeight && footerRect.bottom >= 0;
  const contactUnderline = document.getElementById("contactUnderline");
  const workUnderline = document.getElementById("workUnderline");
  const aboutUnderline = document.getElementById("aboutUnderline");

  if (isFooterVisible) {
    contactUnderline.classList.add("active");
  } else {
    contactUnderline.classList.remove("active");
  }

  // Keep "Work" underline always active only on index.html
  if (isIndexPage) {
    workUnderline.classList.add("active");
  } else {
    workUnderline.classList.remove("active");
  }

  // Keep "About" underline always active only on about.html
  if (isAboutPage) {
    aboutUnderline.classList.add("active");
  } else {
    aboutUnderline.classList.remove("active");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-svg");
  const hamburgerMenu = document.getElementById("hamburgerMenu");

  // Define custom properties for transition durations
  const openDuration = "0.9s";
  const closeDuration = "0.5s";

  // Create full-screen overlay to block background interactions
  const menuOverlay = document.createElement("div");
  menuOverlay.id = "menu-overlay";
  menuOverlay.style.cssText = [
    "position: fixed",
    "inset: 0",
    "z-index: 9999",
    "display: none",
    "cursor: default",
    "background: transparent"
  ].join("; ");
  document.body.appendChild(menuOverlay);

  // Enhanced function to close the menu if screen width is greater than 768px
  function closeMenuOnLargeScreens() {
    const screenWidth = window.innerWidth;
    if (screenWidth > 768) {
      hamburgerMenu.style.setProperty(
        "--menu-transition-duration",
        closeDuration
      );
      // Ensure transform transition works regardless of theme state
      hamburgerMenu.style.transition = `transform ${closeDuration} ease`;
      hamburgerMenu.classList.add("hidden");
      document.body.classList.remove("no-scroll"); // Enable scrolling
      menuOverlay.style.display = "none"; // Hide overlay
      setTimeout(() => {
        hamburgerMenu.classList.remove("active");
        hamburgerMenu.style.display = "none"; // Hide the menu after the animation
      }, 600); // Wait for the close animation to complete before removing the active class
    }
  }

  // Call the function initially and whenever the window is resized
  closeMenuOnLargeScreens();
  window.addEventListener("resize", closeMenuOnLargeScreens);

  // Enhanced toggle menu visibility with color-state-independent animations
  menuButton.addEventListener("click", () => {
    // Ensure transform transition is always set regardless of color state
    hamburgerMenu.style.setProperty("--menu-transition-duration", openDuration);
    hamburgerMenu.style.display = "block"; // Ensure the menu is displayed
    
    // Apply the correct theme class based on current state
    if (document.body.classList.contains('tarkov-page') || document.body.classList.contains('grocery-page') || document.body.classList.contains('astray-page')) {
      // Clear any existing theme classes first
      hamburgerMenu.classList.remove('tarkov-initial', 'tarkov-theme-active', 'marketplace-theme-active');
      
      // Apply the appropriate class based on current theme state
      if (tarkovThemeActive) {
        hamburgerMenu.classList.add('tarkov-theme-active');
      } else {
        hamburgerMenu.classList.add('tarkov-initial');
      }
    } else if (document.body.classList.contains('marketplace-page')) {
      hamburgerMenu.classList.remove('tarkov-initial', 'tarkov-theme-active');
      hamburgerMenu.classList.add('marketplace-theme-active');
    } else if (document.body.classList.contains('killjoy-page')) {
      hamburgerMenu.classList.remove('tarkov-initial', 'tarkov-theme-active', 'marketplace-theme-active', 'about-theme-active');
      hamburgerMenu.classList.add('killjoy-theme-active');
    } else if (document.body.classList.contains('about-page')) {
      hamburgerMenu.classList.remove('tarkov-initial', 'tarkov-theme-active', 'marketplace-theme-active');
      hamburgerMenu.classList.add('about-theme-active');
    } else if (document.body.classList.contains('skull-page')) {
      hamburgerMenu.classList.remove('tarkov-initial', 'tarkov-theme-active', 'marketplace-theme-active', 'about-theme-active');
      hamburgerMenu.classList.add('skull-theme-active');
    } else if (document.body.classList.contains('zed-page')) {
      hamburgerMenu.classList.remove('tarkov-initial', 'tarkov-theme-active', 'marketplace-theme-active', 'about-theme-active', 'skull-theme-active');
      hamburgerMenu.classList.add('zed-theme-active');
    } else if (document.body.classList.contains('thresh-page')) {
      hamburgerMenu.classList.remove('tarkov-initial', 'tarkov-theme-active', 'marketplace-theme-active', 'about-theme-active', 'skull-theme-active', 'zed-theme-active');
      hamburgerMenu.classList.add('thresh-theme-active');
    } else if (document.body.classList.contains('yggdrasil-page')) {
      hamburgerMenu.classList.remove('tarkov-initial', 'tarkov-theme-active', 'marketplace-theme-active', 'about-theme-active', 'skull-theme-active', 'zed-theme-active', 'thresh-theme-active');
      hamburgerMenu.classList.add('yggdrasil-theme-active');
    } else if (document.body.classList.contains('cauzito-page')) {
      hamburgerMenu.classList.remove('tarkov-initial', 'tarkov-theme-active', 'marketplace-theme-active', 'about-theme-active', 'skull-theme-active', 'zed-theme-active', 'thresh-theme-active', 'yggdrasil-theme-active');
      hamburgerMenu.classList.add('cauzito-theme-active');
    } else {
      // Other pages: use default background via inline style (existing behavior)
      hamburgerMenu.style.background = 'linear-gradient(to bottom, #2A2B2D 45%, #1C1C1C 100%)';
    }
    
    // Set opening transition explicitly so all pages use the same ease-in-out animation
    hamburgerMenu.style.transition = `transform ${openDuration} ease-in-out`;
    document.body.classList.add("no-scroll"); // Disable scrolling
    menuOverlay.style.display = "block"; // Show overlay to block background clicks
    setTimeout(() => {
      hamburgerMenu.classList.add("active");
      hamburgerMenu.classList.remove("hidden");
    }, 10); // Slight delay to ensure the display property is set before applying the class
  });

  // Enhanced function to close the menu with color-state-independent animations
  function closeMenu() {
    hamburgerMenu.style.setProperty(
      "--menu-transition-duration",
      closeDuration
    );
    // Ensure transform transition works regardless of theme state
    hamburgerMenu.style.transition = `transform ${closeDuration} ease`;
    hamburgerMenu.classList.add("hidden");
    document.body.classList.remove("no-scroll"); // Enable scrolling
    menuOverlay.style.display = "none"; // Hide overlay so background is interactive again
    setTimeout(() => {
      hamburgerMenu.classList.remove("active");
      hamburgerMenu.style.display = "none"; // Hide the menu after the animation
    }, 600); // Wait for the close animation to complete before removing the active class
  }

  // Clicking the overlay closes the menu
  menuOverlay.addEventListener("click", closeMenu);

  // Close the menu when clicking any menu option
  const menuOptions = document.querySelectorAll("#hamburgerMenu a"); // Assuming menu options are anchor tags
  menuOptions.forEach((option) => {
    option.addEventListener("click", closeMenu);
  });

});

document.addEventListener("DOMContentLoaded", () => {
  const hamburgerContactLink = document.getElementById("hamburgerContactLink");
  const hamburgerContactUnderline = document.getElementById(
    "hamburgerContactUnderline"
  );

  // Function to check if the user is at the footer section
  function checkFooterVisibility() {
    const footer = document.querySelector(".footer");
    const footerTop = footer.offsetTop;
    const scrollPosition = window.scrollY + window.innerHeight;

    if (scrollPosition >= footerTop && window.scrollY > 0) {
      hamburgerContactUnderline.style.display = "block";
    } else {
      hamburgerContactUnderline.style.display = "none";
    }
  }

  // Call the function initially and whenever the window is scrolled
  checkFooterVisibility();
  window.addEventListener("scroll", checkFooterVisibility);

  // Add smooth scroll functionality to the "CONTACT" link
  hamburgerContactLink.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    smoothScrollTo(document.body.scrollHeight, 1000); // Smooth scroll to footer
  });
});
/* Direction to the "WORK" page mobile */
document.addEventListener("DOMContentLoaded", () => {
  const hamburgerWorkLink = document.getElementById("hamburgerWorkLink");
  const hamburgerWorkUnderline = document.getElementById(
    "hamburgerWorkUnderline"
  );

  // Check if the elements exist before adding event listeners
  if (hamburgerWorkLink && hamburgerWorkUnderline) {
    // Event listener for "WORK" link
    hamburgerWorkLink.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default anchor behavior
      const isWorkPage = window.location.pathname.endsWith("index.html");
      if (isWorkPage) {
        // Scroll to the header if on index.html page
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // Redirect to index.html if not on index.html page
        window.location.href = "index.html";
      }
    });

    // Add underline to "Work" link when on about page
    function addUnderlineToWorkLink() {
      const isWorkPage = window.location.pathname.endsWith("index.html");
      if (isWorkPage) {
        hamburgerWorkUnderline.style.display = "block";
      } else {
        hamburgerWorkUnderline.style.display = "none";
      }
    }

    // Call the function initially
    addUnderlineToWorkLink();
  } else {
    console.error(
      "Element with ID 'hamburgerWorkLink' or 'hamburgerWorkUnderline' not found."
    );
  }
});

/* Direction to the "ABOUT" page mobile */
document.addEventListener("DOMContentLoaded", () => {
  const hamburgerAboutLink = document.getElementById("hamburgerAboutLink");
  const hamburgerAboutUnderline = document.getElementById(
    "hamburgerAboutUnderline"
  );

  // Check if the elements exist before adding event listeners
  if (hamburgerAboutLink && hamburgerAboutUnderline) {
    // Event listener for "ABOUT" link
    hamburgerAboutLink.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default anchor behavior
      const isAboutPage = window.location.pathname.endsWith("about.html");
      if (isAboutPage) {
        // Scroll to the header if on about.html page
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // Redirect to about.html if not on about.html page
        window.location.href = "about.html";
      }
    });

    // Add underline to "About" link when on about page
    function addUnderlineToAboutLink() {
      const isAboutPage = window.location.pathname.endsWith("about.html");
      if (isAboutPage) {
        hamburgerAboutUnderline.style.display = "block";
      } else {
        hamburgerAboutUnderline.style.display = "none";
      }
    }

    // Call the function initially
    addUnderlineToAboutLink();
  } else {
    console.error(
      "Element with ID 'hamburgerAboutLink' or 'hamburgerAboutUnderline' not found."
    );
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const contactLink = document.getElementById("contactLink");
  const footer = document.querySelector("footer");

  if (contactLink && footer) {
    // Add smooth scroll functionality to the "CONTACT" link in the header
    contactLink.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default anchor behavior
      smoothScrollTo(document.body.scrollHeight, 1000); // Smooth scroll to footer
    });
  }
});

// Smooth scroll function
function smoothScrollTo(target, duration) {
  const start = window.scrollY;
  const distance = target - start;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, start, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

// Global variable to track Tarkov theme state
let tarkovThemeActive = false;

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // Enhanced Tarkov Page Color Theme Activation
  if (body.classList.contains("tarkov-page") || body.classList.contains("grocery-page") || body.classList.contains("astray-page")) {
    const portfolioSection = document.querySelector(".portfolio-section");
    const header = document.querySelector(".header");
    const footer = document.querySelector("footer");
    const hamburgerMenu = document.getElementById("hamburgerMenu");

    // Dim body while loading screen is visible
    document.body.style.opacity = '0.92';
    document.body.style.transition = 'opacity 1s ease';

    // Start color theme once the loading screen is fully gone
    document.addEventListener('loadingScreenHidden', () => {
      // Add visual loading feedback with much slower transitions
      if (header) {
        // Include transform transition for header behavior AND background-color for theme
        header.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-bottom 3.5s ease';
      }
      if (footer) {
        footer.style.transition = 'background-color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-top 3.5s ease';
      }

      // Apply Tarkov theme classes
      portfolioSection?.classList.add("tarkov-active");
      header?.classList.add("tarkov-active");
      footer?.classList.add("tarkov-active");
      
      // Set up hamburger menu using CSS classes for theme states
      if (hamburgerMenu) {
        // Start with initial theme class
        hamburgerMenu.classList.add('tarkov-initial');
        
        // Trigger theme change simultaneously with header/footer
        requestAnimationFrame(() => {
          // Remove initial class and add active theme class to hamburger menu
          hamburgerMenu.classList.remove('tarkov-initial');
          hamburgerMenu.classList.add('tarkov-theme-active');
          
          // Update global theme state
          tarkovThemeActive = true;
        });
      }

      // Restore opacity once theme is applied
      document.body.style.opacity = '1';
    }, { once: true }); // Fires after loading screen is hidden
  } else {
    // Initialize theme state for non-Tarkov pages
    tarkovThemeActive = false;
  }

  // ─── Skull Page Theme ───
  if (body.classList.contains('skull-page')) {
    const header = document.querySelector(".header");
    const footer = document.querySelector("footer");
    const hamburgerMenu = document.getElementById("hamburgerMenu");

    document.addEventListener('loadingScreenHidden', () => {
      // Set inline transitions first so browser records the "from" values
      if (header) {
        header.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-bottom 3.5s ease, box-shadow 3.5s ease';
      }
      if (footer) {
        footer.style.transition = 'background-color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-top 3.5s ease, box-shadow 3.5s ease';
      }
      document.querySelectorAll('.header .nav-link').forEach(link => {
        link.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
      const logo = document.querySelector('.header .logo');
      if (logo) logo.style.transition = 'filter 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      const menuIcon = document.querySelector('.header .menu-icon');
      if (menuIcon) menuIcon.style.transition = 'filter 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      document.querySelectorAll('.footer .footerTitleTypography, .footer .footer-title, .footer .footerTextTypography, .footer a').forEach(el => {
        el.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
      document.querySelectorAll('.tri-lock-btn').forEach(btn => {
        btn.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });

      // Apply skull theme classes (CSS defines final colors)
      header?.classList.add("skull-active");
      footer?.classList.add("skull-active");

      // Hamburger — initial state then animate to active
      if (hamburgerMenu) {
        hamburgerMenu.classList.add('skull-initial');
        requestAnimationFrame(() => {
          hamburgerMenu.classList.remove('skull-initial');
          hamburgerMenu.classList.add('skull-theme-active');
        });
      }
    }, { once: true });
  }

  // Enhanced Grocery Page Color Theme Activation
  if (body.classList.contains("grocery-page")) {
    // Dim body while loading screen is visible
    document.body.style.opacity = '0.95';
    document.body.style.transition = 'opacity 3s ease-in-out';

    // Start grocery color theme once the loading screen is fully gone
    document.addEventListener('loadingScreenHidden', () => {
      // Grocery color variables
      const groceryColors = {
        primary: '#2ECC71',
        secondary: '#27AE60',
        accent: '#F39C12',
        light: '#F8F9FA',
        lighter: '#FFFFFF',
        textDark: '#2C3E50',
        textMedium: '#34495E',
        textLight: '#7F8C8D',
        border: '#E8F5E8',
        shadow: 'rgba(46, 204, 113, 0.1)'
      };

      // Apply all color transitions with 3s duration
      const transitionStyle = 'all 3s ease-in-out';

      // Page backgrounds
      document.body.style.transition = transitionStyle;
      document.body.style.backgroundColor = groceryColors.light;
      
      const portfolioSection = document.querySelector('.portfolio-section');
      if (portfolioSection) {
        portfolioSection.style.transition = transitionStyle;
        portfolioSection.style.backgroundColor = groceryColors.light;
      }

      // Header
      const header = document.querySelector('.header');
      if (header) {
        // Use fast transform transition for header behavior, but slow for color changes
        header.style.transition = 'transform 0.25s ease-out, background-color 3s ease-in-out, border-bottom 3s ease-in-out, box-shadow 3s ease-in-out';
        header.style.backgroundColor = groceryColors.lighter;
        header.style.borderBottom = `1px solid ${groceryColors.border}`;
        header.style.boxShadow = `0 2px 12px ${groceryColors.shadow}`;
      }

      // Header navigation links
      const navLinks = document.querySelectorAll('.header .nav-link');
      navLinks.forEach(link => {
        link.style.transition = transitionStyle;
        link.style.color = groceryColors.textDark;
      });

      // Logo filter for dark appearance on white background
      const logo = document.querySelector('.header .logo');
      if (logo) {
        logo.style.transition = transitionStyle;
        logo.style.filter = 'brightness(0) saturate(100%) invert(17%) sepia(11%) saturate(923%) hue-rotate(169deg) brightness(95%) contrast(86%)';
      }

      // Menu icon filter for dark appearance
      const menuIcon = document.querySelector('.header .menu-icon');
      if (menuIcon) {
        menuIcon.style.transition = transitionStyle;
        menuIcon.style.filter = 'brightness(0) saturate(100%) invert(17%) sepia(11%) saturate(923%) hue-rotate(169deg) brightness(95%) contrast(86%)';
      }

      // Hamburger menu
      const hamburgerMenu = document.querySelector('.hamburger-menu');
      if (hamburgerMenu) {
        hamburgerMenu.style.transition = transitionStyle;
        hamburgerMenu.style.backgroundColor = groceryColors.lighter;
      }

      // Hamburger menu links
      const hamburgerLinks = document.querySelectorAll('.hamburger-menu a');
      hamburgerLinks.forEach(link => {
        link.style.transition = transitionStyle;
        link.style.color = groceryColors.textDark;
      });

      // Footer
      const footer = document.querySelector('.footer');
      if (footer) {
        footer.style.transition = transitionStyle;
        footer.style.backgroundColor = groceryColors.lighter;
      }

      // Footer content - make background transparent
      const footerContent = document.querySelector('.footer-content');
      if (footerContent) {
        footerContent.style.transition = transitionStyle;
        footerContent.style.backgroundColor = 'transparent';
      }

      // Fundo footer (background element) - make transparent
      const fundoFooter = document.querySelector('.fundo-footer');
      if (fundoFooter) {
        fundoFooter.style.transition = transitionStyle;
        fundoFooter.style.backgroundColor = 'transparent';
      }

      // Footer sections - make transparent
      const footerSections = document.querySelectorAll('.footer-section');
      footerSections.forEach(section => {
        section.style.transition = transitionStyle;
        section.style.backgroundColor = 'transparent';
      });

      // Footer titles (h2 elements)
      const footerTitles = document.querySelectorAll('.footer .footerTitleTypography, .footer .footer-title');
      footerTitles.forEach(title => {
        title.style.transition = transitionStyle;
        title.style.color = groceryColors.textDark;
      });

      // Footer text and all links (including social media links)
      const footerText = document.querySelectorAll('.footer .footerTextTypography, .footer a, .footer .get-in-touch-grid a, .footer .social-media-grid a');
      footerText.forEach(text => {
        text.style.transition = transitionStyle;
        text.style.color = groceryColors.textMedium;
      });

      // Footer grid containers - make transparent
      const footerGrids = document.querySelectorAll('.get-in-touch-grid, .social-media-grid');
      footerGrids.forEach(grid => {
        grid.style.transition = transitionStyle;
        grid.style.backgroundColor = 'transparent';
        grid.style.color = groceryColors.textMedium;
      });

      // Typography elements
      const titleElements = document.querySelectorAll('.titleTypography');
      titleElements.forEach(title => {
        title.style.transition = transitionStyle;
        title.style.color = groceryColors.textDark;
      });

      const subTitleElements = document.querySelectorAll('.subTitleTypography');
      subTitleElements.forEach(subtitle => {
        subtitle.style.transition = transitionStyle;
        subtitle.style.color = groceryColors.secondary;
      });

      const textElements = document.querySelectorAll('.textTypography');
      textElements.forEach(text => {
        text.style.transition = transitionStyle;
        text.style.color = groceryColors.textMedium;
      });

      const headerElements = document.querySelectorAll('.headerTypography');
      headerElements.forEach(header => {
        header.style.transition = transitionStyle;
        header.style.color = groceryColors.textDark;
      });

      // Restore opacity once theme is applied
      document.body.style.opacity = '1';
    }, { once: true }); // Fires after loading screen is hidden

    // Grocery page header scroll behavior
    let lastScrollTop = 0;
    let isHeaderVisible = true;
    const scrollThreshold = 100;
    const header = document.querySelector('.header');
    
    if (header) {
      // Set initial header styles for grocery page - but apply after color theme loads
      function setFastHeaderTransition() {
        header.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 3s ease-in-out, border-bottom 3s ease-in-out, box-shadow 3s ease-in-out';
      }
      
      // Set immediately
      setFastHeaderTransition();
      
      // Set again after color theme has loaded (1000ms + buffer)
      setTimeout(setFastHeaderTransition, 1200);
      
      // Throttle scroll events for better performance
      let ticking = false;
      
      function handleGroceryScroll() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Don't hide header if we're near the top of the page
        if (currentScrollTop < scrollThreshold) {
          showGroceryHeader();
          lastScrollTop = currentScrollTop;
          return;
        }
        
        // Determine scroll direction
        const scrollingDown = currentScrollTop > lastScrollTop;
        
        if (scrollingDown && isHeaderVisible) {
          hideGroceryHeader();
        } else if (!scrollingDown && !isHeaderVisible) {
          showGroceryHeader();
        }
        
        lastScrollTop = currentScrollTop;
      }
      
      function hideGroceryHeader() {
        if (isHeaderVisible) {
          // Ensure fast transition is set to match index page
          header.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 3s ease-in-out, border-bottom 3s ease-in-out, box-shadow 3s ease-in-out';
          header.classList.add('hide');
          header.classList.remove('show');
          header.style.transform = 'translateY(-100%)';
          isHeaderVisible = false;
        }
      }
      
      function showGroceryHeader() {
        if (!isHeaderVisible) {
          // Ensure fast transition is set to match index page
          header.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 3s ease-in-out, border-bottom 3s ease-in-out, box-shadow 3s ease-in-out';
          header.classList.add('show');
          header.classList.remove('hide');
          header.style.transform = 'translateY(0)';
          isHeaderVisible = true;
        }
      }
      
      function requestTick() {
        if (!ticking) {
          requestAnimationFrame(handleGroceryScroll);
          ticking = true;
        }
      }
      
      // Add scroll event listener
      window.addEventListener('scroll', () => {
        requestTick();
        ticking = false;
      }, { passive: true });
      
      // Mouse hover to show header when hidden
      header.addEventListener('mouseenter', showGroceryHeader);
      
      // Initialize header state based on current scroll position
      const initialScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (initialScrollTop > scrollThreshold) {
        hideGroceryHeader();
      }
    }
  }

  // Marketplace Page Color Theme Activation
  if (body.classList.contains("marketplace-page")) {
    // Dim body while loading screen is visible
    document.body.style.opacity = '0.92';
    document.body.style.transition = 'opacity 1s ease';

    // Start marketplace color theme once the loading screen is fully gone
    document.addEventListener('loadingScreenHidden', () => {
      const marketplaceColors = {
        header:       '#F5A623',   // Yellow
        footer:       '#F5A623',   // Yellow
        headerBorder: 'rgba(255, 255, 255, 0.25)',
        footerBorder: 'rgba(255, 255, 255, 0.25)',
        text:         '#FFFFFF',   // White text on header/footer
        shadow:       'rgba(245, 166, 35, 0.3)',
      };

      const transitionColor = 'background-color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), border 3.5s ease, box-shadow 3.5s ease';

      // Header
      const header = document.querySelector('.header');
      if (header) {
        header.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), ' + transitionColor;
        header.style.backgroundColor = marketplaceColors.header;
        header.style.borderBottom = `1px solid ${marketplaceColors.headerBorder}`;
        header.style.boxShadow = `0 2px 20px ${marketplaceColors.shadow}`;
      }

      // Nav links → white
      document.querySelectorAll('.header .nav-link').forEach(link => {
        link.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        link.style.color = marketplaceColors.text;
      });

      // Logo → white
      const logo = document.querySelector('.header .logo');
      if (logo) {
        logo.style.transition = 'filter 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        logo.style.filter = 'brightness(0) invert(1)';
      }

      // Menu icon → white
      const menuIcon = document.querySelector('.header .menu-icon');
      if (menuIcon) {
        menuIcon.style.transition = 'filter 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        menuIcon.style.filter = 'brightness(0) invert(1)';
      }

      // Footer
      const footer = document.querySelector('.footer');
      if (footer) {
        footer.style.transition = transitionColor;
        footer.style.backgroundColor = marketplaceColors.footer;
        footer.style.borderTop = `1px solid ${marketplaceColors.footerBorder}`;
        footer.style.boxShadow = `0 -2px 20px ${marketplaceColors.shadow}`;
      }

      // Footer backgrounds → transparent so yellow shows through
      const footerContent = document.querySelector('.footer-content');
      if (footerContent) { footerContent.style.backgroundColor = 'transparent'; }
      const fundoFooter = document.querySelector('.fundo-footer');
      if (fundoFooter) { fundoFooter.style.backgroundColor = 'transparent'; }
      document.querySelectorAll('.footer-section').forEach(s => { s.style.backgroundColor = 'transparent'; });

      // Footer titles & text → white
      document.querySelectorAll('.footer .footerTitleTypography, .footer .footer-title').forEach(el => {
        el.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        el.style.color = marketplaceColors.text;
      });
      document.querySelectorAll('.footer .footerTextTypography, .footer a').forEach(el => {
        el.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        el.style.color = marketplaceColors.text;
      });

      // Hamburger menu → yellow background, white text
      const hamburgerMenu = document.getElementById('hamburgerMenu');
      if (hamburgerMenu) {
        hamburgerMenu.classList.add('marketplace-theme-active');
      }

      document.body.style.opacity = '1';
    }, { once: true }); // Fires after loading screen is hidden
  }

  // ─── About Page Theme ───
  if (body.classList.contains("about-page") && !body.classList.contains("killjoy-page")) {
    // Dim body while loading screen is visible
    document.body.style.opacity = '0.92';
    document.body.style.transition = 'opacity 1s ease';

    // Start about color theme once the loading screen is fully gone
    document.addEventListener('loadingScreenHidden', () => {
      const aboutColors = {
        header:       '#FFFFFF',   // white
        footer:       '#FFFFFF',
        headerBorder: 'rgba(0, 156, 59, 0.3)',
        footerBorder: 'rgba(0, 156, 59, 0.3)',
        text:         '#009C3B',
        shadow:       'rgba(0, 156, 59, 0.2)',
      };

      const transitionColor = 'background-color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), border 3.5s ease, box-shadow 3.5s ease';

      const header = document.querySelector('.header');
      if (header) {
        header.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), ' + transitionColor;
        header.style.backgroundColor = aboutColors.header;
        header.style.borderBottom = `1px solid ${aboutColors.headerBorder}`;
        header.style.boxShadow = `0 2px 20px ${aboutColors.shadow}`;
      }

      document.querySelectorAll('.header .nav-link').forEach(link => {
        link.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        link.style.color = aboutColors.text;
      });

      const logo = document.querySelector('.header .logo');
      if (logo) {
        logo.style.transition = 'filter 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        logo.style.filter = 'brightness(0) saturate(100%) invert(38%) sepia(98%) saturate(523%) hue-rotate(108deg) brightness(95%)';
      }

      const menuIcon = document.querySelector('.header .menu-icon');
      if (menuIcon) {
        menuIcon.style.transition = 'filter 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        menuIcon.style.filter = 'brightness(0) saturate(100%) invert(38%) sepia(98%) saturate(523%) hue-rotate(108deg) brightness(95%)';
      }

      const footer = document.querySelector('.footer');
      if (footer) {
        footer.style.transition = transitionColor;
        footer.style.backgroundColor = aboutColors.footer;
        footer.style.borderTop = `1px solid ${aboutColors.footerBorder}`;
        footer.style.boxShadow = `0 -2px 20px ${aboutColors.shadow}`;
      }

      const footerContent = document.querySelector('.footer-content');
      if (footerContent) { footerContent.style.backgroundColor = 'transparent'; }
      const fundoFooter = document.querySelector('.fundo-footer');
      if (fundoFooter) { fundoFooter.style.backgroundColor = 'transparent'; }
      document.querySelectorAll('.footer-section').forEach(s => { s.style.backgroundColor = 'transparent'; });

      document.querySelectorAll('.footer .footerTitleTypography, .footer .footer-title').forEach(el => {
        el.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        el.style.color = aboutColors.text;
      });
      document.querySelectorAll('.footer .footerTextTypography, .footer a').forEach(el => {
        el.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        el.style.color = aboutColors.text;
      });

      const hamburgerMenu = document.getElementById('hamburgerMenu');
      if (hamburgerMenu) {
        hamburgerMenu.classList.add('about-theme-active');
      }

      document.body.style.opacity = '1';
    }, { once: true }); // Fires after loading screen is hidden
  }

  // ─── Cauzito Page Theme ───
  if (body.classList.contains('cauzito-page')) {
    const header = document.querySelector(".header");
    const footer = document.querySelector("footer");
    const hamburgerMenu = document.getElementById("hamburgerMenu");

    document.addEventListener('loadingScreenHidden', () => {
      if (header) {
        header.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-bottom 3.5s ease, box-shadow 3.5s ease';
      }
      if (footer) {
        footer.style.transition = 'background-color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-top 3.5s ease, box-shadow 3.5s ease';
      }
      document.querySelectorAll('.header .nav-link').forEach(link => {
        link.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
      const logo = document.querySelector('.header .logo');
      if (logo) logo.style.transition = 'filter 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      const menuIcon = document.querySelector('.header .menu-icon');
      if (menuIcon) menuIcon.style.transition = 'filter 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      document.querySelectorAll('.footer .footerTitleTypography, .footer .footer-title, .footer .footerTextTypography, .footer a').forEach(el => {
        el.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
      document.querySelectorAll('.tri-lock-btn').forEach(btn => {
        btn.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });

      header?.classList.add("cauzito-active");
      footer?.classList.add("cauzito-active");

      if (hamburgerMenu) {
        hamburgerMenu.classList.add('cauzito-initial');
        requestAnimationFrame(() => {
          hamburgerMenu.classList.remove('cauzito-initial');
          hamburgerMenu.classList.add('cauzito-theme-active');
        });
      }
    }, { once: true });
  }

  // ─── Yggdrasil Page Theme ───
  if (body.classList.contains('yggdrasil-page')) {
    const header = document.querySelector(".header");
    const footer = document.querySelector("footer");
    const hamburgerMenu = document.getElementById("hamburgerMenu");

    document.addEventListener('loadingScreenHidden', () => {
      if (header) {
        header.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-bottom 3.5s ease, box-shadow 3.5s ease';
      }
      if (footer) {
        footer.style.transition = 'background-color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-top 3.5s ease, box-shadow 3.5s ease';
      }
      document.querySelectorAll('.header .nav-link').forEach(link => {
        link.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
      const logo = document.querySelector('.header .logo');
      if (logo) logo.style.transition = 'filter 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      const menuIcon = document.querySelector('.header .menu-icon');
      if (menuIcon) menuIcon.style.transition = 'filter 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      document.querySelectorAll('.footer .footerTitleTypography, .footer .footer-title, .footer .footerTextTypography, .footer a').forEach(el => {
        el.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
      document.querySelectorAll('.tri-lock-btn').forEach(btn => {
        btn.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });

      header?.classList.add("yggdrasil-active");
      footer?.classList.add("yggdrasil-active");

      if (hamburgerMenu) {
        hamburgerMenu.classList.add('yggdrasil-initial');
        requestAnimationFrame(() => {
          hamburgerMenu.classList.remove('yggdrasil-initial');
          hamburgerMenu.classList.add('yggdrasil-theme-active');
        });
      }
    }, { once: true });
  }

  // ─── Thresh Page Theme ───
  if (body.classList.contains('thresh-page')) {
    const header = document.querySelector(".header");
    const footer = document.querySelector("footer");
    const hamburgerMenu = document.getElementById("hamburgerMenu");

    document.addEventListener('loadingScreenHidden', () => {
      if (header) {
        header.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-bottom 3.5s ease, box-shadow 3.5s ease';
      }
      if (footer) {
        footer.style.transition = 'background-color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-top 3.5s ease, box-shadow 3.5s ease';
      }
      document.querySelectorAll('.header .nav-link').forEach(link => {
        link.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
      const logo = document.querySelector('.header .logo');
      if (logo) logo.style.transition = 'filter 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      const menuIcon = document.querySelector('.header .menu-icon');
      if (menuIcon) menuIcon.style.transition = 'filter 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      document.querySelectorAll('.footer .footerTitleTypography, .footer .footer-title, .footer .footerTextTypography, .footer a').forEach(el => {
        el.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
      document.querySelectorAll('.tri-lock-btn').forEach(btn => {
        btn.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });

      header?.classList.add("thresh-active");
      footer?.classList.add("thresh-active");

      if (hamburgerMenu) {
        hamburgerMenu.classList.add('thresh-initial');
        requestAnimationFrame(() => {
          hamburgerMenu.classList.remove('thresh-initial');
          hamburgerMenu.classList.add('thresh-theme-active');
        });
      }
    }, { once: true });
  }

  // ─── Zed Page Theme ───
  if (body.classList.contains('zed-page')) {
    const header = document.querySelector(".header");
    const footer = document.querySelector("footer");
    const hamburgerMenu = document.getElementById("hamburgerMenu");

    document.addEventListener('loadingScreenHidden', () => {
      if (header) {
        header.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-bottom 3.5s ease, box-shadow 3.5s ease';
      }
      if (footer) {
        footer.style.transition = 'background-color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-top 3.5s ease, box-shadow 3.5s ease';
      }
      document.querySelectorAll('.header .nav-link').forEach(link => {
        link.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
      const logo = document.querySelector('.header .logo');
      if (logo) logo.style.transition = 'filter 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      const menuIcon = document.querySelector('.header .menu-icon');
      if (menuIcon) menuIcon.style.transition = 'filter 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      document.querySelectorAll('.footer .footerTitleTypography, .footer .footer-title, .footer .footerTextTypography, .footer a').forEach(el => {
        el.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
      document.querySelectorAll('.tri-lock-btn').forEach(btn => {
        btn.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });

      header?.classList.add("zed-active");
      footer?.classList.add("zed-active");

      if (hamburgerMenu) {
        hamburgerMenu.classList.add('zed-initial');
        requestAnimationFrame(() => {
          hamburgerMenu.classList.remove('zed-initial');
          hamburgerMenu.classList.add('zed-theme-active');
        });
      }
    }, { once: true });
  }

  // ─── Killjoy Page Theme ───
  if (body.classList.contains("killjoy-page")) {
    const header = document.querySelector(".header");
    const footer = document.querySelector("footer");
    const hamburgerMenu = document.getElementById("hamburgerMenu");

    document.addEventListener('loadingScreenHidden', () => {
      // Set inline transitions first so browser records the "from" values
      if (header) {
        header.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-bottom 3.5s ease, box-shadow 3.5s ease';
      }
      if (footer) {
        footer.style.transition = 'background-color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-top 3.5s ease, box-shadow 3.5s ease';
      }
      document.querySelectorAll('.header .nav-link').forEach(link => {
        link.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
      const logo = document.querySelector('.header .logo');
      if (logo) logo.style.transition = 'filter 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      const menuIcon = document.querySelector('.header .menu-icon');
      if (menuIcon) menuIcon.style.transition = 'filter 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      document.querySelectorAll('.footer .footerTitleTypography, .footer .footer-title, .footer .footerTextTypography, .footer a').forEach(el => {
        el.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
      document.querySelectorAll('.tri-lock-btn').forEach(btn => {
        btn.style.transition = 'color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });

      // Apply killjoy theme classes (CSS defines final colors)
      header?.classList.add("killjoy-active");
      footer?.classList.add("killjoy-active");

      // Hamburger — initial state then animate to active
      if (hamburgerMenu) {
        hamburgerMenu.classList.add('killjoy-initial');
        requestAnimationFrame(() => {
          hamburgerMenu.classList.remove('killjoy-initial');
          hamburgerMenu.classList.add('killjoy-theme-active');
        });
      }
    }, { once: true });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(
    ".tarkov-3d-carousel-section .carousel"
  );
  if (!carousel) return;
  const cards = carousel.querySelectorAll(".card");
  const subtitle = document.getElementById("carouselSubtitle");

  // Array of subtitles in order
  const subtitles = [
    "Settings & PostFX",
    "Menu with Friend List",
    "Selection Wheel",
    "Selection Page",
    "Flea Market",
  ];

  let currentIndex = 0;
  const totalCards = cards.length;
  const theta = (2 * Math.PI) / totalCards;
  const radius = 1900;

  function updateSubtitle(index) {
    if (!subtitle) return;
    subtitle.classList.remove("visible");
    setTimeout(() => {
      const subtitleText = subtitle.querySelector('.subtitle-text');
      if (subtitleText) {
        subtitleText.textContent = subtitles[index];
      } else {
        // Fallback for older structure
        subtitle.textContent = subtitles[index];
      }
      subtitle.classList.add("visible");
    }, 300); // Match this to your CSS transition
  }

  function arrangeCards() {
    console.log(`Arranging cards, currentIndex: ${currentIndex}`);
    
    // Get fresh card references from the DOM each time
    const currentCards = carousel.querySelectorAll('.card');
    
    currentCards.forEach((card, index) => {
      const angle = theta * index;
      card.style.transform = `translateX(-50%) rotateY(${angle}rad) translateZ(${radius}px)`;
      
      // Add/remove active class based on current index
      if (index === currentIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
      
      // Special handling for clickable cards to ensure they stay clickable in all positions
      if (index === 0 || index === 1 || index === 2 || index === 3 || index === 4) { // Settings & PostFX (0), Menu with Friend List (1), Selection Wheel (2), Selection Page (3), Flea Market (4)
        // Only apply click functionality and styling when the card is active (in center)
        if (index === currentIndex) {
          // Force higher z-index and ensure visibility
          card.style.zIndex = '25';
          card.style.pointerEvents = 'auto';
          
          // Only enable click functionality on big screens (1280px+)
          const screenWidth = window.innerWidth;
          if (screenWidth >= 1280) {
            card.style.cursor = 'pointer';
            
            // Apply special styling to all child elements
            const allChildren = card.querySelectorAll('*');
            allChildren.forEach(child => {
              child.style.pointerEvents = 'auto';
              child.style.cursor = 'pointer';
            });
            
            // Remove any existing click handlers to avoid duplicates
            const clonedCard = card.cloneNode(true);
            card.parentNode.replaceChild(clonedCard, card);
            
            clonedCard.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              
              // First show the full case study if it's not visible
              const btn = document.getElementById("viewCaseStudyBtn");
              const section = document.getElementById("fullCaseStudyTarkov");
              if (btn && btn.style.display !== "none") {
                btn.style.display = "none";
                section.style.display = "block";
              }
              
              // Navigate to appropriate section based on card index
              let targetSection;
              if (index === 0) {
                // Settings & PostFX card
                console.log('Settings card clicked, navigating to Settings Enhancements section');
                targetSection = document.getElementById('settings-enhancements');
              } else if (index === 1) {
                // Menu with Friend List card
                console.log('Friend List card clicked, navigating to Friend System Overhaul section');
                targetSection = document.getElementById('friend-system-overhaul');
              } else if (index === 2) {
                // Selection Wheel card
                console.log('Selection Wheel card clicked, navigating to Raid UI Enhancements section');
                targetSection = document.getElementById('raid-ui-enhancements');
              } else if (index === 3) {
                // Selection Page card
                console.log('Selection Page card clicked, navigating to Pre-Raid Group Coordination section');
                targetSection = document.getElementById('pre-raid-group-coordination');
              } else if (index === 4) {
                // Flea Market card
                console.log('Flea Market card clicked, navigating to Flea Market section');
                targetSection = document.getElementById('flea-market');
              }
              
              if (targetSection) {
                // Center the title in the viewport
                const rect = targetSection.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const elementHeight = rect.height;
                // Calculate offset to center the element in the viewport
                const yOffset = -(viewportHeight / 2) + (elementHeight / 2);
                const y = rect.top + window.pageYOffset + yOffset;
                
                window.scrollTo({top: y, behavior: 'smooth'});
              }
            });
            
            console.log(`Clickable card ${index} arranged at angle: ${angle}, position: center (active)`);
          } else {
            // For medium and small screens, completely disable click functionality
            card.style.cursor = 'default';
            card.style.pointerEvents = 'none';
            
            // Remove any existing click listeners by cloning the card
            const clonedCard = card.cloneNode(true);
            card.parentNode.replaceChild(clonedCard, card);
            
            // Completely disable all interactions on the cloned card
            clonedCard.style.cursor = 'default';
            clonedCard.style.pointerEvents = 'none';
            
            // Ensure all child elements are non-clickable
            const allChildren = clonedCard.querySelectorAll('*');
            allChildren.forEach(child => {
              child.style.pointerEvents = 'none';
              child.style.cursor = 'default';
              // Remove any onclick attributes that might exist
              child.removeAttribute('onclick');
            });
            
            // Also remove any onclick from the main card
            clonedCard.removeAttribute('onclick');
            
            console.log(`Clickable card ${index} arranged at angle: ${angle}, position: center (active) - click completely disabled on medium/small screen`);
          }
        } else {
          // When not active, remove special styling and click functionality
          card.style.zIndex = '';
          card.style.pointerEvents = 'none';
          card.style.cursor = 'default';
          
          // Remove special styling from child elements
          const allChildren = card.querySelectorAll('*');
          allChildren.forEach(child => {
            child.style.pointerEvents = 'none';
            child.style.cursor = 'default';
          });
          
          console.log(`Clickable card ${index} arranged at angle: ${angle}, position: side (inactive)`);
        }
      } else {
        // For non-clickable cards, ensure they're properly disabled
        card.style.pointerEvents = 'none';
        card.style.cursor = 'default';
        card.style.zIndex = '';
        
        const allChildren = card.querySelectorAll('*');
        allChildren.forEach(child => {
          child.style.pointerEvents = 'none';
          child.style.cursor = 'default';
        });
      }
    });
    carousel.style.transform = `translateZ(-${radius}px) rotateY(${
      -currentIndex * theta
    }rad)`;
    updateSubtitle(currentIndex);
  }

  // Create invisible click areas for better click detection
  function createClickAreas() {
    const scene = document.querySelector('.tarkov-3d-carousel-section .scene');
    if (!scene) return;
    
    // Create a container for click areas
    const clickContainer = document.createElement('div');
    clickContainer.className = 'carousel-click-areas';
    
    // Create click areas for left and right sides - let CSS handle the styling
    const leftClickArea = document.createElement('div');
    leftClickArea.className = 'click-area left-area';
    
    const rightClickArea = document.createElement('div');
    rightClickArea.className = 'click-area right-area';
    
    // Add click handlers for the areas
    leftClickArea.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Hide arrows immediately
      leftClickArea.style.opacity = '0';
      rightClickArea.style.opacity = '0';
      
      const leftIndex = (currentIndex - 1 + totalCards) % totalCards;
      console.log(`Left click area clicked, navigating to card ${leftIndex}`);
      currentIndex = leftIndex;
      arrangeCards();
      
      // Calculate timeout based on screen size to match CSS transition durations
      let timeout = 1100; // Default for desktop (1s + buffer)
      if (window.innerWidth <= 480) {
        timeout = 2100; // 2s transition + buffer for very small screens
      } else if (window.innerWidth <= 768) {
        timeout = 1600; // 1.5s transition + buffer for tablets/small screens
      }
      
      // Show arrows again after animation completes
      setTimeout(() => {
        leftClickArea.style.opacity = '1';
        rightClickArea.style.opacity = '1';
      }, timeout);
    });
    
    rightClickArea.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Hide arrows immediately  
      leftClickArea.style.opacity = '0';
      rightClickArea.style.opacity = '0';
      
      const rightIndex = (currentIndex + 1) % totalCards;
      console.log(`Right click area clicked, navigating to card ${rightIndex}`);
      currentIndex = rightIndex;
      arrangeCards();
      
      // Calculate timeout based on screen size to match CSS transition durations
      let timeout = 1100; // Default for desktop (1s + buffer)
      if (window.innerWidth <= 480) {
        timeout = 2100; // 2s transition + buffer for very small screens
      } else if (window.innerWidth <= 768) {
        timeout = 1600; // 1.5s transition + buffer for tablets/small screens
      }
      
      // Show arrows again after animation completes
      setTimeout(() => {
        leftClickArea.style.opacity = '1';
        rightClickArea.style.opacity = '1';
      }, timeout);
    });
    
    clickContainer.appendChild(leftClickArea);
    clickContainer.appendChild(rightClickArea);
    scene.appendChild(clickContainer);
  }
  
  arrangeCards();
  updateSubtitle(currentIndex);
  createClickAreas();

  // Mobile touch/swipe functionality (now includes tablet and tablet normal)
  function initializeMobileCarousel() {
    // Only run on non-grocery pages
    if (document.querySelector('.grocery-page')) {
      console.log('Skipping mobile carousel - grocery page detected');
      return;
    }
    if (window.innerWidth > 1279) return; // Only for mobile, tablet, and tablet normal screens
    
    const scene = document.querySelector('.tarkov-3d-carousel-section .scene');
    const carouselSection = document.querySelector('.tarkov-3d-carousel-section');
    
    if (!scene || !carouselSection) return;

    // Create mobile navigation arrows beside subtitle
    const subtitle = document.querySelector('.tarkov-3d-carousel-section .carousel-subtitle');
    if (subtitle && !subtitle.querySelector('.mobile-nav-arrow')) {
      const subtitleText = subtitle.textContent;
      subtitle.innerHTML = `
        <div class="mobile-nav-arrow left" data-direction="left"></div>
        <span class="subtitle-text">${subtitleText}</span>
        <div class="mobile-nav-arrow right" data-direction="right"></div>
      `;

      // Add click handlers for mobile arrows
      const leftArrow = subtitle.querySelector('.mobile-nav-arrow.left');
      const rightArrow = subtitle.querySelector('.mobile-nav-arrow.right');
      
      leftArrow.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        arrangeCards();
      });
      
      rightArrow.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % totalCards;
        arrangeCards();
      });
    }

    // Add event listeners for subtitle navigation arrows (medium screen)
    const subtitleLeftArrow = document.getElementById('subtitleLeftArrow');
    const subtitleRightArrow = document.getElementById('subtitleRightArrow');
    
    if (subtitleLeftArrow) {
      subtitleLeftArrow.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        arrangeCards();
      });
    }
    
    if (subtitleRightArrow) {
      subtitleRightArrow.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % totalCards;
        arrangeCards();
      });
    }

    // Add swipe indicator with dynamic text based on input type (only for medium and smaller screens)
    const isMediumOrSmaller = window.innerWidth <= 1279;
    
    if (isMediumOrSmaller && !carouselSection.querySelector('.swipe-indicator')) {
      const swipeIndicator = document.createElement('div');
      swipeIndicator.className = 'swipe-indicator';
      
      // Input detection for medium screens only
      const isMediumScreen = window.innerWidth >= 769 && window.innerWidth <= 1279;
      
      if (isMediumScreen) {
        // For medium screens, detect input type
        let inputType = 'unknown';
        let textSet = false;
        
        // Initial text (default to touch)
        swipeIndicator.textContent = 'Swipe sideways to navigate';
        
        // Listen for first interaction to determine input type
        const detectInputType = (e) => {
          if (!textSet) {
            if (e.type === 'mousedown' || e.pointerType === 'mouse') {
              inputType = 'mouse';
              swipeIndicator.textContent = 'Click arrows to navigate';
            } else if (e.type === 'touchstart' || e.pointerType === 'touch') {
              inputType = 'touch';
              swipeIndicator.textContent = 'Swipe sideways to navigate';
            }
            textSet = true;
            
            // Remove listeners after first detection
            document.removeEventListener('mousedown', detectInputType);
            document.removeEventListener('touchstart', detectInputType);
            document.removeEventListener('pointerdown', detectInputType);
          }
        };
        
        // Add detection listeners
        document.addEventListener('mousedown', detectInputType, { passive: true });
        document.addEventListener('touchstart', detectInputType, { passive: true });
        document.addEventListener('pointerdown', detectInputType, { passive: true });
        
      } else {
        // For smaller screens, always show swipe text (touch devices)
        swipeIndicator.textContent = 'Swipe sideways to navigate';
      }
      
      carouselSection.appendChild(swipeIndicator);
    }

    // Touch/swipe variables
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let isDragging = false;
    let startTime = 0;

    // Touch event handlers
    function handleTouchStart(e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
      isDragging = true;
      
      // Add visual feedback
      carousel.style.cursor = 'grabbing';
      carousel.style.transition = 'none';
    }

    function handleTouchMove(e) {
      if (!isDragging) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;
      
      // Prevent vertical scrolling if horizontal movement is detected
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        e.preventDefault();
      }
    }

    function handleTouchEnd(e) {
      if (!isDragging) return;
      
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const deltaTime = Date.now() - startTime;
      
      // Restore cursor and transition
      carousel.style.cursor = 'grab';
      carousel.style.transition = 'transform 0.6s ease-out';
      
      // Determine if it's a valid swipe
      const minSwipeDistance = 50; // Minimum distance for swipe
      const maxSwipeTime = 500; // Maximum time for swipe
      const maxVerticalMovement = 100; // Maximum vertical movement allowed
      
      const isHorizontalSwipe = Math.abs(deltaX) > minSwipeDistance;
      const isQuickSwipe = deltaTime < maxSwipeTime;
      const isNotVerticalScroll = Math.abs(deltaY) < maxVerticalMovement;
      const isMainlyHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
      
      if (isHorizontalSwipe && isQuickSwipe && isNotVerticalScroll && isMainlyHorizontal) {
        if (deltaX > 0) {
          // Swipe right - go to previous card
          currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        } else {
          // Swipe left - go to next card  
          currentIndex = (currentIndex + 1) % totalCards;
        }
        arrangeCards();
        
        // Hide swipe indicator after first use
        const indicator = carouselSection.querySelector('.swipe-indicator');
        if (indicator) {
          indicator.style.opacity = '0';
          setTimeout(() => indicator.remove(), 300);
        }
      }
      
      isDragging = false;
    }

    // Add touch event listeners to carousel
    carousel.addEventListener('touchstart', handleTouchStart, { passive: false });
    carousel.addEventListener('touchmove', handleTouchMove, { passive: false });
    carousel.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Also add to scene for better coverage
    scene.addEventListener('touchstart', handleTouchStart, { passive: false });
    scene.addEventListener('touchmove', handleTouchMove, { passive: false });
    scene.addEventListener('touchend', handleTouchEnd, { passive: false });
  }

  // Initialize mobile carousel if on mobile, tablet, or tablet normal (only for NON-grocery pages)
  if (!document.querySelector('.grocery-page')) {
    initializeMobileCarousel();
  }
  
  // Re-initialize on window resize
  window.addEventListener('resize', () => {
    // Remove existing mobile elements if switching away from mobile/tablet/tablet normal
    if (window.innerWidth > 1279) {
      const existingArrows = document.querySelectorAll('.mobile-nav-arrow');
      const existingIndicator = document.querySelector('.swipe-indicator');
      
      existingArrows.forEach(arrow => arrow.remove());
      if (existingIndicator) existingIndicator.remove();
      
      // Restore original subtitle
      const subtitle = document.querySelector('.tarkov-3d-carousel-section .carousel-subtitle');
      const subtitleText = subtitle?.querySelector('.subtitle-text');
      if (subtitle && subtitleText) {
        subtitle.textContent = subtitleText.textContent;
      }
    } else {
      // Re-initialize for mobile/tablet/tablet normal
      if (!document.querySelector('.grocery-page')) {
        initializeMobileCarousel();
      }
    }
    
    // Always re-arrange cards to update click behavior based on current screen size
    arrangeCards();
  });
});

// Show full case study and hide button on click
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("viewCaseStudyBtn");
  const section = document.getElementById("fullCaseStudyTarkov");
  if (btn && section) {
    btn.addEventListener("click", function () {
      btn.style.display = "none";
      section.style.display = "block";
      section.scrollIntoView({ behavior: "smooth" });
      
      // Trigger scroll event to activate navigator after a brief delay
      setTimeout(function() {
        window.dispatchEvent(new Event('scroll'));
      }, 200); // Delay to ensure scrollIntoView and display changes are processed
    });
  }
});

// Smart Header Behavior - Hide on scroll down, show on scroll up or top hover
document.addEventListener('DOMContentLoaded', function() {
    let lastScrollTop = 0;
    let isHeaderVisible = true;
    let scrollThreshold = 100; // Minimum scroll distance before hiding header
    let hoverZoneHeight = 80; // Height of hover zone at top of page
    let scrollTimer = null;
    let isInitialized = false;
    
    const header = document.querySelector('.header');
    if (!header) return;

    // Check if mobile (768px or less)
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Initialize header behavior for desktop
    function initializeHeaderBehavior() {
        if (isInitialized || isMobile()) return;
        
        // Add CSS transition for smooth header animation - include background-color for theme compatibility
        const body = document.body;
        if (body.classList.contains("grocery-page")) {
            // For grocery page, maintain both transform and color transitions
            header.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 3s ease-in-out, box-shadow 3s ease-in-out, border-bottom 3s ease-in-out, color 3s ease-in-out';
        } else if (body.classList.contains("tarkov-page") || body.classList.contains("grocery-page")) {
            header.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        } else {
            header.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
        header.style.position = 'fixed';
        header.style.top = '0';
        header.style.left = '0';
        header.style.right = '0';
        header.style.zIndex = '999'; // Lower than hamburger menu z-index: 10000
        
        // Remove any existing body padding
        document.body.style.paddingTop = '0';
        
        // Add event listeners
        window.addEventListener('scroll', throttledScroll, { passive: true });
        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
        header.addEventListener('mouseenter', showHeader);
        
        // Initialize header state based on current scroll position
        const initialScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (initialScrollTop > scrollThreshold) {
            hideHeader();
        }
        
        isInitialized = true;
    }
    
    // Cleanup header behavior for mobile
    function cleanupHeaderBehavior() {
        if (!isInitialized) return;
        
        // Remove event listeners
        window.removeEventListener('scroll', throttledScroll);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
        header.removeEventListener('mouseenter', showHeader);
        
        // Reset header styles
        header.style.transform = 'translateY(0)';
        header.style.position = '';
        header.style.top = '';
        header.style.left = '';
        header.style.right = '';
        header.style.zIndex = '';
        header.style.transition = '';
        
        document.body.style.paddingTop = '';
        isHeaderVisible = true;
        isInitialized = false;
    }

    
    // Handle window resize - switch between mobile and desktop behavior
    window.addEventListener('resize', function() {
        if (isMobile()) {
            cleanupHeaderBehavior();
        } else {
            initializeHeaderBehavior();
        }
    });

    function hideHeader() {
        if (isMobile()) return; // Never hide on mobile
        if (isMobile() && document.body.classList.contains('about-page')) return; // Never hide on about page on mobile
        if (isHeaderVisible) {
            header.style.transform = 'translateY(-100%)';
            isHeaderVisible = false;
        }
    }
    
    function showHeader() {
        if (!isHeaderVisible) {
            header.style.transform = 'translateY(0)';
            isHeaderVisible = true;
        }
    }
    
    // Handle scroll behavior
    function handleScroll() {
        if (isMobile()) return; // Skip on mobile
        
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Don't hide header if we're near the top of the page
        if (currentScrollTop < scrollThreshold) {
            showHeader();
            lastScrollTop = currentScrollTop;
            return;
        }
        
        // Determine scroll direction
        const scrollingDown = currentScrollTop > lastScrollTop;
        const scrollingUp = currentScrollTop < lastScrollTop;
        
        // Only act if there's significant scroll movement (prevents jitter)
        const scrollDifference = Math.abs(currentScrollTop - lastScrollTop);
        if (scrollDifference < 5) return;
        
        if (scrollingDown && isHeaderVisible) {
            hideHeader();
        } else if (scrollingUp && !isHeaderVisible) {
            showHeader();
        }
        
        lastScrollTop = currentScrollTop;
    }
    
    // Handle mouse movement near top of page
    function handleMouseMove(e) {
        if (isMobile()) return; // Skip on mobile
        
        const mouseY = e.clientY;
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show header if mouse is in the hover zone at top of viewport
        if (mouseY <= hoverZoneHeight && currentScrollTop > scrollThreshold) {
            showHeader();
        }
    }
    
    // Handle mouse leave from top area
    function handleMouseLeave(e) {
        if (isMobile()) return; // Skip on mobile
        
        const mouseY = e.clientY;
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Hide header if mouse leaves top area and we're scrolled down
        if (mouseY > hoverZoneHeight && currentScrollTop > scrollThreshold) {
            // Add a small delay to prevent flickering
            setTimeout(() => {
                const newScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if (newScrollTop > scrollThreshold && !isMouseInTopZone()) {
                    hideHeader();
                }
            }, 500);
        }
    }
    
    // Check if mouse is currently in top zone
    function isMouseInTopZone() {
        return document.querySelector(':hover') === document.documentElement ||
               document.elementFromPoint(window.innerWidth/2, hoverZoneHeight/2) !== null;
    }
    
    // Throttle scroll events for better performance
    function throttledScroll() {
        if (isMobile()) return; // Skip on mobile
        if (scrollTimer) return;
        
        scrollTimer = setTimeout(() => {
            handleScroll();
            scrollTimer = null;
        }, 16); // ~60fps
    }

    // Initialize behavior based on current screen size
    if (!isMobile()) {
        initializeHeaderBehavior();
    }
    
    // Special handling for Tarkov/Grocery/Marketplace pages
    if (document.body.classList.contains('tarkov-page') || document.body.classList.contains('grocery-page') || document.body.classList.contains('marketplace-page')) {
        // Ensure header transitions work with Tarkov theme
        header.addEventListener('transitionend', function(e) {
            if (e.propertyName === 'transform' && !isHeaderVisible) {
                // Header is now hidden, you can add additional logic here if needed
            }
        });
    }
    
    // Handle page visibility change (only on desktop)
    document.addEventListener('visibilitychange', function() {
        if (!isMobile() && document.visibilityState === 'visible') {
            // Recalculate header state when page becomes visible
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScrollTop <= scrollThreshold) {
                showHeader();
            }
        }
    });
});

// =============================================
// TARKOV PAGE SPECIFIC HEADER BEHAVIOR - INDEPENDENT OF COLOR SYSTEM
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    // Only run on Tarkov page
    if (!document.body.classList.contains('tarkov-page') && !document.body.classList.contains('grocery-page') && !document.body.classList.contains('marketplace-page')) return;
    
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollTop = 0;
    let isHeaderVisible = true;
    let scrollThreshold = 100;
    let hoverZoneHeight = 80;
    let scrollTimer = null;
    
    // Check if mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Show header function
    function showTarkovHeader() {
        if (!isHeaderVisible && !isMobile()) {
            header.style.transform = 'translateY(0)';
            isHeaderVisible = true;
        }
    }
    
    // Hide header function  
    function hideTarkovHeader() {
        if (isHeaderVisible && !isMobile()) {
            header.style.transform = 'translateY(-100%)';
            isHeaderVisible = false;
        }
    }
    
    // Throttled scroll handler
    function throttledTarkovScroll() {
        if (scrollTimer) return;
        scrollTimer = setTimeout(() => {
            handleTarkovScroll();
            scrollTimer = null;
        }, 16); // ~60fps
    }
    
    // Handle scroll behavior
    function handleTarkovScroll() {
        if (isMobile()) return;
        
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show header if near top
        if (currentScrollTop < scrollThreshold) {
            showTarkovHeader();
            lastScrollTop = currentScrollTop;
            return;
        }
        
        // Determine scroll direction
        const scrollingDown = currentScrollTop > lastScrollTop;
        const scrollingUp = currentScrollTop < lastScrollTop;
        
        // Prevent jitter - minimum scroll difference
        const scrollDifference = Math.abs(currentScrollTop - lastScrollTop);
        if (scrollDifference < 5) return;
        
        if (scrollingDown && isHeaderVisible) {
            hideTarkovHeader();
        } else if (scrollingUp && !isHeaderVisible) {
            showTarkovHeader();
        }
        
        lastScrollTop = currentScrollTop;
    }
    
    // Handle mouse movement near top
    function handleTarkovMouseMove(e) {
        if (isMobile()) return;
        
        const mouseY = e.clientY;
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (mouseY <= hoverZoneHeight && currentScrollTop > scrollThreshold) {
            showTarkovHeader();
        }
    }
    
    // Initialize Tarkov header behavior
    function initTarkovHeaderBehavior() {
        if (isMobile()) return;
        
        // Add smooth transition for both header animation and color changes
        header.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        window.addEventListener('scroll', throttledTarkovScroll, { passive: true });
        document.addEventListener('mousemove', handleTarkovMouseMove, { passive: true });
        header.addEventListener('mouseenter', showTarkovHeader);
        
        // Set initial state
        const initialScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (initialScrollTop > scrollThreshold) {
            hideTarkovHeader();
        } else {
            showTarkovHeader();
        }
    }
    
    // Cleanup Tarkov header behavior
    function cleanupTarkovHeaderBehavior() {
        window.removeEventListener('scroll', throttledTarkovScroll);
        document.removeEventListener('mousemove', handleTarkovMouseMove);
        header.removeEventListener('mouseenter', showTarkovHeader);
        
        // Reset header transform but preserve all transitions
        header.style.transform = 'translateY(0)';
        // Keep both transitions - transform for header behavior and background-color for theme
        header.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        isHeaderVisible = true;
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (isMobile()) {
            cleanupTarkovHeaderBehavior();
        } else {
            initTarkovHeaderBehavior();
        }
    });
    
    // Initialize
    initTarkovHeaderBehavior();
});


// ---- Project Filter Positioning Logic ----

function updateIndicators(activeIndex) {
    const indicators = document.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === activeIndex);
    });
}

function isDesktopScreen() {
    return window.innerWidth >= 1280;
}

function isMobileOrMediumScreen() {
    return window.innerWidth < 1280;
}

// Different positioning for desktop vs mobile/medium
function getTranslateValue(index) {
    const isMobile = isMobileOrMediumScreen();
    
    if (isMobile) {
        // Mobile/Medium: Each slide takes 65% width, so move by 65% per slide with 17.5% offset for centering
        const translateX = -index * 65 + 17.5;
        console.log('Mobile transform calculation:', {
            index,
            translateX,
            screenWidth: window.innerWidth
        });
        return translateX;
    } else {
        // Desktop: Use closer spacing (50% width with 25% offset for centering)
        const translateX = -index * 50 + 25;
        console.log('Desktop transform calculation:', {
            index,
            translateX,
            screenWidth: window.innerWidth
        });
        return translateX;
    }
}

function goToSlide(targetIndex) {
    const wrapper = document.querySelector('.carousel-wrapper');
    const items = document.querySelectorAll('.carousel-item');
    
    if (!wrapper || !items.length) return;
    
    const screenWidth = window.innerWidth;
    const isMobile = isMobileOrMediumScreen();
    
    console.log('goToSlide called:', {
        targetIndex,
        currentIndex: testCurrentIndex,
        screenWidth,
        isMobile,
        totalItems: items.length
    });
    
    // Apply different boundary logic based on screen size
    if (isMobile) {
        // Mobile/Medium: Strict boundaries, no cycling
        const boundedIndex = Math.max(0, Math.min(targetIndex, items.length - 1));
        if (boundedIndex !== targetIndex) {
            console.log('Boundary hit! Requested:', targetIndex, 'Bounded to:', boundedIndex);
        }
        targetIndex = boundedIndex;
    } else {
        // Desktop: Allow infinite cycling
        if (targetIndex < 0) targetIndex = items.length - 1;
        if (targetIndex >= items.length) targetIndex = 0;
    }
    
    testCurrentIndex = targetIndex;
    
    // Apply transform based on screen size
    const translateX = getTranslateValue(testCurrentIndex);
    console.log('Setting transform:', translateX + '%');
    
    wrapper.style.transform = `translateX(${translateX}%)`;
    wrapper.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    // Update center class
    items.forEach((item, index) => {
        item.classList.toggle('center', index === testCurrentIndex);
    });
    
    // Update description and indicators
    updateDescription(testCurrentIndex);
    updateIndicators(testCurrentIndex);
    
    console.log('Final position - Index:', testCurrentIndex, 'Transform:', translateX + '%');
}

// Button navigation
function testNext() {
    const items = document.querySelectorAll('.carousel-item');
    const isMobile = isMobileOrMediumScreen();
    
    console.log('testNext called:', {
        currentIndex: testCurrentIndex,
        totalItems: items.length,
        isMobile,
        screenWidth: window.innerWidth
    });
    
    if (!items.length) return;
    
    if (isMobile) {
        // Mobile/Medium: Stop at last slide
        if (testCurrentIndex < items.length - 1) {
            console.log('Moving to next slide');
            goToSlide(testCurrentIndex + 1);
        } else {
            console.log('At last slide, cannot go further');
        }
    } else {
        // Desktop: Infinite cycling
        console.log('Desktop mode - infinite cycling');
        goToSlide(testCurrentIndex + 1);
    }
}

function testPrev() {
    const items = document.querySelectorAll('.carousel-item');
    const isMobile = isMobileOrMediumScreen();
    
    console.log('testPrev called:', {
        currentIndex: testCurrentIndex,
        totalItems: items.length,
        isMobile,
        screenWidth: window.innerWidth
    });
    
    if (!items.length) return;
    
    if (isMobile) {
        // Mobile/Medium: Stop at first slide
        if (testCurrentIndex > 0) {
            console.log('Moving to previous slide');
            goToSlide(testCurrentIndex - 1);
        } else {
            console.log('At first slide, cannot go further');
        }
    } else {
        // Desktop: Infinite cycling
        console.log('Desktop mode - infinite cycling');
        goToSlide(testCurrentIndex - 1);
    }
}

// Drag functionality - completely rewritten for proper boundary handling
function handleDragStart(e) {
    isDragging = true;
    startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    currentX = startX;
    
    const wrapper = document.querySelector('.carousel-wrapper');
    if (wrapper) {
        wrapper.style.transition = 'none'; // Disable transition during drag
    }
    
    e.preventDefault();
    console.log('Drag started at:', startX);
}

function handleDragMove(e) {
    if (!isDragging) return;
    
    currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const deltaX = currentX - startX;
    const wrapper = document.querySelector('.carousel-wrapper');
    const items = document.querySelectorAll('.carousel-item');
    
    if (!wrapper || !items.length) return;
    
    // Calculate base position for current slide
    const baseTranslateX = getTranslateValue(testCurrentIndex);
    
    if (isMobileOrMediumScreen()) {
        // Mobile/Medium: Add resistance at boundaries
        let dragPercent = (deltaX / window.innerWidth) * 100;
        
        // At first slide - add resistance when dragging right
        if (testCurrentIndex === 0 && deltaX > 0) {
            dragPercent = dragPercent * 0.3; // Heavy resistance
        }
        
        // At last slide - add resistance when dragging left
        if (testCurrentIndex === items.length - 1 && deltaX < 0) {
            dragPercent = dragPercent * 0.3; // Heavy resistance
        }
        
        wrapper.style.transform = `translateX(${baseTranslateX + dragPercent}%)`;
    } else {
        // Desktop: Free drag movement for smooth infinite cycling
        const dragPercent = (deltaX / window.innerWidth) * 100;
        wrapper.style.transform = `translateX(${baseTranslateX + dragPercent}%)`;
    }
    
    e.preventDefault();
}

function handleDragEnd(e) {
    if (!isDragging) return;
    
    isDragging = false;
    const deltaX = currentX - startX;
    const wrapper = document.querySelector('.carousel-wrapper');
    const items = document.querySelectorAll('.carousel-item');
    const isMobile = isMobileOrMediumScreen();
    
    if (wrapper) {
        wrapper.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // Smooth transition back
    }
    
    console.log('Drag ended:', {
        deltaX,
        threshold: dragThreshold,
        currentIndex: testCurrentIndex,
        isMobile,
        screenWidth: window.innerWidth,
        totalItems: items.length
    });
    
    // Check if drag was significant enough
    if (Math.abs(deltaX) > dragThreshold) {
        if (deltaX > 0) {
            // Dragged right - go to previous slide
            console.log('Dragged right - attempting to go to previous slide');
            testPrev();
        } else {
            // Dragged left - go to next slide
            console.log('Dragged left - attempting to go to next slide');
            testNext();
        }
    } else {
        // Snap back to current slide
        console.log('Drag not significant enough, snapping back');
        goToSlide(testCurrentIndex);
    }
}

// Initialize the carousel when DOM is loaded (ONLY ON GROCERY PAGE)
document.addEventListener('DOMContentLoaded', function() {
    // Only run new carousel system on grocery page
    if (!document.querySelector('.grocery-page')) {
        console.log('Skipping new carousel - not on grocery page');
        return;
    }
    
    console.log('DOM loaded, initializing NEW carousel system for grocery page...');
    
    setTimeout(() => {
        const wrapper = document.querySelector('.carousel-wrapper');
        const items = document.querySelectorAll('.carousel-item');
        const indicators = document.querySelectorAll('.carousel-indicator');
        
        if (wrapper && items.length > 0) {
            totalSlides = items.length;
            
            // Set initial position
            goToSlide(0);
            
            console.log('Carousel initialized with', totalSlides, 'slides');
            
            // Add click event listeners to indicators
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    console.log('Indicator clicked:', index);
                    goToSlide(index);
                });
            });
            
            // Add drag event listeners
            wrapper.addEventListener('mousedown', handleDragStart);
            document.addEventListener('mousemove', handleDragMove);
            document.addEventListener('mouseup', handleDragEnd);
            
            // Touch events for mobile
            wrapper.addEventListener('touchstart', handleDragStart, { passive: false });
            document.addEventListener('touchmove', handleDragMove, { passive: false });
            document.addEventListener('touchend', handleDragEnd);
            
            // Prevent context menu on drag
            wrapper.addEventListener('contextmenu', (e) => e.preventDefault());
            
            // Add window resize listener to reload carousel positions
            window.addEventListener('resize', () => {
                console.log('Window resized, reloading carousel position');
                // Small delay to ensure CSS has updated
                setTimeout(() => {
                    goToSlide(testCurrentIndex);
                }, 50);
            });
            
            console.log('Carousel event listeners added');
        } else {
            console.log('Carousel elements not found');
        }
    }, 100);
});

// ---- Project Filter Positioning Logic ----
document.addEventListener('DOMContentLoaded', function() {
  const projectFilter = document.querySelector('.project-filter-section');
  const footer = document.querySelector('.footer');
  const holdTitle = document.querySelector('.hold-title');
  
  if (!projectFilter || !footer) return;
  
  function updateFilterPosition() {
    const windowHeight = window.innerHeight;
    
    // Get footer position relative to viewport
    const footerRect = footer.getBoundingClientRect();
    const footerHeight = footerRect.height;
    const footerTop = footerRect.top;
    
    // Calculate how much of the footer is visible
    const footerVisibleHeight = Math.max(0, Math.min(footerHeight, windowHeight - footerTop));
    const footerVisiblePercentage = (footerVisibleHeight / footerHeight) * 100;
    
    let shouldHide = false;
    
    // Hide if footer is at least 50% visible on screen
    if (footerVisiblePercentage >= 50) {
      shouldHide = true;
    }
    
    // Also hide if buttons would overlap with hold-title area
    if (holdTitle) {
      const holdTitleRect = holdTitle.getBoundingClientRect();
      const filterRect = projectFilter.getBoundingClientRect();
      
      // Check if hold-title is visible and would overlap with filter
      if (holdTitleRect.bottom > 0 && holdTitleRect.top < windowHeight) {
        // Check if there's vertical overlap
        const holdTitleBottom = holdTitleRect.bottom;
        const filterTop = filterRect.top;
        
        if (holdTitleBottom > filterTop) {
          shouldHide = true;
        }
      }
    }
    
    if (shouldHide) {
      projectFilter.style.transform = 'translateY(100%)';
    } else {
      projectFilter.style.transform = 'translateY(0)';
    }
  }
  
  // Update on scroll and resize
  window.addEventListener('scroll', updateFilterPosition);
  window.addEventListener('resize', updateFilterPosition);
  
  // Initial check
  updateFilterPosition();
});

// ---- Project Filter Functionality - No Animations ----

// Initialise the SVG rounded-rect laser animation on the All button.
// Runs after layout so offsetWidth/Height are correct.
function initAllBtnBorder() {
  var btn = document.querySelector('.filter-btn[data-filter="all"]');
  if (!btn) return;
  var svg  = btn.querySelector('.all-btn-border');
  var path = btn.querySelector('.all-btn-hl-line');
  if (!svg || !path) return;

  var w = btn.offsetWidth;
  var h = btn.offsetHeight;
  var r = 8;    // matches CSS border-radius
  var s = 1;    // half of 2px border-width — centers path on the visible border

  svg.setAttribute('width',   w);
  svg.setAttribute('height',  h);
  svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);

  // Rounded-rectangle path that follows the CSS border-radius exactly
  var d = 'M '  + (r+s)   + ',' + s       + ' '
        + 'L '  + (w-r-s) + ',' + s       + ' '
        + 'Q '  + (w-s)   + ',' + s       + ' ' + (w-s) + ',' + (r+s)   + ' '
        + 'L '  + (w-s)   + ',' + (h-r-s) + ' '
        + 'Q '  + (w-s)   + ',' + (h-s)   + ' ' + (w-r-s) + ',' + (h-s) + ' '
        + 'L '  + (r+s)   + ',' + (h-s)   + ' '
        + 'Q '  + s       + ',' + (h-s)   + ' ' + s + ',' + (h-r-s)     + ' '
        + 'L '  + s       + ',' + (r+s)   + ' '
        + 'Q '  + s       + ',' + s       + ' ' + (r+s) + ',' + s        + ' Z';
  path.setAttribute('d', d);

  var total     = path.getTotalLength();
  var dot       = Math.round(total * 0.18); // dot length ~18% of perimeter
  var gap       = Math.round(total / 2 - dot);
  path.style.strokeDasharray = dot + ' ' + gap + ' ' + dot + ' ' + gap;

  // Inject (or update) the keyframe with the exact perimeter length
  var styleId = 'all-btn-laser-kf';
  var styleEl = document.getElementById(styleId);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }
  styleEl.textContent =
    '@keyframes all-btn-laser {'
    + 'from { stroke-dashoffset: 0; }'
    + 'to   { stroke-dashoffset: -' + total + '; }'
    + '}';
}
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const imageItems = document.querySelectorAll('.image-item');
  const allButton = document.querySelector('.filter-btn[data-filter="all"]');

  // Returns set of currently active (non-all) filter categories
  function getActiveCategories() {
    var active = new Set();
    filterButtons.forEach(function(btn) {
      if (btn.getAttribute('data-filter') !== 'all' && btn.classList.contains('active')) {
        active.add(btn.getAttribute('data-filter'));
      }
    });
    return active;
  }

  // Show/hide items based on active category set
  function applyFilter() {
    var active = getActiveCategories();
    var allActive = allButton && allButton.classList.contains('active');

    imageItems.forEach(function(item) {
      var cat = item.getAttribute('data-category');
      if (allActive || active.size === 0 || active.has(cat)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  }

  // Returns the total number of non-all filter buttons
  function getTotalCategories() {
    var count = 0;
    filterButtons.forEach(function(btn) {
      if (btn.getAttribute('data-filter') !== 'all') count++;
    });
    return count;
  }

  // Button click handlers
  filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      var filterCategory = this.getAttribute('data-filter');

      if (filterCategory === 'all') {
        // If all specific categories are already active, do nothing
        if (allButton.classList.contains('active') && getActiveCategories().size === getTotalCategories()) {
          return;
        }
        // Otherwise activate everything
        filterButtons.forEach(function(btn) { btn.classList.add('active'); });
      } else {
        // Deselect All when picking a specific category
        if (allButton) allButton.classList.remove('active');
        // Toggle this button
        this.classList.toggle('active');
        // If all specific categories are now active, also activate All
        if (getActiveCategories().size === getTotalCategories()) {
          allButton.classList.add('active');
        }
        // If nothing is active at all, activate everything
        if (getActiveCategories().size === 0) {
          filterButtons.forEach(function(btn) { btn.classList.add('active'); });
        }
      }

      applyFilter();
    });
  });

  // On load: pre-select UX Case Studies + UI Concepts
  filterButtons.forEach(function(btn) { btn.classList.remove('active'); });
  filterButtons.forEach(function(btn) {
    var cat = btn.getAttribute('data-filter');
    if (cat === 'ux-case-studies' || cat === 'ui-concepts') {
      btn.classList.add('active');
    }
  });
  applyFilter();

  // Init the laser border after layout is settled
  initAllBtnBorder();

  // Re-init on resize so path stays accurate if button reflows
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initAllBtnBorder, 150);
  });
});

// Scroll to next section function (for grocery page scroll arrow)
function scrollToNextSection() {
    const nextSection = document.querySelector('#overview-section');
    if (nextSection) {
        nextSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ---- Side Navigator for Tarkov Page ----
document.addEventListener('DOMContentLoaded', function() {
    const sideNavigator = document.querySelector('.side-navigator');
    
    // Only initialize if we're on Tarkov page and side navigator exists
    if (!sideNavigator || !document.body.classList.contains('tarkov-page')) {
        return;
    }
    
    const navDots = document.querySelectorAll('.nav-dot');
    const sections = [
        'problem-goals',
        'research-discovery',
        'define-synthesis', 
        'ideate-design',
        'low-fidelity-wireframes',
        'high-fidelity-design',
        'retrospective-learnings'
    ];
    
    const fullCaseStudySection = document.getElementById('fullCaseStudyTarkov');
    const viewCaseStudyBtn = document.getElementById('viewCaseStudyBtn');
    
    // Initially hide the navigator
    sideNavigator.style.display = 'none';
    let navigatorVisible = false;
    
    // Show navigator when case study is displayed
    if (viewCaseStudyBtn) {
        viewCaseStudyBtn.addEventListener('click', function() {
            // Small delay to ensure the case study is visible
            setTimeout(() => {
                updateNavigatorVisibility();
            }, 100);
        });
    }
    
    // Function to smoothly hide navigator
    function hideNavigator() {
        if (navigatorVisible) {
            sideNavigator.classList.add('fade-out');
            setTimeout(() => {
                sideNavigator.style.display = 'none';
                navigatorVisible = false;
            }, 400); // Match CSS transition duration
        }
    }
    
    // Function to smoothly show navigator
    function showNavigator() {
        if (!navigatorVisible) {
            sideNavigator.style.display = 'block';
            // Start with fade-out state (off-screen)
            sideNavigator.classList.add('fade-out');
            
            // Force a reflow to ensure the fade-out state is applied
            sideNavigator.offsetHeight;
            
            // Then animate to visible state
            sideNavigator.classList.remove('fade-out');
            sideNavigator.classList.add('fade-in');
            
            navigatorVisible = true;
            
            // Clean up fade-in class after animation
            setTimeout(() => {
                sideNavigator.classList.remove('fade-in');
            }, 400);
        }
    }
    
    // Function to check if navigator should be visible
    function updateNavigatorVisibility() {
        if (!fullCaseStudySection || fullCaseStudySection.style.display === 'none') {
            hideNavigator();
            return;
        }
        
        const scrollPosition = window.scrollY;
        const viewportHeight = window.innerHeight;
        
        // Calculate navigator position and dimensions
        const navigatorCenterY = scrollPosition + (viewportHeight / 2);
        const navigatorHeight = sideNavigator.offsetHeight || 200; // Fallback height estimate
        const navigatorTopEdge = navigatorCenterY - (navigatorHeight / 2);
        const navigatorBottomEdge = navigatorCenterY + (navigatorHeight / 2);
        
        // Get the Problem & Goals section header position
        const problemGoalsHeader = document.getElementById('problem-goals');
        const problemGoalsHeaderTop = problemGoalsHeader ? problemGoalsHeader.offsetTop : 0;
        
        // Find other projects section
        const otherProjectsSection = document.querySelector('.tarkov-other-projects, .other-projects, .projects-grid');
        let otherProjectsHeaderTop = document.body.scrollHeight; // Default to end of page
        
        if (otherProjectsSection) {
            // Use the top edge of the tarkov-other-projects section itself
            otherProjectsHeaderTop = otherProjectsSection.offsetTop;
        }
        
        // Check visibility conditions
        const topEdgePassedProblemGoals = navigatorTopEdge <= problemGoalsHeaderTop;
        const bottomEdgeReachedOtherProjects = navigatorBottomEdge >= otherProjectsHeaderTop;
        
        // Show navigator only when:
        // 1. Top edge is below Problem & Goals header
        // 2. Bottom edge is above Other Projects title
        const shouldShow = !topEdgePassedProblemGoals && !bottomEdgeReachedOtherProjects;
        
        if (shouldShow) {
            showNavigator();
        } else {
            hideNavigator();
        }
    }
    
    // Function to update active dot based on current section
    function updateActiveDot() {
        // Only update if navigator is visible
        if (!navigatorVisible) {
            return;
        }
        
        const scrollPosition = window.scrollY;
        const viewportHeight = window.innerHeight;
        
        // Calculate the actual visible viewport (excluding header + gap)
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;
        const additionalGap = 34; // Mathematical spacing
        const headerOffset = headerHeight + additionalGap;
        
        const viewportTop = scrollPosition + headerOffset; // Start below header + gap
        const viewportBottom = scrollPosition + viewportHeight;
        const minSectionThreshold = viewportHeight * 0.05; // Lower threshold for better detection
        
        let currentSection = '';
        let visibleSections = [];
        
        // Calculate visible sections and their areas
        sections.forEach((sectionId, index) => {
            const sectionHeader = document.getElementById(sectionId);
            if (sectionHeader) {
                const sectionTop = sectionHeader.offsetTop;
                
                // Find the bottom by looking for the next section or end of content
                let sectionBottom;
                if (index < sections.length - 1) {
                    const nextSectionHeader = document.getElementById(sections[index + 1]);
                    sectionBottom = nextSectionHeader ? nextSectionHeader.offsetTop : document.body.scrollHeight;
                } else {
                    // Last section goes to the end of the document
                    sectionBottom = document.body.scrollHeight;
                }
                
                // Calculate visible area of this section (excluding header area)
                const visibleTop = Math.max(sectionTop, viewportTop);
                const visibleBottom = Math.min(sectionBottom, viewportBottom);
                const visibleArea = Math.max(0, visibleBottom - visibleTop);
                
                // Add section to visible list if it meets threshold
                if (visibleArea > minSectionThreshold) {
                    visibleSections.push({
                        id: sectionId,
                        area: visibleArea,
                        index: index
                    });
                }
            }
        });
        
        // Priority-based selection: earlier sections take precedence when multiple are visible
        if (visibleSections.length > 0) {
            // Sort by section order (index) to prioritize earlier sections
            visibleSections.sort((a, b) => a.index - b.index);
            currentSection = visibleSections[0].id;
        }
        
        // Clear all active states first
        navDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Set only the current section as active
        if (currentSection) {
            const activeDot = document.querySelector(`[data-section="${currentSection}"]`);
            if (activeDot) {
                activeDot.classList.add('active');
            }
        }
    }
    
    // Add smooth scroll behavior to nav dots
    navDots.forEach(dot => {
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Calculate offset for fixed header + 34px gap
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const additionalGap = 34; // Mathematical spacing
                const totalOffset = headerHeight + additionalGap;
                
                // Calculate target position
                const targetPosition = targetElement.offsetTop - totalOffset;
                
                // Smooth scroll to calculated position
                window.scrollTo({
                    top: Math.max(0, targetPosition), // Ensure we don't scroll above page top
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update navigator visibility and active dot on scroll
    let scrollTimer;
    window.addEventListener('scroll', function() {
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(() => {
            updateNavigatorVisibility();
            updateActiveDot();
        }, 20);
    });
    
    // Initial setup
    updateNavigatorVisibility();
    updateActiveDot();
});

// ---- Prototype Switcher for Grocery Store Page ----
document.addEventListener('DOMContentLoaded', function() {
    const prototypeButtons = document.querySelectorAll('.prototype-nav-btn');
    const prototypeContents = document.querySelectorAll('.figma-embed[data-prototype-content]');
    
    if (prototypeButtons.length === 0 || prototypeContents.length === 0) {
        return; // Not on grocery store page or elements don't exist
    }
    
    prototypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetPrototype = this.getAttribute('data-prototype');
            
            // Remove active class from all buttons
            prototypeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all prototype contents
            prototypeContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Show the selected prototype content
            const targetContent = document.querySelector(`.figma-embed[data-prototype-content="${targetPrototype}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
});

// ---- Other Projects: Random Population ----
(function () {
  var PROJECTS = [
    {
      id: 'tarkov',
      type: 'ux',
      href: 'TarkovCaseStudy.html',
      imageBg: '',
      imageSrc: 'Assets/wp5408753.webp',
      imageAlt: 'Tarkov Case Study',
      imageStyle: '',
      title: 'Escape from Tarkov',
      description: 'UI/UX Redesign Case Study',
      tag: 'Game Design'
    },
    {
      id: 'grocery',
      type: 'ux',
      href: 'GroceryStoreApp.html',
      imageBg: "background-image:url('Assets/GroceryStoreApp/Watermelon.jpg');background-size:cover;background-position:center;",
      imageSrc: 'Assets/GroceryStoreApp/Red.svg',
      imageAlt: 'Fresh Market App',
      imageStyle: 'width:100%;height:calc(100% - 20px);object-fit:contain;margin-top:20px;',
      title: 'Fresh Market App',
      description: 'Grocery Store App with Enhanced Shopping Experience',
      tag: 'Mobile App'
    },
    {
      id: 'marketplace',
      type: 'ux',
      href: 'MarketplaceApp.html',
      imageBg: 'background-color:#FDE8B4;display:flex;align-items:center;justify-content:center;',
      imageSrc: 'Assets/MarketPlaceApp/Group 6.svg',
      imageAlt: 'Marketplace App',
      imageStyle: 'width:100%;height:100%;object-fit:contain;',
      title: 'Marketplace App',
      description: 'E-Commerce Mobile App Design',
      tag: 'Mobile App'
    },
    {
      id: 'astray',
      type: 'ux',
      disabled: true,
      href: 'astray.html',
      imageBg: 'background-color:#004C6C;display:flex;align-items:center;justify-content:center;',
      imageSrc: 'Assets/Astray/astray-thumb.png',
      imageAlt: 'Astray Campus Map App',
      imageStyle: 'width:100%;height:100%;object-fit:cover;',
      title: 'Astray',
      description: 'Campus Navigation & Assistance App — MSc Final Project',
      tag: 'UX Design'
    },
    {
      id: 'killjoy',
      type: 'drawing',
      href: 'killjoy-drawing.html',
      imageSrc: 'Assets/Killjoy%20in%20da%20site/killjoy-in-da-site.jpg',
      imageAlt: 'Killjoy in da site',
      title: 'Killjoy',
      description: 'Killjoy in da site',
      tag: 'Illustration'
    },
    {
      id: 'skull',
      type: 'drawing',
      href: 'skull-drawing.html',
      imageSrc: 'Assets/Skull/skull.jpg',
      imageAlt: 'Skull Drawing',
      title: 'Skull',
      description: 'Skull using a pilot gear, made as sketch for tattoo.',
      tag: 'Illustration'
    },
    {
      id: 'zed',
      type: 'drawing',
      href: 'zed-drawing.html',
      imageSrc: 'Assets/Zed%20shadow%20born/zed-shadow-born.jpg',
      imageAlt: 'Zed Shadow Reborn',
      title: 'Zed',
      description: 'Shadow Reborn',
      tag: 'Illustration'
    },
    {
      id: 'thresh',
      type: 'drawing',
      href: 'thresh-drawing.html',
      imageSrc: 'Assets/Thresh/thresh.jpg',
      imageAlt: 'Thresh Lantern',
      title: 'Thresh',
      description: 'Thresh Lantern, character from League of Legends game.',
      tag: 'Illustration'
    },
    {
      id: 'yggdrasil',
      type: 'drawing',
      href: 'yggdrasil-drawing.html',
      imageSrc: 'Assets/Yggdrasil/yggdrasil.jpg',
      imageAlt: 'Yggdrasil',
      title: 'Yggdrasil',
      description: 'The tree of live.',
      tag: 'Illustration'
    },
    {
      id: 'cauzito',
      type: 'drawing',
      href: 'cauzito-logo.html',
      imageSrc: 'Assets/Cauzito%C2%B4s%20Live%20Stream%20Logo/vinicius-pim-logo-cau-4-prancheta-1.jpg',
      imageAlt: 'Cauzito Stream Logo',
      title: 'Stream Logo',
      description: "Cauzito's Live",
      tag: 'Logo Design'
    }
  ];

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function buildCard(project, style) {
    var imgDivStyle = project.imageBg ? ' style="' + project.imageBg + '"' : '';
    var imgStyle    = project.imageStyle ? ' style="' + project.imageStyle + '"' : '';
    if (style === 'about') {
      return '<div class="about-project-item">' +
        '<a href="' + project.href + '" class="project-link">' +
          '<div class="about-project-image"' + imgDivStyle + '>' +
            '<img src="' + project.imageSrc + '" alt="' + project.imageAlt + '"' + imgStyle + ' />' +
          '</div>' +
          '<div class="about-project-info">' +
            '<h3 class="about-project-title">' + project.title + '</h3>' +
            '<p class="about-project-description">' + project.description + '</p>' +
            '<span class="about-project-tag">' + project.tag + '</span>' +
          '</div>' +
        '</a>' +
      '</div>';
    }
    return '<div class="project-item">' +
      '<a href="' + project.href + '" class="project-link">' +
        '<div class="project-image"' + imgDivStyle + '>' +
          '<img src="' + project.imageSrc + '" alt="' + project.imageAlt + '"' + imgStyle + ' />' +
        '</div>' +
        '<div class="project-info">' +
          '<h3 class="project-title">' + project.title + '</h3>' +
          '<p class="project-description">' + project.description + '</p>' +
          '<span class="project-tag">' + project.tag + '</span>' +
        '</div>' +
      '</a>' +
    '</div>';
  }

  var grids = document.querySelectorAll('[data-other-projects]');
  grids.forEach(function (grid) {
    var currentId  = grid.getAttribute('data-other-projects');
    var maxCount   = grid.getAttribute('data-max') ? parseInt(grid.getAttribute('data-max'), 10) : null;
    var cardStyle  = currentId === 'about' ? 'about' : 'standard';
    var eligible   = PROJECTS.filter(function (p) {
      if (p.disabled) return false;
      if (p.type === 'drawing') return false;
      return currentId === 'about' ? true : p.id !== currentId;
    });
    shuffle(eligible);
    if (maxCount) eligible = eligible.slice(0, maxCount);
    grid.innerHTML = eligible.map(function (p) { return buildCard(p, cardStyle); }).join('');
  });

  // Mixed drawing+ux grid: 2 drawings + 2 UX, excluding current page
  var mixedGrids = document.querySelectorAll('[data-drawing-mix]');
  mixedGrids.forEach(function (grid) {
    var currentId = grid.getAttribute('data-drawing-mix');
    var drawings = shuffle(PROJECTS.filter(function (p) {
      return !p.disabled && p.type === 'drawing' && p.id !== currentId;
    })).slice(0, 2);
    var uxProjects = shuffle(PROJECTS.filter(function (p) {
      return !p.disabled && p.type === 'ux';
    })).slice(0, 2);
    var combined = drawings.concat(uxProjects);
    grid.innerHTML = combined.map(function (p) {
      var bg = p.imageBg ? ' style="' + p.imageBg + '"' : '';
      var imgStyle = p.imageStyle ? ' style="' + p.imageStyle + '"' : '';
      return '<div class="drawing-project-item">' +
        '<a href="' + p.href + '" class="dp-link">' +
          '<div class="dp-image"' + bg + '><img src="' + p.imageSrc + '" alt="' + p.imageAlt + '"' + imgStyle + '></div>' +
          '<div class="dp-info">' +
            '<h3 class="dp-title">' + p.title + '</h3>' +
            '<p class="dp-description">' + p.description + '</p>' +
            '<span class="dp-tag">' + p.tag + '</span>' +
          '</div>' +
        '</a>' +
      '</div>';
    }).join('');
  });

  // Mixed drawing+ux grid: 2 drawings + 2 UX, excluding current page
  var mixedGrids = document.querySelectorAll('[data-drawing-mix]');
  mixedGrids.forEach(function (grid) {
    var currentId = grid.getAttribute('data-drawing-mix');
    var drawings = shuffle(PROJECTS.filter(function (p) {
      return !p.disabled && p.type === 'drawing' && p.id !== currentId;
    })).slice(0, 2);
    var uxProjects = shuffle(PROJECTS.filter(function (p) {
      return !p.disabled && p.type === 'ux';
    })).slice(0, 2);
    var combined = drawings.concat(uxProjects);
    grid.innerHTML = combined.map(function (p) {
      var bg = p.imageBg ? ' style="' + p.imageBg + '"' : '';
      var imgStyle = p.imageStyle ? ' style="' + p.imageStyle + '"' : '';
      return '<div class="drawing-project-item">' +
        '<a href="' + p.href + '" class="dp-link">' +
          '<div class="dp-image"' + bg + '><img src="' + p.imageSrc + '" alt="' + p.imageAlt + '"' + imgStyle + '></div>' +
          '<div class="dp-info">' +
            '<h3 class="dp-title">' + p.title + '</h3>' +
            '<p class="dp-description">' + p.description + '</p>' +
            '<span class="dp-tag">' + p.tag + '</span>' +
          '</div>' +
        '</a>' +
      '</div>';
    }).join('');
  });
})();
(function () {
  const bg = document.getElementById('triangle-bg');
  if (!bg) return;

  const palette = bg.getAttribute('data-tri-palette');
  const colors = palette === 'about'
    ? [220, 200, 140, 120].map(function (h) { return 'hsl(' + h + ',100%,70%)'; })
    : palette === 'killjoy'
    ? ['#87CEEB', '#87CEEB', '#FFD700', '#FF69B4']
    : palette === 'zed'
    ? ['#1A3A8A', '#1A3A8A', '#8B1010', '#A82020']
    : palette === 'thresh'
    ? ['#0A3D1A', '#0A3D1A', '#2ECC71', '#57E08F']
    : palette === 'cauzito'
    ? ['#5500AA', '#7700CC', '#9933FF', '#BB66FF']
    : ['rgba(0,0,0,1)', 'rgba(18,18,18,1)', 'rgba(35,35,35,1)', 'rgba(52,52,52,1)'];

  const container = bg.querySelector('.tri-container');
  if (!container) return;

  const ns = 'http://www.w3.org/2000/svg';
  for (var i = 0; i < 60; i++) {
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'tri-shape');
    svg.setAttribute('viewBox', '0 0 100 115');
    svg.setAttribute('preserveAspectRatio', 'xMidYMin slice');
    colors.forEach(function (color, j) {
      var poly = document.createElementNS(ns, 'polygon');
      poly.setAttribute('points', '');
      poly.setAttribute('fill', 'none');
      poly.setAttribute('stroke', color);
      poly.setAttribute('stroke-width', '5');
      var anim = document.createElementNS(ns, 'animate');
      anim.setAttribute('attributeName', 'points');
      anim.setAttribute('repeatCount', 'indefinite');
      anim.setAttribute('dur', '6s');
      anim.setAttribute('begin', j + 's');
      anim.setAttribute('from', '50 57.5, 50 57.5, 50 57.5');
      anim.setAttribute('to', '50 -75, 175 126, -75 126');
      poly.appendChild(anim);
      svg.appendChild(poly);
    });
    container.appendChild(svg);
  }
})();

// ---- Triangle Lock / Unlock Button ----
(function () {
  var btns = [
    document.getElementById('tri-lock-btn'),
    document.getElementById('tri-lock-btn-mobile')
  ];
  if (!btns[0] && !btns[1]) return;

  var STORAGE_KEY = 'tri-animation-locked';

  function applyState(locked) {
    // Wait one frame so SVG animations have initialised before pausing
    requestAnimationFrame(function () {
      document.querySelectorAll('.tri-shape').forEach(function (svg) {
        locked ? svg.pauseAnimations() : svg.unpauseAnimations();
      });
    });

    var d = document.getElementById('tri-lock-btn');
    if (d) {
      document.getElementById('lock-open-icon').style.display   = locked ? 'none' : '';
      document.getElementById('lock-closed-icon').style.display = locked ? '' : 'none';
      d.classList.toggle('tri-lock-btn--locked', locked);
    }
    var m = document.getElementById('tri-lock-btn-mobile');
    if (m) {
      m.querySelector('.lock-open-icon-m').style.display   = locked ? 'none' : '';
      m.querySelector('.lock-closed-icon-m').style.display = locked ? '' : 'none';
      m.classList.toggle('tri-lock-btn--locked', locked);
    }
  }

  function toggle() {
    var locked = localStorage.getItem(STORAGE_KEY) === 'true';
    locked = !locked;
    localStorage.setItem(STORAGE_KEY, locked);
    applyState(locked);
  }

  // Restore saved state on load
  applyState(localStorage.getItem(STORAGE_KEY) === 'true');

  btns.forEach(function (btn) {
    if (btn) btn.addEventListener('click', toggle);
  });
})();

