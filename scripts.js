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
  element.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent immediate navigation
    element.style.transition = "transform 0.2s ease";
    element.style.transform = "scale(1.2)"; // Animate scale on click

    setTimeout(() => {
      element.style.transform = "scale(1)"; // Reset scale after animation
      window.location.href = targetUrl; // Navigate to target URL
    }, 200);
  });
}

// Apply animation and navigation to each link
animateAndNavigate(document.getElementById("workLink"), "#work");
animateAndNavigate(document.getElementById("aboutLink"), "about.html");
animateAndNavigate(document.getElementById("contactLink"), "#contact");
