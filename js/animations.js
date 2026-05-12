/* =============================================
   animations.js — Scroll Reveals, Tilt, Terminal
   SRS Section 4.6, 4.7, 4.8
   ============================================= */

/* =============================================
   Scroll Reveal (4.6)
   IntersectionObserver adds .visible class
   ============================================= */
function initRevealAnimations() {
  var reveals = document.querySelectorAll(".reveal:not(.visible)");
  if (!reveals.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  reveals.forEach(function (el) { observer.observe(el); });
}

/* =============================================
   3D Tilt Effect (4.7)
   perspective + rotateX/Y on mousemove
   ============================================= */
function initTiltEffect() {
  document.addEventListener("mousemove", function (e) {
    var cards = document.querySelectorAll(".tilt-card");
    cards.forEach(function (card) {
      var rect = card.getBoundingClientRect();
      var inCard = (
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom
      );
      if (inCard) {
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        var rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 8;
        var rotateX = ((centerY - e.clientY) / (rect.height / 2)) * 8;
        card.style.transform = "perspective(1000px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateZ(5px)";
      }
    });
  });

  document.addEventListener("mouseleave", function (e) {
    if (e.target.classList && e.target.classList.contains("tilt-card")) {
      e.target.style.transform = "";
    }
  }, true);

  // Reset on mouse leave from each card
  document.addEventListener("mouseout", function (e) {
    var card = e.target.closest ? e.target.closest(".tilt-card") : null;
    if (card && !card.contains(e.relatedTarget)) {
      card.style.transform = "";
    }
  });
}

/* =============================================
   Terminal Typewriter (4.8)
   Types commands and shows output
   ============================================= */
var terminalIndex = 0;
var terminalTimer = null;

function initTerminal() {
  typeNextCommand();
}

function typeNextCommand() {
  var cmd = TERMINAL_COMMANDS[terminalIndex % TERMINAL_COMMANDS.length];
  var cmdEl = document.getElementById("typed-cmd");
  var outputEl = document.getElementById("terminal-output");
  if (!cmdEl || !outputEl) return;

  cmdEl.textContent = "";
  outputEl.innerHTML = "";
  var i = 0;

  // Typewriter effect
  function typeChar() {
    if (i < cmd.cmd.length) {
      cmdEl.textContent += cmd.cmd[i];
      i++;
      terminalTimer = setTimeout(typeChar, 40 + Math.random() * 30);
    } else {
      // Show output lines with stagger
      showOutputLines(cmd.output, 0);
    }
  }

  function showOutputLines(lines, idx) {
    if (idx >= lines.length) {
      // Wait then type next command
      terminalTimer = setTimeout(function () {
        terminalIndex++;
        typeNextCommand();
      }, 3000);
      return;
    }
    var outputEl = document.getElementById("terminal-output");
    var line = document.createElement("div");
    line.className = "t-line";
    line.textContent = lines[idx];
    line.style.animationDelay = (idx * 0.1) + "s";
    outputEl.appendChild(line);
    terminalTimer = setTimeout(function () {
      showOutputLines(lines, idx + 1);
    }, 200);
  }

  typeChar();
}

/* =============================================
   Navbar scroll behavior (4.9)
   ============================================= */
function initNavbarScroll() {
  var navbar = document.getElementById("navbar");
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-link");

  // Scroll shrink
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Active link tracking via IntersectionObserver
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) { link.classList.remove("active"); });
        var activeLink = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
        if (activeLink) activeLink.classList.add("active");
      }
    });
  }, { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" });

  sections.forEach(function (sec) { observer.observe(sec); });
}

/* =============================================
   Hamburger menu
   ============================================= */
function initHamburger() {
  var btn = document.getElementById("hamburger");
  var menu = document.getElementById("mobile-menu");
  if (!btn || !menu) return;

  btn.addEventListener("click", function () {
    btn.classList.toggle("active");
    menu.classList.toggle("open");
    var expanded = btn.classList.contains("active");
    btn.setAttribute("aria-expanded", expanded);
    menu.setAttribute("aria-hidden", !expanded);
  });

  // Close menu on link click
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      btn.classList.remove("active");
      menu.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
    });
  });
}

/* =============================================
   Init all animations
   ============================================= */
function initAnimations() {
  initRevealAnimations();
  initTiltEffect();
  initTerminal();
  initNavbarScroll();
  initHamburger();
}
