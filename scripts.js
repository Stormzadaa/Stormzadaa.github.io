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
    console.log("Carousel script loaded, starting initialization...");

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

    // Much more aggressive layout detection
    function isLayoutReady() {
      const container = carouselContent.parentElement;
      const contentWidth = carouselContent.offsetWidth;
      const containerWidthCheck = container.offsetWidth;
      const contentHeight = carouselContent.offsetHeight;
      
      // Check computed styles are applied
      const computedStyle = window.getComputedStyle(carouselContent);
      const hasComputedStyles = computedStyle.display !== '' && computedStyle.fontSize !== '';
      
      console.log(`Layout check ${initializationAttempts + 1}:`, {
        contentWidth,
        containerWidthCheck,
        contentHeight,
        hasComputedStyles,
        displayStyle: computedStyle.display,
        fontSize: computedStyle.fontSize
      });
      
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
      console.log(`Initialization attempt ${initializationAttempts}`);
      
      if (isLayoutReady()) {
        console.log("Layout is ready, initializing carousel...");
        actuallyInitialize();
        return true;
      } else if (initializationAttempts < 20) {
        // Try again with increasing delays
        const delay = Math.min(50 + (initializationAttempts * 25), 500);
        console.log(`Layout not ready, retrying in ${delay}ms...`);
        setTimeout(attemptInitialization, delay);
        return false;
      } else {
        console.warn("Failed to detect proper layout after 20 attempts, forcing initialization");
        actuallyInitialize();
        return true;
      }
    }

    // The actual initialization function
    function actuallyInitialize() {
      if (isInitialized) {
        console.log("Already initialized, skipping...");
        return;
      }
      
      console.log("Running actual initialization...");
      
      // Set up the carousel structure
      setupCarousel();
      
      // Set up hover effects
      setupHoverEffects();
      
      // Start animation
      start();
      
      // Mark as initialized
      isInitialized = true;
      
      console.log("Carousel initialization complete!");
    }

    // Create seamless infinite effect by duplicating content
    function setupCarousel() {
      console.log("Setting up carousel...");
      const container = carouselContent.parentElement;
      
      // Clear any existing clones
      const existingClones = container.querySelectorAll('[id*="carouselContentClone"]');
      existingClones.forEach(clone => clone.remove());
      
      // Get dimensions
      containerWidth = container.offsetWidth;
      carouselWidth = carouselContent.offsetWidth;
      
      console.log("Carousel dimensions:", { containerWidth, carouselWidth });
      
      // If still no dimensions, force a reflow
      if (carouselWidth === 0) {
        container.style.visibility = 'hidden';
        container.offsetHeight; // Force reflow
        container.style.visibility = 'visible';
        carouselWidth = carouselContent.offsetWidth;
        console.log("After forced reflow, carouselWidth:", carouselWidth);
      }
      
      // Create enough clones to ensure seamless scrolling
      // We need enough clones so that when one set scrolls off-screen, the next set is already visible
      const clonesNeeded = Math.max(3, Math.ceil((containerWidth * 2) / carouselWidth));
      console.log(`Creating ${clonesNeeded} clones`);
      
      for (let i = 1; i <= clonesNeeded; i++) {
        const clone = carouselContent.cloneNode(true);
        clone.id = `carouselContentClone${i}`;
        clone.style.position = 'absolute';
        clone.style.left = '0';
        clone.style.top = '0';
        clone.style.whiteSpace = 'nowrap';
        clone.style.display = 'inline-flex';
        container.appendChild(clone);
      }
      
      // Set initial positions
      resetPositions();
      
      // Update speed based on screen size
      updateSpeed();
      
      console.log("Carousel setup complete");
    }

    // Reset all element positions
    function resetPositions() {
      const container = carouselContent.parentElement;
      const allElements = container.querySelectorAll('#carouselContent, [id*="carouselContentClone"]');
      
      allElements.forEach((element, index) => {
        const xPos = index * carouselWidth;
        element.style.transform = `translateX(${xPos}px)`;
      });
      
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

    // Main animation loop - COMPLETELY REWRITTEN for true infinite scroll
    function animate() {
      if (!isRunning) return;
      
      // Move the global position
      currentPosition -= speed;
      
      // Get all carousel elements
      const container = carouselContent.parentElement;
      const allElements = container.querySelectorAll('#carouselContent, [id*="carouselContentClone"]');
      
      // Simple infinite loop: when currentPosition goes too far left, reset it
      if (currentPosition <= -carouselWidth) {
        currentPosition = 0; // Reset to start position
      }
      
      // Position all elements in a continuous line
      allElements.forEach((element, index) => {
        // Each element is positioned at currentPosition + (index * carouselWidth)
        const elementPosition = currentPosition + (index * carouselWidth);
        element.style.transform = `translateX(${elementPosition}px)`;
      });
      
      animationId = requestAnimationFrame(animate);
    }

    // Start the carousel
    function start() {
      if (isRunning && animationId) {
        console.log("Carousel already running");
        return;
      }
      isRunning = true;
      console.log("Starting carousel animation");
      animate();
    }

    // Stop the carousel
    function stop() {
      console.log("Stopping carousel animation");
      isRunning = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }

    // Handle window resize
    function handleResize() {
      if (!isInitialized) return;
      
      console.log("Window resized, reinitializing carousel...");
      stop();
      
      // Reset initialization flag and attempt counter
      isInitialized = false;
      initializationAttempts = 0;
      
      // Wait for layout to settle after resize
      setTimeout(() => {
        attemptInitialization();
      }, 150);
    }

    // Handle visibility change (pause when tab is not visible)
    function handleVisibilityChange() {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    }

    // Add hover effects for individual spans
    function setupHoverEffects() {
      const container = carouselContent.parentElement;
      
      // Use event delegation for better performance
      container.addEventListener('mouseenter', (e) => {
        if (e.target.tagName === 'SPAN') {
          // Slow down on hover
          speed = speed * 0.3;
          
          // Visual feedback
          e.target.style.opacity = '1';
          e.target.style.transform = 'scale(1.05)';
        }
      }, true);
      
      container.addEventListener('mouseleave', (e) => {
        if (e.target.tagName === 'SPAN') {
          // Restore normal speed
          updateSpeed();
          
          // Reset visual feedback
          e.target.style.opacity = '0.5';
          e.target.style.transform = 'scale(1)';
        }
      }, true);
    }

    // Public API (if needed)
    window.CarouselAPI = {
      start,
      stop,
      restart: () => {
        console.log("Manual restart requested");
        stop();
        isInitialized = false;
        initializationAttempts = 0;
        attemptInitialization();
      },
      forceInit: () => {
        console.log("Force initialization requested");
        isInitialized = false;
        initializationAttempts = 0;
        actuallyInitialize();
      }
    };

    // Set up event listeners
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Multiple initialization strategies with more aggressive timing
    console.log("Setting up initialization strategies...");
    
    // Strategy 1: Immediate attempt
    setTimeout(() => {
      console.log("Strategy 1: Immediate attempt");
      attemptInitialization();
    }, 0);
    
    // Strategy 2: After requestAnimationFrame (ensures DOM is painted)
    requestAnimationFrame(() => {
      setTimeout(() => {
        console.log("Strategy 2: After RAF + 50ms");
        if (!isInitialized) attemptInitialization();
      }, 50);
    });
    
    // Strategy 3: After a short delay
    setTimeout(() => {
      console.log("Strategy 3: After 200ms");
      if (!isInitialized) attemptInitialization();
    }, 200);
    
    // Strategy 4: After images and fonts load
    window.addEventListener('load', () => {
      console.log("Strategy 4: After window load");
      if (!isInitialized) attemptInitialization();
    });
    
    // Strategy 5: After a longer delay as ultimate fallback
    setTimeout(() => {
      console.log("Strategy 5: Ultimate fallback after 1000ms");
      if (!isInitialized) {
        console.warn("Using ultimate fallback initialization");
        actuallyInitialize();
      }
    }, 1000);

    // Strategy 6: Use ResizeObserver if available to detect layout changes
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === carouselContent && !isInitialized) {
            console.log("Strategy 6: ResizeObserver detected layout change");
            if (entry.contentRect.width > 100) {
              attemptInitialization();
            }
          }
        }
      });
      resizeObserver.observe(carouselContent);
    }
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

  // Function to close the menu if screen width is greater than 768px
  function closeMenuOnLargeScreens() {
    const screenWidth = window.innerWidth;
    if (screenWidth > 768) {
      hamburgerMenu.style.setProperty(
        "--menu-transition-duration",
        closeDuration
      );
      hamburgerMenu.classList.add("hidden");
      document.body.classList.remove("no-scroll"); // Enable scrolling
      setTimeout(() => {
        hamburgerMenu.classList.remove("active");
        hamburgerMenu.style.display = "none"; // Hide the menu after the animation
      }, 600); // Wait for the close animation to complete before removing the active class
    }
  }

  // Call the function initially and whenever the window is resized
  closeMenuOnLargeScreens();
  window.addEventListener("resize", closeMenuOnLargeScreens);

  // Toggle the menu visibility and lock/unlock scroll
  menuButton.addEventListener("click", () => {
    hamburgerMenu.style.setProperty("--menu-transition-duration", openDuration);
    hamburgerMenu.style.display = "block"; // Ensure the menu is displayed
    document.body.classList.add("no-scroll"); // Disable scrolling
    setTimeout(() => {
      hamburgerMenu.classList.add("active");
      hamburgerMenu.classList.remove("hidden");
    }, 10); // Slight delay to ensure the display property is set before applying the class
  });

  // Function to close the menu
  function closeMenu() {
    hamburgerMenu.style.setProperty(
      "--menu-transition-duration",
      closeDuration
    );
    hamburgerMenu.classList.add("hidden");
    document.body.classList.remove("no-scroll"); // Enable scrolling
    setTimeout(() => {
      hamburgerMenu.classList.remove("active");
      hamburgerMenu.style.display = "none"; // Hide the menu after the animation
    }, 600); // Wait for the close animation to complete before removing the active class
  }

  // Close the menu when clicking outside of it and unlock scroll
  document.addEventListener("click", (event) => {
    if (
      !hamburgerMenu.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      closeMenu();
    }
  });

  // Close the menu when clicking any menu option
  const menuOptions = document.querySelectorAll("#hamburgerMenu a"); // Assuming menu options are anchor tags
  menuOptions.forEach((option) => {
    option.addEventListener("click", closeMenu);
  });

  // Close the menu when clicking outside of it and unlock scroll
  document.addEventListener("click", (event) => {
    if (
      !hamburgerMenu.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      hamburgerMenu.style.setProperty(
        "--menu-transition-duration",
        closeDuration
      );
      hamburgerMenu.classList.add("hidden");
      document.body.classList.remove("no-scroll"); // Enable scrolling
      setTimeout(() => {
        hamburgerMenu.classList.remove("active");
        hamburgerMenu.style.display = "none"; // Hide the menu after the animation
      }, 600); // Wait for the close animation to complete before removing the active class
    }
  });
});

