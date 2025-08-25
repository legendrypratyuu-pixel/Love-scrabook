// script.js

// Simple welcome popup
window.addEventListener("load", () => {
  alert("💖 Welcome to our Love Scrapbook 💖");
});

// Example: Slideshow for memories
let slideIndex = 0;
function showSlides() {
  let slides = document.querySelectorAll(".slide");
  slides.forEach((s, i) => {
    s.style.display = (i === slideIndex) ? "block" : "none";
  });
  slideIndex = (slideIndex + 1) % slides.length;
  setTimeout(showSlides, 3000); // change every 3 seconds
}

// Start slideshow if slides exist
if (document.querySelectorAll(".slide").length > 0) {
  showSlides();
}
