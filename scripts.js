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
      // Ensure the underline remains active after scrolling
      if (target === document.body.scrollHeight) {
        document.getElementById("contactUnderline").classList.add("active");
      }
      isScrolling = false;
    }
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  isScrolling = true;
  requestAnimationFrame(animation);
}

// Initial state: WORK is active
document.getElementById("workUnderline").classList.add("active");

// Click event for CONTACT
document.getElementById("contactLink").addEventListener("click", function() {
  document.getElementById("contactUnderline").classList.add("active");
  document.getElementById("workUnderline").classList.remove("active");
  smoothScrollTo(document.body.scrollHeight, 1000); // Smooth scroll to footer over 1 second
});

// Click event for ABOUT (simple navigation)
document.getElementById("aboutLink").addEventListener("click", function() {
  // Navigate to another page (replace 'about.html' with your actual page)
  window.location.href = 'about.html';
});

// Click event for WORK
document.getElementById("workLink").addEventListener("click", function(event) {
  if (window.scrollY === 0) {
    event.preventDefault(); // Prevents scrolling to the top if already at the top
  } else {
    smoothScrollTo(0, 500); // Smooth scroll to top over 0.5 seconds
  }
  // Ensure WORK underline remains active
  document.getElementById("workUnderline").classList.add("active");
  document.getElementById("contactUnderline").classList.remove("active");
});

// Scroll event to detect when at the bottom of the page and when scrolling back up
window.addEventListener("scroll", function() {
  if (!isScrolling) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      document.getElementById("contactUnderline").classList.add("active");
      document.getElementById("workUnderline").classList.remove("active");
    } else {
      document.getElementById("contactUnderline").classList.remove("active");
    }
    // Ensure WORK underline remains active
    document.getElementById("workUnderline").classList.add("active");
  }
});

  