// Smooth scroll function (reuse the existing one)
function smoothScrollTo(target, duration) {
  const start = window.scrollY;
  const distance = target - start;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, start, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      isScrolling = false;
    }
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  isScrolling = true;
  requestAnimationFrame(animation);
}

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

    if (scrollPosition >= footerTop) {
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

// Smooth scroll function (reuse the existing one)
function smoothScrollTo(target, duration) {
  const start = window.scrollY;
  const distance = target - start;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, start, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      isScrolling = false;
    }
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  isScrolling = true;
  requestAnimationFrame(animation);
}

/* Code to lock the background scroll during hamburger menu open */

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-svg");
  const hamburgerMenu = document.getElementById("hamburgerMenu");

  // Define custom properties for transition durations
  const openDuration = "0.9s";
  const closeDuration = "0.5s";

  // Toggle the menu visibility and lock/unlock scroll
  menuButton.addEventListener("click", () => {
    hamburgerMenu.style.setProperty("--menu-transition-duration", openDuration);
    hamburgerMenu.style.display = "block"; // Ensure the menu is displayed
    document.body.classList.add("no-scroll"); // Disable scrolling
    document.body.classList.add("disable-pointer-events"); // Disable pointer events
    setTimeout(() => {
      hamburgerMenu.classList.add("active");
      hamburgerMenu.classList.remove("hidden");
    }, 10); // Slight delay to ensure the display property is set before applying the class
  });

  // Close the menu when clicking outside of it and unlock scroll
  document.addEventListener("click", (event) => {
    if (
      !hamburgerMenu.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      hamburgerMenu.style.setProperty(
        "--menu-transition-duration",
        closeDuration
      );
      hamburgerMenu.classList.add("hidden");
      document.body.classList.remove("no-scroll"); // Enable scrolling
      document.body.classList.remove("disable-pointer-events"); // Enable pointer events
      setTimeout(() => {
        hamburgerMenu.classList.remove("active");
        hamburgerMenu.style.display = "none"; // Hide the menu after the animation
      }, 600); // Wait for the close animation to complete before removing the active class
    }
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

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // Enhanced Tarkov Page Color Theme Activation
  if (body.classList.contains("tarkov-page")) {
    const portfolioSection = document.querySelector(".portfolio-section");
    const header = document.querySelector(".header");
    const footer = document.querySelector("footer");
    const hamburgerMenu = document.getElementById("hamburgerMenu");

    // Create a smooth loading animation effect
    // First, ensure elements are visible, then apply the theme
    setTimeout(() => {
      // Add visual loading feedback with much slower transitions
      if (portfolioSection) {
        portfolioSection.style.transition = 'background-color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      }
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
      
      // Change hamburger menu color for mobile
      if (hamburgerMenu) {
        hamburgerMenu.style.transition = 'background-color 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        hamburgerMenu.classList.add("tarkov-active");
      }

      // Add subtle fade-in effect for enhanced immersion
      document.body.style.opacity = '1';
    }, 1500); // Longer delay before starting the transition

    // Set initial state for smooth transition
    document.body.style.opacity = '0.92';
    document.body.style.transition = 'opacity 1s ease';
  }

  // Enhanced Grocery Page Color Theme Activation
  if (body.classList.contains("grocery-page")) {
    // Create a smooth loading animation effect for grocery theme
    setTimeout(() => {
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

      // Add subtle fade-in effect with same timing
      document.body.style.opacity = '1';
    }, 1000); // 1 second delay for color transition

    // Set initial state for smooth transition with same timing
    document.body.style.opacity = '0.95';
    document.body.style.transition = 'opacity 3s ease-in-out';
    
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
      subtitle.textContent = subtitles[index];
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
    
    // Update invisible click areas after arranging cards
    updateClickAreas();
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
  
  function updateClickAreas() {
    // This function can be used to update click area positions if needed
    // For now, the fixed left/right areas should work for the carousel
  }

  arrangeCards();
  updateSubtitle(currentIndex);
  createClickAreas();

  // Mobile touch/swipe functionality (now includes tablet and tablet normal)
  function initializeMobileCarousel() {
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

    // Add swipe indicator
    if (!carouselSection.querySelector('.swipe-indicator')) {
      const swipeIndicator = document.createElement('div');
      swipeIndicator.className = 'swipe-indicator';
      swipeIndicator.textContent = 'Swipe to navigate';
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

  // Initialize mobile carousel if on mobile, tablet, or tablet normal
  initializeMobileCarousel();
  
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
      initializeMobileCarousel();
    }
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
    });
  }
});

