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

const descriptionContainer = document.querySelector('.description-container');
const holdDescription = document.querySelector('.hold-description');

const containerHeight = holdDescription.offsetHeight;
const itemHeight = descriptionContainer.firstElementChild.offsetHeight; // Assuming all items have the same height
const totalHeight = descriptionContainer.scrollHeight; // Total height of content in the container

// Duplicate the content to ensure a smooth infinite scroll
function duplicateContent() {
    const items = Array.from(descriptionContainer.children);
    items.forEach(item => {
        const clone = item.cloneNode(true);
        descriptionContainer.appendChild(clone);
    });
}

// Function to start the scrolling effect
function startScrolling() {
    let currentPosition = 100; // The initial position of the scroll

    // Use requestAnimationFrame for smooth animation
    function animateScroll() {
        currentPosition += 0.38; // Move scroll position by 1px per frame

        if (currentPosition >= totalHeight) {
            // Reset scroll position when we reach the end of the content
            currentPosition = 0;
        }

        // Apply the new position using CSS transform
        descriptionContainer.style.transform = `translateY(-${currentPosition}px)`;

        // Continue the animation
        requestAnimationFrame(animateScroll);
    }

    // Start the animation loop
    requestAnimationFrame(animateScroll);
}

// Wait for the DOM to load, then start the scrolling effect
document.addEventListener('DOMContentLoaded', () => {
    duplicateContent(); // Duplicate the content for infinite scroll
    startScrolling();   // Start the animation
});
