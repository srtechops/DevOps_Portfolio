/* =============================================
   render.js — DOM Rendering (SRS Section 3)
   Dynamically renders all sections from data
   ============================================= */

/** Master render — calls all section renderers */
function renderAll(data) {
  renderProfile(data.profile);
  renderSkills(data.skills);
  renderProjects(data.projects);
  renderExperience(data.experience);
  renderContact(data.profile);
  renderResume(data.profile.resumeUrl);
  renderFooter(data.profile);
}

/* =============================================
   Profile / Hero / About (PR-01..PR-10)
   ============================================= */
function renderProfile(p) {
  setText("hero-name", p.name, "name");
  setText("hero-title-text", p.title, "title");
  setText("hero-intro", p.intro, "intro");
  setText("hero-badge-text", p.badgeText, "badgeText");
  setText("about-text", p.about, "about");
  setText("info-location", p.location, "location");
  setText("info-email", p.email, "email");
  setText("info-status", p.status, "status");
  setText("info-education", p.education, "education");
  setText("stat-exp", p.stats.experience, "stats.experience");
  setText("stat-projects", p.stats.projects, "stats.projects");
  setText("stat-certs", p.stats.certs, "stats.certs");
  setText("nav-logo-name", p.name.split(" ")[0], null);

  // About tags
  var tagsEl = document.getElementById("about-tags");
  if (tagsEl) {
    tagsEl.innerHTML = "";
    var aboutTags = ["Cloud Infrastructure", "CI/CD", "Containerization", "IaC", "Monitoring", "Automation"];
    aboutTags.forEach(function (t) {
      var span = document.createElement("span");
      span.className = "about-tag";
      span.textContent = t;
      tagsEl.appendChild(span);
    });
  }
}

/** Helper: set text content with optional data-editable attribute */
function setText(id, value, editableKey) {
  var el = document.getElementById(id);
  if (!el) return;
  el.textContent = value || "";
  if (editableKey) el.setAttribute("data-editable", editableKey);
}

/* =============================================
   Skills (SK-04..SK-08)
   ============================================= */
function renderSkills(skills, filterCat) {
  // Filter buttons (SK-05..SK-07)
  var filterContainer = document.getElementById("skills-filter");
  if (filterContainer && !filterContainer.hasChildNodes()) {
    SKILL_CATEGORIES.forEach(function (cat) {
      var btn = document.createElement("button");
      btn.className = "filter-btn" + (cat === "All" ? " active" : "");
      btn.textContent = cat;
      btn.addEventListener("click", function () {
        filterContainer.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var data = loadData();
        renderSkillCards(data.skills, cat === "All" ? null : cat);
      });
      filterContainer.appendChild(btn);
    });
  }
  renderSkillCards(skills, filterCat);
}

function renderSkillCards(skills, filterCat) {
  var grid = document.getElementById("skills-grid");
  if (!grid) return;
  grid.innerHTML = "";

  var filtered = filterCat ? skills.filter(function (s) { return s.category === filterCat; }) : skills;

  filtered.forEach(function (skill, i) {
    var card = document.createElement("div");
    card.className = "skill-card glass-card tilt-card reveal visible";
    card.style.transitionDelay = (i * 0.05) + "s";
    card.innerHTML =
      '<div class="item-actions" style="display:none">' +
        '<button class="btn btn-sm" onclick="openEditModal(\'skill\',\'' + skill.id + '\')">✏️</button>' +
        '<button class="btn btn-sm btn-danger" onclick="deleteItem(\'skill\',\'' + skill.id + '\')">🗑️</button>' +
      '</div>' +
      '<div class="skill-header"><span class="skill-name">' + escHtml(skill.name) + '</span><span class="skill-pct">' + skill.proficiency + '%</span></div>' +
      '<div class="skill-category">' + escHtml(skill.category) + '</div>' +
      '<div class="progress-track"><div class="progress-bar" data-width="' + skill.proficiency + '"></div></div>';
    grid.appendChild(card);
  });

  // Show action buttons if in edit mode
  if (editMode) {
    grid.querySelectorAll(".item-actions").forEach(function (b) { b.style.display = "flex"; });
  }
  // Animate progress bars
  requestAnimationFrame(function () {
    grid.querySelectorAll(".progress-bar").forEach(function (bar) {
      bar.style.width = bar.getAttribute("data-width") + "%";
    });
  });
}

/* =============================================
   Projects (PJ-04..PJ-08)
   ============================================= */
