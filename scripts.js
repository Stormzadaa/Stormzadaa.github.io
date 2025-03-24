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
 
     window.scrollTo({
       top: document.body.scrollHeight,
       behavior: 'smooth'
     });
   });

   window.addEventListener('scroll', () => {
     if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
       contactUnderline.classList.add('active');
     } else {
       contactUnderline.classList.remove('active');
     }
   });
});

