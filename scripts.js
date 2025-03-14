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

  function scrollUp() {
    scrollPosition -= 1;
    if (scrollPosition <= -contentHeight) {
      scrollPosition = 0;
    }
    fundoPoligonos.style.transform = `translateY(${scrollPosition}px)`;
    clone.style.transform = `translateY(${scrollPosition + contentHeight}px)`;
    requestAnimationFrame(scrollUp);
  }

  scrollUp();
});