function renderProjects(projects) {
  var grid = document.getElementById("projects-grid");
  if (!grid) return;
  grid.innerHTML = "";

  projects.forEach(function (proj, i) {
    var card = document.createElement("div");
    card.className = "project-card glass-card tilt-card reveal visible";
    card.style.transitionDelay = (i * 0.1) + "s";

    var tagsHtml = (proj.tags || []).map(function (t) {
      return '<span class="tag">' + escHtml(t) + '</span>';
    }).join("");

    card.innerHTML =
      '<div class="item-actions" style="display:none">' +
        '<button class="btn btn-sm" onclick="openEditModal(\'project\',\'' + proj.id + '\')">✏️</button>' +
        '<button class="btn btn-sm btn-danger" onclick="deleteItem(\'project\',\'' + proj.id + '\')">🗑️</button>' +
      '</div>' +
      '<img class="project-image" src="' + escAttr(proj.image) + '" alt="' + escAttr(proj.title) + '" loading="lazy" onerror="this.style.display=\'none\'" />' +
      '<div class="project-body">' +
        '<h3 class="project-title">' + escHtml(proj.title) + '</h3>' +
        '<p class="project-desc">' + escHtml(proj.description) + '</p>' +
        '<div class="project-tags">' + tagsHtml + '</div>' +
        '<a href="' + escAttr(proj.link) + '" target="_blank" rel="noopener noreferrer" class="btn btn-glass btn-sm project-link">View Project →</a>' +
      '</div>';
    grid.appendChild(card);
  });

  if (editMode) {
    grid.querySelectorAll(".item-actions").forEach(function (b) { b.style.display = "flex"; });
  }
}

/* =============================================
   Experience Timeline (EX-03..EX-06)
   ============================================= */
function renderExperience(experience) {
  var timeline = document.getElementById("experience-timeline");
  if (!timeline) return;
  timeline.innerHTML = "";

  experience.forEach(function (exp, i) {
    var item = document.createElement("div");
    item.className = "timeline-item reveal visible";
    item.style.transitionDelay = (i * 0.15) + "s";

    var tagsHtml = (exp.tags || []).map(function (t) {
      return '<span class="tag">' + escHtml(t) + '</span>';
    }).join("");

    item.innerHTML =
      '<div class="timeline-dot"></div>' +
      '<div class="timeline-card glass-card">' +
        '<div class="item-actions" style="display:none">' +
          '<button class="btn btn-sm" onclick="openEditModal(\'experience\',\'' + exp.id + '\')">✏️</button>' +
          '<button class="btn btn-sm btn-danger" onclick="deleteItem(\'experience\',\'' + exp.id + '\')">🗑️</button>' +
        '</div>' +
        '<span class="timeline-date">' + escHtml(exp.startDate) + ' — ' + escHtml(exp.endDate) + '</span>' +
        '<h3 class="timeline-role">' + escHtml(exp.role) + '</h3>' +
        '<p class="timeline-company">' + escHtml(exp.company) + '</p>' +
        '<p class="timeline-desc">' + escHtml(exp.description) + '</p>' +
        '<div class="timeline-tags">' + tagsHtml + '</div>' +
      '</div>';
    timeline.appendChild(item);
  });

  if (editMode) {
    timeline.querySelectorAll(".item-actions").forEach(function (b) { b.style.display = "flex"; });
  }
}

/* =============================================
   Contact (CT-01..CT-03)
   ============================================= */
function renderContact(profile) {
  setText("contact-desc", profile.contactDesc, "contactDesc");

  var emailBtn = document.getElementById("contact-email-btn");
  if (emailBtn) emailBtn.href = "mailto:" + (profile.email || "");

  // Social links
  var container = document.getElementById("social-links");
  if (container) {
    container.innerHTML = "";
    var socials = [
      { key: "github", icon: "GH", label: "GitHub" },
      { key: "linkedin", icon: "in", label: "LinkedIn" },
      { key: "twitter", icon: "𝕏", label: "Twitter" }
    ];
    socials.forEach(function (s) {
      if (!profile.social || !profile.social[s.key]) return;
      var a = document.createElement("a");
      a.href = profile.social[s.key];
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "social-btn";
      a.setAttribute("aria-label", s.label);
      a.textContent = s.icon;
      container.appendChild(a);
    });
  }
}

/* =============================================
   Resume buttons (RS-05..RS-07)
   ============================================= */
function renderResume(rawUrl) {
  var url = convertResumeUrl(rawUrl);
  var btns = ["navbar-resume-btn", "hero-resume-btn", "mobile-resume-btn"];
  btns.forEach(function (id) {
    var btn = document.getElementById(id);
    if (!btn) return;
    if (url) {
      btn.href = url;
      btn.style.display = "";
    } else {
      btn.style.display = "none";
    }
  });
}

/* =============================================
   Footer (social links)
   ============================================= */
function renderFooter(profile) {
  var container = document.getElementById("footer-social");
  if (!container) return;
  container.innerHTML = "";
  var socials = [
    { key: "github", icon: "GH" },
    { key: "linkedin", icon: "in" },
    { key: "twitter", icon: "𝕏" }
  ];
  socials.forEach(function (s) {
    if (!profile.social || !profile.social[s.key]) return;
    var a = document.createElement("a");
    a.href = profile.social[s.key];
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "social-btn";
    a.textContent = s.icon;
    container.appendChild(a);
  });
}

/* =============================================
   Sanitization helpers
   ============================================= */
function escHtml(str) {
  var d = document.createElement("div");
  d.textContent = str || "";
  return d.innerHTML;
}
function escAttr(str) {
  return (str || "").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
