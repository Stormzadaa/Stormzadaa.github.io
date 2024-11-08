//Header animations and controls 

let isScrolling = false;

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
      // Ensure the contact underline remains active after scrolling
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

// Initial state: WORK is always active
document.getElementById("workUnderline").classList.add("active");

// Click event for CONTACT
document.getElementById("contactLink").addEventListener("click", function () {
  document.getElementById("contactUnderline").classList.add("active");
  smoothScrollTo(document.body.scrollHeight, 1000); // Smooth scroll to footer over 1 second
});

// Click event for ABOUT (simple navigation)
document.getElementById("aboutLink").addEventListener("click", function () {
  window.location.href = "about.html";
});

// Click event for WORK
document.getElementById("workLink").addEventListener("click", function (event) {
  if (window.scrollY === 0) {
    event.preventDefault(); // Prevents scrolling to the top if already at the top
  } else {
    smoothScrollTo(0, 500); // Smooth scroll to top over 0.5 seconds
  }
  document.getElementById("workUnderline").classList.add("active");
  document.getElementById("contactUnderline").classList.remove("active");
});

// Scroll event to detect when at the bottom of the page and when scrolling back up
window.addEventListener("scroll", function () {
  if (!isScrolling) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      // Keep both WORK and CONTACT underlined at the bottom
      document.getElementById("contactUnderline").classList.add("active");
    } else {
      document.getElementById("contactUnderline").classList.remove("active");
    }
    // Ensure WORK underline is always active
    document.getElementById("workUnderline").classList.add("active");
  }
});

// Select the logo element
const logo = document.querySelector(".logo");

// Add click event listener to the logo
logo.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent immediate navigation to allow animation

  // Add a larger scale animation on click
  logo.style.transition = "transform 0.2s ease";
  logo.style.transform = "scale(1.2)";

  // Return to normal size after animation, then navigate to the index page
  setTimeout(() => {
    logo.style.transform = "scale(1)";
    window.location.href = "index.html";
  }, 200); // Adjust timing to match the transform duration
});
  
// Function to add click animation and navigate to a target
function animateAndNavigate(element, targetUrl) {
  element.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent immediate navigation to allow animation

    // Add a larger scale animation on click
    element.style.transition = "transform 0.2s ease";
    element.style.transform = "scale(1.2)";

    // Return to normal size after animation, then navigate to target page
    setTimeout(() => {
      element.style.transform = "scale(1)";
      window.location.href = targetUrl;
    }, 200); // Adjust timing to match the transform duration
  });
}

// Apply the animation and navigation to each link
animateAndNavigate(document.getElementById("workLink"), "#work");
animateAndNavigate(document.getElementById("aboutLink"), "about.html");
animateAndNavigate(document.getElementById("contactLink"), "#contact");

// MAIN BODY ANIMATIONS


