// Header animations and controls

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

document.getElementById("workUnderline").classList.add("active");

document.getElementById("contactLink").addEventListener("click", function () {
  document.getElementById("contactUnderline").classList.add("active");
  smoothScrollTo(document.body.scrollHeight, 1000);
});

document.getElementById("aboutLink").addEventListener("click", function () {
  window.location.href = "about.html";
});

document.getElementById("workLink").addEventListener("click", function (event) {
  if (window.scrollY === 0) {
    event.preventDefault();
  } else {
    smoothScrollTo(0, 500);
  }
  document.getElementById("workUnderline").classList.add("active");
  document.getElementById("contactUnderline").classList.remove("active");
});

window.addEventListener("scroll", function () {
  if (!isScrolling) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      document.getElementById("contactUnderline").classList.add("active");
    } else {
      document.getElementById("contactUnderline").classList.remove("active");
    }
    document.getElementById("workUnderline").classList.add("active");
  }
});

const logo = document.querySelector(".logo");

logo.addEventListener("click", function (event) {
  event.preventDefault();
  logo.style.transition = "transform 0.2s ease";
  logo.style.transform = "scale(1.2)";

  setTimeout(() => {
    logo.style.transform = "scale(1)";
    window.location.href = "index.html";
  }, 200);
});

function animateAndNavigate(element, targetUrl) {
  element.addEventListener("click", function (event) {
    event.preventDefault();
    element.style.transition = "transform 0.2s ease";
    element.style.transform = "scale(1.2)";

    setTimeout(() => {
      element.style.transform = "scale(1)";
      window.location.href = targetUrl;
    }, 200);
  });
}

animateAndNavigate(document.getElementById("workLink"), "#work");
animateAndNavigate(document.getElementById("aboutLink"), "about.html");
animateAndNavigate(document.getElementById("contactLink"), "#contact");
