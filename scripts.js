document.addEventListener('DOMContentLoaded', () => {
  // ---- Text Carousel Logic ----
  const textCarouselContent = document.getElementById('carouselContent');
  const textContainerWidth = document.querySelector('.carousel-container').offsetWidth;

  let textContentWidth = textCarouselContent.scrollWidth;

  // Clone text items to ensure enough content for scrolling
  while (textContentWidth < textContainerWidth * 10) {
    const textItems = Array.from(textCarouselContent.children);
    textItems.forEach(item => {
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
  window.addEventListener('resize', adjustTextScrollSpeed);

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

  // ---- Vertical Loop Animation Logic ----
  const fundoPoligonos = document.querySelector(".fundo-poligonos");
  const contentHeight = fundoPoligonos.scrollHeight;

  // Clone the content to create a seamless loop
  const clone = fundoPoligonos.cloneNode(true);
  clone.classList.add("fundo-poligonos-clone");
  fundoPoligonos.parentNode.appendChild(clone);

  let scrollPosition = 0;
  let animationFrameId;

  function scrollUp() {
    scrollPosition -= 1;
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
  const toggleSwitch = document.querySelector('.toggle-switch');
  const playIcon = document.querySelector('.play-icon');
  const pauseIcon = document.querySelector('.pause-icon');
  let isPaused = false;

  // Set initial state of icons
  playIcon.style.opacity = '0';
  pauseIcon.style.opacity = '1';

  toggleSwitch.addEventListener('click', () => {
    if (isPaused) {
      // Resume the animation
      scrollUp();
      playIcon.style.opacity = '0';
      pauseIcon.style.opacity = '1';
    } else {
      // Pause the animation
      cancelAnimationFrame(animationFrameId);
      playIcon.style.opacity = '1';
      pauseIcon.style.opacity = '0';
    }
    isPaused = !isPaused;
  });

  // ---- Nav Underline Toggle Logic ----
  const contactLink = document.getElementById('contactLink');
  const contactUnderline = document.getElementById('contactUnderline');

  contactLink.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    contactUnderline.classList.add('active'); // Ensure underline is active before scrolling

    smoothScrollTo(document.body.scrollHeight, 1000); // Smooth scroll to footer
  });

  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
      if (isAtBottom) {
        contactUnderline.classList.add('active');
      } else {
        contactUnderline.classList.remove('active');
      }
    }
  });

  // Function to move the toggle-switch into the header for small screens
  function adjustToggleSwitchPlacement() {
    const headerBox = document.querySelector('.headerBox');
    const toggleSwitch = document.querySelector('.toggle-switch');
    const screenWidth = window.innerWidth;

    if (screenWidth <= 768) {
      if (!headerBox.contains(toggleSwitch)) {
        headerBox.appendChild(toggleSwitch);
      }
    } else {
      // Move the toggle-switch back to its original position if needed
      const body = document.querySelector('.body');
      if (body && !body.contains(toggleSwitch)) {
        body.appendChild(toggleSwitch);
      }
    }
  }

  // Call the function initially and whenever the window is resized
  adjustToggleSwitchPlacement();
  window.addEventListener('resize', adjustToggleSwitchPlacement);
});

// Flag to prevent multiple scroll actions at the same time
let isScrolling = false;

// Function to perform smooth scrolling
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
      // Ensure the "Contact" underline remains active when scrolled to the bottom
      if (target === document.body.scrollHeight) {
        document.getElementById("contactUnderline").classList.add("active");
      }
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
    const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
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

document.addEventListener('DOMContentLoaded', () => {
  // Hamburger menu logic
  const menuButton = document.querySelector('.menu-svg');
  const hamburgerMenu = document.getElementById('hamburgerMenu');
  const returnArrow = document.getElementById('returnArrow');

  menuButton.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active');
  });

  // Close the menu when clicking the return arrow
  returnArrow.addEventListener('click', () => {
    hamburgerMenu.classList.remove('active');
  });

  // Close the menu when clicking outside of it
  document.addEventListener('click', (event) => {
    if (!hamburgerMenu.contains(event.target) && !menuButton.contains(event.target)) {
      hamburgerMenu.classList.remove('active');
    }
  });
});




