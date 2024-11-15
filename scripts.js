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

// Event listener for "Contact" link
document.getElementById("contactLink").addEventListener("click", function () {
  document.getElementById("contactUnderline").classList.add("active");
  smoothScrollTo(document.body.scrollHeight, 1000); // Smooth scroll to footer
});

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

// Select the logo element and add click event for logo animation and navigation
const logo = document.querySelector(".logo");
logo.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent immediate navigation
  logo.style.transition = "transform 0.2s ease";
  logo.style.transform = "scale(1.2)"; // Animate scale on click

  setTimeout(() => {
    logo.style.transform = "scale(1)"; // Reset scale after animation
    window.location.href = "index.html"; // Navigate to index page
  }, 200);
});

// Function to animate and navigate to a target URL
function animateAndNavigate(element, targetUrl) {
  // Variable to store whether the link is being clicked
  let isClicking = false;

  // Mouseover (hover) event to scale on hover
  element.addEventListener("mouseover", function () {
    if (!isClicking) { // Only scale if not currently in the click animation state
      element.style.transition = "transform 0.2s ease"; // Add smooth transition for hover
      element.style.transform = "scale(1.2)"; // Scale up on hover
    }
  });

  // Mouseout event to remove scaling after hover
  element.addEventListener("mouseout", function () {
    if (!isClicking) { // Only remove scaling if not in the click state
      element.style.transform = "scale(1)"; // Reset scale
    }
  });

  // Click event to scale on click
  element.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent immediate navigation

    // Set the clicking state to true
    isClicking = true;

    // Apply scaling on click
    element.style.transition = "transform 0.2s ease"; // Add smooth transition for click animation
    element.style.transform = "scale(1.2)"; // Animate scale on click

    // After the click animation completes, navigate to the target URL
    setTimeout(() => {
      // Reset the scale back to normal after the click animation
      element.style.transform = "scale(1)";

      // Allow hover to apply again after the click animation finishes
      isClicking = false;

      // Navigate to the target URL
      window.location.href = targetUrl;
    }, 200); // Duration of the click scaling animation
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // ---- Text Carousel Logic ----
  const textCarouselContent = document.getElementById('carouselContent');
  const textContainerWidth = document.querySelector('.carousel-container').offsetWidth;

  let textContentWidth = textCarouselContent.scrollWidth;
  while (textContentWidth < textContainerWidth * 10) {
    const textItems = Array.from(textCarouselContent.children);
    textItems.forEach(item => {
      const clone = item.cloneNode(true);
      textCarouselContent.appendChild(clone);
    });
    textContentWidth = textCarouselContent.scrollWidth;
  }

  let textCurrentPosition = 0;
  const textScrollSpeed = 0.3;

  function animateTextScroll() {
    textCurrentPosition -= textScrollSpeed;
    if (Math.abs(textCurrentPosition) >= textContentWidth / 2) {
      textCurrentPosition = 0;
    }
    textCarouselContent.style.transform = `translateX(${textCurrentPosition}px)`;
    requestAnimationFrame(animateTextScroll);
  }

  requestAnimationFrame(animateTextScroll);
});

document.addEventListener('DOMContentLoaded', () => {
  // ---- Background Carousel Logic ----
  const backgroundCarouselContent = document.querySelector('.carousel-fundo');
  const backgroundPoligonosStart = document.querySelector('.fundo-poligonos-start');
  const backgroundPoligonosMain = document.querySelector('.fundo-poligonos-main');

  const backgroundContentWidth = backgroundPoligonosStart.offsetWidth; // Width of one background element
  const numberOfClones = 4; // Set the number of clones (4 pairs in total)

  // Append the necessary number of background elements (each element is added twice: start and main)
  for (let i = 0; i < numberOfClones; i++) {
    const backgroundCloneStart = backgroundPoligonosStart.cloneNode(true);
    const backgroundCloneMain = backgroundPoligonosMain.cloneNode(true);

    // Append the clones side by side
    backgroundCarouselContent.appendChild(backgroundCloneStart);
    backgroundCarouselContent.appendChild(backgroundCloneMain);
  }

  // Recalculate total width after clones are appended
  const backgroundTotalWidth = backgroundContentWidth * numberOfClones * 2; // Total width to cover the screen

  // Position the clones correctly by adjusting the left position
  const allBackgrounds = document.querySelectorAll('.fundo-poligonos');
  let leftPosition = 0;

  // Set the left positions of all the background elements
  allBackgrounds.forEach((background) => {
    background.style.left = `${leftPosition}px`;
    leftPosition += backgroundContentWidth; // Each background element moves by the full width of one element
  });

  let backgroundCurrentPosition = 0;
  const backgroundScrollSpeed = 0.5; // Adjust scroll speed here

  // Function to animate the scroll
  function animateBackgroundScroll() {
    backgroundCurrentPosition -= backgroundScrollSpeed;

    // Reset position when the last clone has left the screen (when its left reaches 100% position)
    if (Math.abs(backgroundCurrentPosition) >= backgroundTotalWidth) {
      backgroundCurrentPosition = 0; // Reset position for continuous loop
    }

    backgroundCarouselContent.style.transform = `translateX(${backgroundCurrentPosition}px)`;
    requestAnimationFrame(animateBackgroundScroll);
  }

  // Start the animation
  requestAnimationFrame(animateBackgroundScroll);
});


