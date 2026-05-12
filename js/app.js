/* =============================================
   app.js — Application Entry Point
   Wires all modules together
   ============================================= */

document.addEventListener("DOMContentLoaded", function () {
  // 1. Load data from localStorage or defaults
  var data = loadData();

  // 2. Render all sections
  renderAll(data);

  // 3. Initialize admin system
  initAdmin();

  // 4. Initialize animations
  initAnimations();

  // 5. Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});
