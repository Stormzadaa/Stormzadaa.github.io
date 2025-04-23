document.addEventListener("DOMContentLoaded", () => {
  // ---- Text Carousel Logic ----
  const textCarouselContent = document.getElementById("carouselContent");
  const textContainerWidth = document.querySelector(".carousel-container")?.offsetWidth;

  if (textCarouselContent && textContainerWidth) {
    let textContentWidth = textCarouselContent.scrollWidth;

    // Clone text items to ensure enough content for scrolling
    while (textContentWidth < textContainerWidth * 10) {
      const textItems = Array.from(textCarouselContent.children);
      textItems.forEach((item) => {
        const clone = item.cloneNode(true);
        textCarouselContent.appendChild(clone);
      });
      textContentWidth = textCarouselContent.scrollWidth;
    }

    let textCurrentPosition = 0;
    let textScrollSpeed = 0.3; // Default scroll speed

    // Function to adjust scroll speed based on screen width
    function adjustTextScrollSpeed() {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 770) {
        textScrollSpeed = 0.1; // Slower speed for small screens
      } else if (screenWidth <= 1024) {
        textScrollSpeed = 0.2; // Moderate speed for medium screens
      } else {
        textScrollSpeed = 0.3; // Default speed for larger screens
      }
    }

    // Call adjustTextScrollSpeed initially and whenever the window is resized
    adjustTextScrollSpeed();
    window.addEventListener("resize", adjustTextScrollSpeed);

    function animateTextScroll() {
      textCurrentPosition -= textScrollSpeed;
      if (Math.abs(textCurrentPosition) >= textContentWidth / 2) {
        textCurrentPosition = 0;
      }
      textCarouselContent.style.transform = `translateX(${textCurrentPosition}px)`;
      requestAnimationFrame(animateTextScroll);
    }

    // Start the animation initially
    requestAnimationFrame(animateTextScroll);
  }

// ---- Vertical Loop Animation Logic ----
const toggleSwitch = document.querySelector(".toggle-switch");
const playIcon = document.querySelector(".play-icon");
const pauseIcon = document.querySelector(".pause-icon");
const fundoPoligonos = document.querySelector(".fundo-poligonos");

if (!toggleSwitch || !playIcon || !pauseIcon || !fundoPoligonos) {
  console.error("Required elements are missing in the DOM.");
  return;
}

let contentHeight = fundoPoligonos.scrollHeight;
let scrollPosition = 0;
let scrollSpeed = 0.5;
let animationFrameId;
let isAnimationRunning = false;
let isPaused = false;

// Clone the content to create a seamless loop
const clone = fundoPoligonos.cloneNode(true);
clone.classList.add("fundo-poligonos-clone");
fundoPoligonos.parentNode.appendChild(clone);

// Function to handle vertical scrolling
function scrollUp() {
  if (!isAnimationRunning) return;

  scrollPosition -= scrollSpeed;

  if (scrollPosition <= -contentHeight) {
    scrollPosition = 0;
  }

  fundoPoligonos.style.transform = `translateY(${scrollPosition}px)`;
  clone.style.transform = `translateY(${scrollPosition + contentHeight}px)`;

  animationFrameId = requestAnimationFrame(scrollUp);
}

// Function to update play/pause state
function updatePlayPauseState(paused, broadcast = true) {
  if (paused) {
    isAnimationRunning = false;
    cancelAnimationFrame(animationFrameId);
    playIcon.classList.add("active");
    pauseIcon.classList.remove("active");
  } else {
    if (!isAnimationRunning) {
      isAnimationRunning = true;
      scrollUp();
    }
    playIcon.classList.remove("active");
    pauseIcon.classList.add("active");
  }
  isPaused = paused;

  // Save the state to localStorage
  if (broadcast) {
    localStorage.setItem("isPaused", isPaused);
  }
}

// Add event listener for the toggle button
toggleSwitch.addEventListener("click", () => {
  updatePlayPauseState(!isPaused);
});

// Listen for changes in localStorage to sync across tabs
window.addEventListener("storage", (event) => {
  if (event.key === "isPaused") {
    const pausedState = event.newValue === "true";
    if (pausedState !== isPaused) {
      updatePlayPauseState(pausedState, false);
    }
  }
});

// Initialize the state from localStorage
const savedState = localStorage.getItem("isPaused");
if (savedState !== null) {
  isPaused = savedState === "true";

  // Align the button state with the animation state
  if (isPaused) {
    playIcon.classList.add("active");
    pauseIcon.classList.remove("active");
  } else {
    playIcon.classList.remove("active");
    pauseIcon.classList.add("active");
    isAnimationRunning = true;
    scrollUp();
  }
} else {
  // Start the animation by default (play state)
  isPaused = false; // Ensure it's not paused
  playIcon.classList.remove("active");
  pauseIcon.classList.add("active");
  isAnimationRunning = true;
  scrollUp();
}

// ---- Mobile Responsiveness and Performance Improvements ----
window.addEventListener("resize", () => {
  const newContentHeight = fundoPoligonos.scrollHeight;
  if (contentHeight !== newContentHeight) {
    contentHeight = newContentHeight;
    scrollPosition = 0; // Reset position after resize
  }
});

// Adjust scroll speed based on screen size
const mediaQuery = window.matchMedia("(max-width: 768px)");

function updateScrollSpeed() {
  scrollSpeed = mediaQuery.matches ? 0.25 : 0.5;
}

mediaQuery.addEventListener("change", updateScrollSpeed);
updateScrollSpeed(); // Initial check



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

  // Check if the current page is the Tarkov page
  if (document.body.classList.contains("tarkov-page")) {
    // Trigger animations (CSS handles the animations)
    console.log("Tarkov page loaded. Animations applied.");
  }
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
  const contactLink = document.getElementById("contactLink"); // Header "Contact" button
  const hamburgerContactLink = document.getElementById("hamburgerContactLink"); // Hamburger menu "Contact" button
  const footer = document.querySelector("footer"); // Footer element

  // Function to scroll to the footer
  function scrollToFooter(event) {
    event.preventDefault(); // Prevent default anchor behavior
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to the footer
    } else {
      console.warn("Footer not found on this page.");
    }
  }

  // Add event listeners for both "Contact" buttons
  if (contactLink) {
    contactLink.addEventListener("click", scrollToFooter);
  }

  if (hamburgerContactLink) {
    hamburgerContactLink.addEventListener("click", scrollToFooter);
  }
});


