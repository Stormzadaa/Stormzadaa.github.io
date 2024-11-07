// Initial state: WORK is active
document.getElementById("workUnderline").classList.add("active");

// Click event for CONTACT
document.getElementById("contactLink").addEventListener("click", function() {
  document.getElementById("contactUnderline").classList.add("active");
  document.getElementById("workUnderline").classList.remove("active");
  document.getElementById("aboutUnderline").classList.remove("active");
  window.scrollTo(0, document.body.scrollHeight); // Scroll to footer
});

// Click event for ABOUT
document.getElementById("aboutLink").addEventListener("click", function() {
  document.getElementById("aboutUnderline").classList.add("active");
  document.getElementById("workUnderline").classList.remove("active");
  document.getElementById("contactUnderline").classList.remove("active");
  window.scrollTo(0, document.body.scrollHeight); // Scroll to footer
});

// Click event for WORK
document.getElementById("workLink").addEventListener("click", function() {
  document.getElementById("workUnderline").classList.add("active");
  document.getElementById("aboutUnderline").classList.remove("active");
  document.getElementById("contactUnderline").classList.remove("active");
});

// Scroll event to detect when at the bottom of the page
window.addEventListener("scroll", function() {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    document.getElementById("contactUnderline").classList.add("active");
    document.getElementById("workUnderline").classList.remove("active");
    document.getElementById("aboutUnderline").classList.remove("active");
  }
});
