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
  const fundoPoligonos = document.querySelector(".fundo-poligonos");
  const contentHeight = fundoPoligonos.scrollHeight;

  // Clone the content to create a seamless loop
  const clone = fundoPoligonos.cloneNode(true);
  clone.classList.add("fundo-poligonos-clone");
  fundoPoligonos.parentNode.appendChild(clone);

  let scrollPosition = 0;
  let scrollSpeed = 0.5; // Default scroll speed
  let animationFrameId;

  function scrollUp() {
    scrollPosition -= scrollSpeed; // Use scrollSpeed here
    if (scrollPosition <= -contentHeight) {
      scrollPosition = 0;
    }
    fundoPoligonos.style.transform = `translateY(${scrollPosition}px)`;
    clone.style.transform = `translateY(${scrollPosition + contentHeight}px)`;
    animationFrameId = requestAnimationFrame(scrollUp);
  }

  // Start the animation initially
  scrollUp();

  // ---- Play/Pause Button Logic ----
  const toggleSwitch = document.querySelector(".toggle-switch");
  const playIcon = document.querySelector(".play-icon");
  const pauseIcon = document.querySelector(".pause-icon");
  let isPaused = false;

  // Set initial state of icons
  playIcon.style.opacity = "0";
  pauseIcon.style.opacity = "1";

  toggleSwitch.addEventListener("click", () => {
    if (isPaused) {
      // Resume the animation
      scrollUp();
      playIcon.style.opacity = "0";
      pauseIcon.style.opacity = "1";
    } else {
      // Pause the animation
      cancelAnimationFrame(animationFrameId);
      playIcon.style.opacity = "1";
      pauseIcon.style.opacity = "0";
    }
    isPaused = !isPaused;
  });

  // ---- Nav Underline Toggle Logic ----
  const contactLink = document.getElementById("contactLink");
  const contactUnderline = document.getElementById("contactUnderline");

  contactLink.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    contactUnderline.classList.add("active"); // Ensure underline is active before scrolling

    smoothScrollTo(document.body.scrollHeight, 1000); // Smooth scroll to footer
  });

  let isScrolling = false;

  window.addEventListener("scroll", () => {
    if (!isScrolling) {
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight;
      if (isAtBottom) {
        contactUnderline.classList.add("active");
      } else {
        contactUnderline.classList.remove("active");
      }
    }
  });

  // Function to move the toggle-switch into the header for small screens
  function adjustToggleSwitchPlacement() {
    const headerBox = document.querySelector(".headerBox");
    const toggleSwitch = document.querySelector(".toggle-switch");
    const screenWidth = window.innerWidth;

    if (screenWidth <= 768) {
      if (!headerBox.contains(toggleSwitch)) {
        headerBox.appendChild(toggleSwitch);
      }
    } else {
      // Move the toggle-switch back to its original position if needed
      const body = document.querySelector(".body");
      if (body && !body.contains(toggleSwitch)) {
        body.appendChild(toggleSwitch);
      }
    }
  }

  // Call the function initially and whenever the window is resized
  adjustToggleSwitchPlacement();
  window.addEventListener("resize", adjustToggleSwitchPlacement);
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


// Initialize "Work" underline as always active
document.getElementById("workUnderline").classList.add("active");

// Event listener for "About" link
document.getElementById("aboutLink").addEventListener("click", function () {
  window.location.href = "about.html";
});

// Event listener for "Work" link
document.getElementById("workLink").addEventListener("click", function (event) {
  if (window.scrollY === 0) {
    event.preventDefault(); // Prevent scroll jump when at the top
  } else {
    smoothScrollTo(0, 500); // Smooth scroll to top
  }
  document.getElementById("workUnderline").classList.add("active");
  document.getElementById("contactUnderline").classList.remove("active");
});

// Scroll event to toggle "Contact" underline and keep "Work" underline active
window.addEventListener("scroll", function () {
  if (!isScrolling) {
    const isAtBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight;
    const contactUnderline = document.getElementById("contactUnderline");

    if (isAtBottom) {
      contactUnderline.classList.add("active");
    } else {
      contactUnderline.classList.remove("active");
    }

    // Keep "Work" underline always active
    document.getElementById("workUnderline").classList.add("active");
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

  // Close the menu when clicking the return arrow and unlock scroll
  returnArrow.addEventListener("click", () => {
    hamburgerMenu.style.setProperty("--menu-transition-duration", closeDuration);
    hamburgerMenu.classList.add("hidden");
    document.body.classList.remove("no-scroll"); // Enable scrolling
    setTimeout(() => {
      hamburgerMenu.classList.remove("active");
      hamburgerMenu.style.display = "none"; // Hide the menu after the animation
    }, 600); // Wait for the close animation to complete before removing the active class
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
    setTimeout(() => {
      hamburgerMenu.classList.add("active");
      hamburgerMenu.classList.remove("hidden");
    }, 10); // Slight delay to ensure the display property is set before applying the class
  });

  // Close the menu when clicking the return arrow and unlock scroll
  returnArrow.addEventListener("click", () => {
    hamburgerMenu.style.setProperty("--menu-transition-duration", closeDuration);
    hamburgerMenu.classList.add("hidden");
    document.body.classList.remove("no-scroll"); // Enable scrolling
    setTimeout(() => {
      hamburgerMenu.classList.remove("active");
      hamburgerMenu.style.display = "none"; // Hide the menu after the animation
    }, 600); // Wait for the close animation to complete before removing the active class
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

/* Direction to the "about" page mobile*/

document.addEventListener("DOMContentLoaded", () => {
  const hamburgerAboutLink = document.getElementById("hamburgerAboutLink");

  // Event listener for "ABOUT" link
  hamburgerAboutLink.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    window.location.href = "about.html"; // Redirect to about.html
  });
});

/* Direction to the "work" page mobile */

document.addEventListener("DOMContentLoaded", () => {
  const hamburgerWorkLink = document.getElementById("hamburgerWorkLink");

  // Event listener for "WORK" link
  hamburgerWorkLink.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    window.location.href = "index.html"; // Redirect to index.html
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const hamburgerAboutLink = document.getElementById("hamburgerAboutLink");
  const hamburgerAboutUnderline = document.getElementById("hamburgerAboutUnderline");

  // Check if the elements exist before adding event listeners
  if (hamburgerAboutLink && hamburgerAboutUnderline) {
    // Event listener for "ABOUT" link
    hamburgerAboutLink.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default anchor behavior
      window.location.href = "about.html"; // Redirect to about.html
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

