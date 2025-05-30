document.addEventListener("DOMContentLoaded", () => {
  // ---- Infinite Text Carousel Animation Logic ----
  const textCarouselContent = document.getElementById("carouselContent");
  if (textCarouselContent) {
    // Duplicate the content for seamless infinite effect
    const textClone = textCarouselContent.cloneNode(true);
    textClone.id = "carouselContentClone";
    textCarouselContent.parentNode.appendChild(textClone);

    // Set up initial positions
    let textBaseSpeed = getTextCarouselSpeed();
    let textSpeed = textBaseSpeed;
    let textPos1 = 0;
    let textPos2 = textCarouselContent.offsetWidth;

    // 4 speeds for 4 breakpoints matching your CSS media queries
    function getTextCarouselSpeed() {
      const width = window.innerWidth;
      if (width <= 430) return 2;
      if (width <= 768) return 2.5;
      if (width <= 1279) return 3;
      return 4;
    }

    function animateTextCarousel() {
      textPos1 -= textSpeed;
      textPos2 -= textSpeed;

      // When the first content is fully out of view, reset its position after the clone
      if (textPos1 <= -textCarouselContent.offsetWidth) {
        textPos1 = textPos2 + textCarouselContent.offsetWidth;
      }
      if (textPos2 <= -textClone.offsetWidth) {
        textPos2 = textPos1 + textClone.offsetWidth;
      }

      textCarouselContent.style.transform = `translateX(${textPos1}px)`;
      textClone.style.transform = `translateX(${textPos2}px)`;

      requestAnimationFrame(animateTextCarousel);
    }

    // Ensure both contents are inline and next to each other
    textCarouselContent.style.display = "inline-flex";
    textClone.style.display = "inline-flex";
    textClone.style.position = "absolute";
    textClone.style.left = "0";
    textClone.style.top = "0";

    // Set parent container to relative for absolute positioning
    textCarouselContent.parentNode.style.position = "relative";
    textCarouselContent.parentNode.style.height = `${textCarouselContent.offsetHeight}px`;

    // Start the animation
    animateTextCarousel();

    // Responsive: update widths, positions, and speed on resize
    window.addEventListener("resize", () => {
      textBaseSpeed = getTextCarouselSpeed();
      textSpeed = textBaseSpeed;
      textPos1 = 0;
      textPos2 = textCarouselContent.offsetWidth;
      textClone.style.width = `${textCarouselContent.offsetWidth}px`;
      textCarouselContent.parentNode.style.height = `${textCarouselContent.offsetHeight}px`;
    });

    // --- Hover effect for individual spans and speed ---
    function handleSpanHover(span) {
      textSpeed = textBaseSpeed / 2;
      span.style.transition = "font-size 0.5s";
      span.style.fontSize = "1.05em";
    }

    function handleSpanLeave(span) {
      textSpeed = textBaseSpeed;
      span.style.fontSize = "";
    }

    // Attach listeners to all spans in both original and clone
    function attachSpanListeners(container) {
      const spans = container.querySelectorAll("span");
      spans.forEach(span => {
        // Set display and min-width to prevent shifting
        span.style.display = "inline-block";
        // Optionally, set min-width based on the span's initial width
        if (!span.style.minWidth) {
          span.style.minWidth = `${span.offsetWidth}px`;
        }
        span.addEventListener("mouseenter", () => handleSpanHover(span));
        span.addEventListener("mouseleave", () => handleSpanLeave(span));
      });
    }

    attachSpanListeners(textCarouselContent);
    attachSpanListeners(textClone);
  }

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
    let bgScrollSpeed = 0.5;

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
      fundoClone.style.transform = `translateY(${bgScrollPosition + bgContentHeight}px)`;
      setBgPos(bgScrollPosition); // Save position on every frame
      bgAnimationFrameId = requestAnimationFrame(scrollBgUp);
    }

    // Set initial position from storage
    fundoPoligonos.style.transform = `translateY(${bgScrollPosition}px)`;
    fundoClone.style.transform = `translateY(${bgScrollPosition + bgContentHeight}px)`;

    // Responsive: update heights and reset position on resize
    window.addEventListener("resize", () => {
      const newBgContentHeight = fundoPoligonos.scrollHeight;
      if (bgContentHeight !== newBgContentHeight) {
        bgContentHeight = newBgContentHeight;
        // Keep the same scroll position ratio
        fundoPoligonos.style.transform = `translateY(${bgScrollPosition}px)`;
        fundoClone.style.transform = `translateY(${bgScrollPosition + bgContentHeight}px)`;
      }
    });

    // Adjust scroll speed based on screen size
    const bgMediaQuery = window.matchMedia("(max-width: 768px)");
    function updateBgScrollSpeed() {
      bgScrollSpeed = bgMediaQuery.matches ? 0.25 : 0.5;
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
        fundoClone.style.transform = `translateY(${bgScrollPosition + bgContentHeight}px)`;
      }
    });

    // Start or pause animation on load
    updateToggleIcons();
    if (bgIsAnimationRunning) {
      scrollBgUp();
    } else {
      cancelAnimationFrame(bgAnimationFrameId);
      fundoPoligonos.style.transform = `translateY(${bgScrollPosition}px)`;
      fundoClone.style.transform = `translateY(${bgScrollPosition + bgContentHeight}px)`;
    }
  }

  // ---- Nav Underline Toggle Logic ----
  const contactLink = document.getElementById("contactLink");
  const contactUnderline = document.getElementById("contactUnderline");
  const workUnderline = document.getElementById("workUnderline");
  const footer = document.querySelector("footer");

  // Check if the current page is index.html
  const isIndexPage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";

  contactLink.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    smoothScrollTo(document.body.scrollHeight, 1000); // Scroll to the bottom of the page
  });

  window.addEventListener("scroll", () => {
    const footerRect = footer.getBoundingClientRect();
    const isFooterVisible = footerRect.top < window.innerHeight && footerRect.bottom >= 0;

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

    if (screenWidth <= 768) {
      // Move toggle-switch into headerBox for mobile screens
      if (headerBox && !headerBox.contains(toggleSwitch)) {
        headerBox.appendChild(toggleSwitch);
      }
    } else {
      // Move toggle-switch back to its original position for larger screens
      if (body && !body.contains(toggleSwitch)) {
        body.appendChild(toggleSwitch);
      }
    }
  }

  // Call the function initially and whenever the window is resized
  adjustToggleSwitchPlacement();
  window.addEventListener("resize", adjustToggleSwitchPlacement);
  });

  // Check if the current page is index.html
  const isIndexPage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";

  // Initialize "Work" underline as always active only on index.html
  if (isIndexPage) {
    document.getElementById("workUnderline").classList.add("active");
  } else {
    document.getElementById("workUnderline").classList.remove("active");
  }

  // Event listener for "About" link
  document.getElementById("aboutLink").addEventListener("click", function (event) {
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
    const isIndexPage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";
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
  document.getElementById("workLink").addEventListener("click", handleWorkLinkClick);


  // Scroll event to toggle "Contact" underline and keep "Work" and "About" underlines active only on their respective pages
  window.addEventListener("scroll", function () {
  const footer = document.querySelector("footer");
  const footerRect = footer.getBoundingClientRect();
  const isFooterVisible = footerRect.top < window.innerHeight && footerRect.bottom >= 0;
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
  const returnArrow = document.getElementById("returnArrow");

  // Define custom properties for transition durations
  const openDuration = "0.9s";
  const closeDuration = "0.5s";

  // Function to close the menu if screen width is greater than 768px
  function closeMenuOnLargeScreens() {
    const screenWidth = window.innerWidth;
    if (screenWidth > 768) {
      hamburgerMenu.style.setProperty("--menu-transition-duration", closeDuration);
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
  hamburgerMenu.style.setProperty("--menu-transition-duration", closeDuration);
  hamburgerMenu.classList.add("hidden");
  document.body.classList.remove("no-scroll"); // Enable scrolling
  setTimeout(() => {
    hamburgerMenu.classList.remove("active");
    hamburgerMenu.style.display = "none"; // Hide the menu after the animation
  }, 600); // Wait for the close animation to complete before removing the active class
}

  // Close the menu when clicking the return arrow and unlock scroll
  returnArrow.addEventListener("click", closeMenu);

  // Close the menu when clicking outside of it and unlock scroll
  document.addEventListener("click", (event) => {
    if (!hamburgerMenu.contains(event.target) && !menuButton.contains(event.target)) {
      closeMenu();
    }
  });

  // Close the menu when clicking any menu option
  const menuOptions = document.querySelectorAll("#hamburgerMenu a"); // Assuming menu options are anchor tags
  menuOptions.forEach(option => {
    option.addEventListener("click", closeMenu);
  });


    // Close the menu when clicking outside of it and unlock scroll
    document.addEventListener("click", (event) => {
      if (!hamburgerMenu.contains(event.target) && !menuButton.contains(event.target)) {
        hamburgerMenu.style.setProperty("--menu-transition-duration", closeDuration);
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
  const hamburgerContactUnderline = document.getElementById("hamburgerContactUnderline");

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
  const returnArrow = document.getElementById("returnArrow");

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
    if (!hamburgerMenu.contains(event.target) && !menuButton.contains(event.target)) {
      hamburgerMenu.style.setProperty("--menu-transition-duration", closeDuration);
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
  const hamburgerWorkUnderline = document.getElementById("hamburgerWorkUnderline");

  // Check if the elements exist before adding event listeners
  if (hamburgerWorkLink && hamburgerWorkUnderline) {
    // Event listener for "WORK" link
    hamburgerWorkLink.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default anchor behavior
      const isWorkPage = window.location.pathname.endsWith("index.html");
      if (isWorkPage) {
        // Scroll to the header if on index.html page
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
    console.error("Element with ID 'hamburgerWorkLink' or 'hamburgerWorkUnderline' not found.");
  }
  });


  /* Direction to the "ABOUT" page mobile */
  document.addEventListener("DOMContentLoaded", () => {
  const hamburgerAboutLink = document.getElementById("hamburgerAboutLink");
  const hamburgerAboutUnderline = document.getElementById("hamburgerAboutUnderline");

  // Check if the elements exist before adding event listeners
  if (hamburgerAboutLink && hamburgerAboutUnderline) {
    // Event listener for "ABOUT" link
    hamburgerAboutLink.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default anchor behavior
      const isAboutPage = window.location.pathname.endsWith("about.html");
      if (isAboutPage) {
        // Scroll to the header if on about.html page
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
    console.error("Element with ID 'hamburgerAboutLink' or 'hamburgerAboutUnderline' not found.");
  }
  });

  document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // Check if the page is the Tarkov page
  if (body.classList.contains("tarkov-page")) {
    const portfolioSection = document.querySelector(".portfolio-section");
    const header = document.querySelector(".header");
    const footer = document.querySelector("footer");

    // Simulate the color change after a delay
    setTimeout(() => {
      portfolioSection?.classList.add("tarkov-active");
      header?.classList.add("tarkov-active");
      footer?.classList.add("tarkov-active");
    }, 1000); // Adjust the delay as needed
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

  // Check if the page is the Tarkov page
  if (body.classList.contains("tarkov-page")) {
    const portfolioSection = document.querySelector(".portfolio-section");
    const header = document.querySelector(".header");
    const footer = document.querySelector("footer");
    const hamburgerMenu = document.getElementById("hamburgerMenu");

    // Simulate the color change after a delay
    setTimeout(() => {
      portfolioSection?.classList.add("tarkov-active");
      header?.classList.add("tarkov-active");
      footer?.classList.add("tarkov-active");
      // Change hamburger menu color for Tarkov page (especially on mobile)
      if (hamburgerMenu) {
        hamburgerMenu.classList.add("tarkov-active");
      }
    }, 1000); // Adjust the delay as needed
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.tarkov-3d-carousel-section .carousel');
  if (!carousel) return;
  const cards = carousel.querySelectorAll('.card');
  const prevBtn = document.querySelector('.tarkov-3d-carousel-section .prev-btn');
  const nextBtn = document.querySelector('.tarkov-3d-carousel-section .next-btn');
  const subtitle = document.getElementById('carouselSubtitle');

  // Array of subtitles in order
  const subtitles = [
    "Settings & PostFX",
    "Menu with Friend List",
    "Selection Wheel",
    "Selection Page",
    "Flea Market"
  ];

  let currentIndex = 0;
  const totalCards = cards.length;
  const theta = (2 * Math.PI) / totalCards;
  const radius = 1900;

  function updateSubtitle(index) {
    if (!subtitle) return;
    subtitle.classList.remove('visible');
    setTimeout(() => {
      subtitle.textContent = subtitles[index];
      subtitle.classList.add('visible');
    }, 300); // Match this to your CSS transition
  }

  function arrangeCards() {
    cards.forEach((card, index) => {
      const angle = theta * index;
      card.style.transform = `translateX(-50%) rotateY(${angle}rad) translateZ(${radius}px)`;
    });
    carousel.style.transform = `translateZ(-${radius}px) rotateY(${-currentIndex * theta}rad)`;
    updateSubtitle(currentIndex);
  }

  arrangeCards();
  updateSubtitle(currentIndex);

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
    arrangeCards();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalCards;
    arrangeCards();
  });

  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      currentIndex = index;
      arrangeCards();
    });
  });
});