// Side Navigator Functionality (Desktop Only)
document.addEventListener('DOMContentLoaded', function() {
  // Initialize side navigator for screens wider than 1378px
  if (window.innerWidth < 1378) return;
  
  const sideNavigator = document.getElementById('sideNavigator');
  const navItems = document.querySelectorAll('.side-nav-item');
  const fullCaseStudy = document.getElementById('fullCaseStudyTarkov');
  
  if (!sideNavigator || !fullCaseStudy) return;
  
  // Define sections in order
  const sections = [
    'problem-goals',
    'research-discovery', 
    'define-synthesis',
    'ideate-design',
    'high-fidelity-design',
    'retrospective-learnings'
  ];
  
  // Check if current screen is ultra-wide (1850px+) or medium desktop (1280px-1849px)
  function isUltraWideMode() {
    return window.innerWidth >= 1850;
  }
  
  function isMediumDesktopMode() {
    return window.innerWidth >= 1378 && window.innerWidth < 1850;
  }
  
  // Show/hide navigator based on section boundaries and screen size
  function updateNavigatorVisibility() {
    // Only show on screens wider than 1378px (both medium and ultra-wide)
    if (window.innerWidth < 1378) {
      sideNavigator.classList.remove('active');
      return;
    }
    
    const problemGoalsSection = document.getElementById('problem-goals');
    const thankYouSection = document.getElementById('thank-you-section');
    
    if (!problemGoalsSection || !thankYouSection) return;
    
    // Only show if case study is visible
    const isCaseStudyVisible = fullCaseStudy.style.display !== 'none';
    if (!isCaseStudyVisible) {
      sideNavigator.classList.remove('active');
      return;
    }
    
    // Always show navigator when case study is visible, but respect boundaries
    sideNavigator.classList.add('active');
    
    const problemGoalsRect = problemGoalsSection.getBoundingClientRect();
    const thankYouRect = thankYouSection.getBoundingClientRect();
    
    // Update position for both modes, with boundary respect
    updateNavigatorPosition(problemGoalsRect, thankYouRect);
  }
  
  // Update navigator position to stay within section boundaries (both modes)
  function updateNavigatorPosition(problemGoalsRect, thankYouRect) {
    const viewportHeight = window.innerHeight;
    const navigatorHeight = sideNavigator.offsetHeight;
    
    // Define the minimum top position - never go above Problem & Goals section
    const minTopPosition = Math.max(100, problemGoalsRect.top); // 100px minimum for header clearance
    
    // Define the bottom boundary - respect Thank You section
    const bottomBoundary = Math.min(viewportHeight - 50, thankYouRect.top - 20); // 50px from bottom, 20px from thank you
    
    // Calculate available space
    const availableHeight = bottomBoundary - minTopPosition;
    
    // Calculate the ideal center position
    const idealCenterPosition = minTopPosition + (availableHeight - navigatorHeight) / 2;
    
    // Ensure the navigator stays within bounds
    let finalPosition;
    
    if (navigatorHeight <= availableHeight && availableHeight > 0) {
      // Navigator fits within boundaries, use centered position but never go above min
      finalPosition = Math.max(minTopPosition, idealCenterPosition);
    } else {
      // Navigator is too tall or no space, stick to minimum position
      finalPosition = minTopPosition;
    }
    
    // Apply the position
    sideNavigator.style.top = `${finalPosition}px`;
    sideNavigator.style.transform = 'translateY(0)';
  }
  
  // Update active section based on scroll position
  function updateActiveSection() {
    if (!sideNavigator.classList.contains('active')) return;
    
    let activeSection = null;
    
    // Get the navigator's position to use as reference point
    const navigatorRect = sideNavigator.getBoundingClientRect();
    const referencePoint = navigatorRect.top + 50; // Use navigator's top + small offset as reference
    
    // Find which section we're currently in by checking if we're past its start
    // and before the next section's start
    for (let i = 0; i < sections.length; i++) {
      const currentSectionId = sections[i];
      const currentElement = document.getElementById(currentSectionId);
      
      if (currentElement) {
        const currentRect = currentElement.getBoundingClientRect();
        
        // Check if we've scrolled to this section (section top is at or above reference point)
        if (currentRect.top <= referencePoint) {
          // Check if there's a next section
          if (i < sections.length - 1) {
            const nextSectionId = sections[i + 1];
            const nextElement = document.getElementById(nextSectionId);
            
            if (nextElement) {
              const nextRect = nextElement.getBoundingClientRect();
              
              // If we haven't reached the next section yet, this is our active section
              if (nextRect.top > referencePoint) {
                activeSection = currentSectionId;
              }
            }
          } else {
            // This is the last section, so it's active if we've passed its top
            activeSection = currentSectionId;
          }
        }
      }
    }
    
    // Update active states
    navItems.forEach(item => {
      item.classList.remove('active');
    });
    
    if (activeSection) {
      const activeItem = document.querySelector(`[data-target="${activeSection}"]`);
      if (activeItem) {
        activeItem.classList.add('active');
      }
    }
  }
  
  // Handle navigation item clicks
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Calculate offset to position section title at top of screen
        const rect = targetElement.getBoundingClientRect();
        const currentScroll = window.pageYOffset;
        const targetPosition = currentScroll + rect.top - 100; // 100px offset for header
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Listen for scroll events
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    updateNavigatorVisibility();
    
    // Throttle the active section update for better performance
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveSection, 50);
  });
  
  // Listen for window resize to hide/show navigator
  window.addEventListener('resize', function() {
    if (window.innerWidth < 1378) {
      sideNavigator.classList.remove('active');
    } else {
      updateNavigatorVisibility();
    }
  });
  
  // Initial check
  updateNavigatorVisibility();
  updateActiveSection();
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
        } else if (body.classList.contains("tarkov-page")) {
            header.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        } else {
            header.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
        header.style.position = 'fixed';
        header.style.top = '0';
        header.style.left = '0';
        header.style.right = '0';
        header.style.zIndex = '1000';
        
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
    
    // Special handling for Tarkov page if it exists
    if (document.body.classList.contains('tarkov-page')) {
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
    if (!document.body.classList.contains('tarkov-page')) return;
    
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

// ---- Carousel Grocery Functionality ----
let currentSlide = 2;
let totalSlides = 5;
let autoSlideInterval;
let isDragging = false;
let startX = 0;
let currentX = 0;
let threshold = 50;

function initializeCarousel() {
    const carouselTrack = document.getElementById('carouselTrack');
    if (!carouselTrack) return;
    
    // Initialize first slide as active
    updateCarousel();
    
    // Start auto-slide
    startAutoSlide();
    
    // Add drag functionality
    addDragFunctionality();
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyDown);
}

function updateCarousel() {
    const slides = document.querySelectorAll('.mockup-slide');
    const indicators = document.querySelectorAll('.indicator');
    const carouselTrack = document.getElementById('carouselTrack');
    
    if (!carouselTrack) return;
    
    // Update slides
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'clickable');
        if (index === currentSlide) {
            slide.classList.add('active');
        } else if (index === currentSlide - 1 || index === currentSlide + 1) {
            slide.classList.add('clickable');
        }
    });
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
    
    // Move carousel track
    const slideWidth = 50; // 50% width per slide
    const offset = -currentSlide * slideWidth;
    carouselTrack.style.transform = `translateX(${offset}%)`;
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
    resetAutoSlide();
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        if (!isDragging) {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }
    }, 5000);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

function addDragFunctionality() {
    const carouselTrack = document.getElementById('carouselTrack');
    if (!carouselTrack) return;
    
    // Mouse events
    carouselTrack.addEventListener('mousedown', handleDragStart);
    carouselTrack.addEventListener('mousemove', handleDragMove);
    carouselTrack.addEventListener('mouseup', handleDragEnd);
    carouselTrack.addEventListener('mouseleave', handleDragEnd);
    
    // Touch events
    carouselTrack.addEventListener('touchstart', handleDragStart, { passive: false });
    carouselTrack.addEventListener('touchmove', handleDragMove, { passive: false });
    carouselTrack.addEventListener('touchend', handleDragEnd);
}

function handleDragStart(e) {
    isDragging = true;
    const carouselTrack = document.getElementById('carouselTrack');
    carouselTrack.classList.add('dragging');
    
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    startX = clientX;
    currentX = clientX;
}

function handleDragMove(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    currentX = clientX;
}

function handleDragEnd() {
    if (!isDragging) return;
    
    isDragging = false;
    const carouselTrack = document.getElementById('carouselTrack');
    carouselTrack.classList.remove('dragging');
    
    const deltaX = currentX - startX;
    
    if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
            // Go to previous slide
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
            resetAutoSlide();
        } else {
            // Go to next slide
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
            resetAutoSlide();
        }
    }
    
    startX = 0;
    currentX = 0;
}

function handleKeyDown(e) {
    if (e.key === 'ArrowLeft') {
        // Go to previous slide
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
        resetAutoSlide();
    } else if (e.key === 'ArrowRight') {
        // Go to next slide
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
        resetAutoSlide();
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCarousel);

// Pause auto-slide when page is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearInterval(autoSlideInterval);
    } else {
        startAutoSlide();
    }
});
