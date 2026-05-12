/* =============================================
   admin.js — Admin System (SRS Section 5)
   Login, session, edit mode, localStorage CRUD
   ============================================= */

/* --- Hardcoded credentials (AD-06) --- */
const ADMIN_USER = "admin";
const ADMIN_PASS = "portfolio2025";

/* --- Session keys --- */
const SESSION_KEY = "portfolio_admin_session";
const LS_KEYS = {
  profile: "portfolio_profile",
  skills: "portfolio_skills",
  projects: "portfolio_projects",
  experience: "portfolio_experience"
};

/* --- State --- */
let isAdmin = false;
let editMode = false;

/* =============================================
   localStorage helpers (AD-22, Section 5.5)
   ============================================= */

/** Load data from localStorage or fall back to defaults */
function loadData() {
  const profile = localStorage.getItem(LS_KEYS.profile);
  const skills = localStorage.getItem(LS_KEYS.skills);
  const projects = localStorage.getItem(LS_KEYS.projects);
  const experience = localStorage.getItem(LS_KEYS.experience);
  return {
    profile: profile ? JSON.parse(profile) : { ...DEFAULT_PROFILE },
    skills: skills ? JSON.parse(skills) : [...DEFAULT_SKILLS],
    projects: projects ? JSON.parse(projects) : [...DEFAULT_PROJECTS],
    experience: experience ? JSON.parse(experience) : [...DEFAULT_EXPERIENCE]
  };
}

/** Save specific section to localStorage */
function saveData(key, data) {
  localStorage.setItem(LS_KEYS[key], JSON.stringify(data));
}

/** Save all data */
function saveAllData(data) {
  saveData("profile", data.profile);
  saveData("skills", data.skills);
  saveData("projects", data.projects);
  saveData("experience", data.experience);
}

/* =============================================
   Resume URL converter (SRS Section 6, RS-02..RS-08)
   ============================================= */
function convertResumeUrl(url) {
  if (!url) return "";
  // Match Google Drive share link and convert to preview
  const regex = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  if (match) {
    return "https://drive.google.com/file/d/" + match[1] + "/preview";
  }
  return url; // Already a direct/preview link
}

/* =============================================
   Toast notification
   ============================================= */
function showToast(message, type) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast show " + (type || "success");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function () {
    toast.className = "toast";
  }, 2500);
}

/* =============================================
   Login system (AD-04..AD-10)
   ============================================= */

/** Open login modal on double-click (AD-02) */
function openLoginModal() {
  document.getElementById("login-modal").style.display = "flex";
  document.getElementById("login-user").value = "";
  document.getElementById("login-pass").value = "";
  document.getElementById("login-error").textContent = "";
  document.getElementById("login-user").focus();
}

/** Close login modal (AD-09) */
function closeLoginModal() {
  document.getElementById("login-modal").style.display = "none";
}

/** Handle login form submission (AD-06..AD-08) */
function handleLogin(e) {
  e.preventDefault();
  var user = document.getElementById("login-user").value.trim();
  var pass = document.getElementById("login-pass").value;
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    sessionStorage.setItem(SESSION_KEY, "true");
    isAdmin = true;
    closeLoginModal();
    showAdminToolbar();
    showToast("Logged in as Admin", "success");
  } else {
    document.getElementById("login-error").textContent = "Invalid credentials";
  }
}

/** Show admin toolbar (AD-11..AD-12) */
function showAdminToolbar() {
  document.getElementById("admin-toolbar").style.display = "block";
}

/** Hide admin toolbar */
function hideAdminToolbar() {
  document.getElementById("admin-toolbar").style.display = "none";
}

/** Logout (AD-13) */
function handleLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  isAdmin = false;
  if (editMode) toggleEditMode(false);
  hideAdminToolbar();
  showToast("Logged out", "success");
}

/** Check session on page load (AD-10) */
function checkSession() {
  if (sessionStorage.getItem(SESSION_KEY) === "true") {
    isAdmin = true;
    showAdminToolbar();
  }
}

/* =============================================
   Edit Mode (AD-14..AD-23)
   ============================================= */

/** Toggle edit mode on/off */
function toggleEditMode(on) {
  editMode = typeof on === "boolean" ? on : !editMode;
  document.getElementById("edit-mode-toggle").checked = editMode;
  document.body.classList.toggle("edit-mode", editMode);

  // Show/hide add buttons (AD-20)
  var addRows = document.querySelectorAll(".admin-add-row");
  addRows.forEach(function (r) { r.style.display = editMode ? "block" : "none"; });

  // Show/hide item action buttons (AD-16)
  var actionBtns = document.querySelectorAll(".item-actions");
  actionBtns.forEach(function (b) { b.style.display = editMode ? "flex" : "none"; });

  // Toggle inline editable fields (AD-15)
  toggleInlineEditing(editMode);
}

/** Make profile text fields inline-editable (AD-15) */
function toggleInlineEditing(on) {
  var editables = document.querySelectorAll("[data-editable]");
  editables.forEach(function (el) {
    if (on) {
      el.setAttribute("contenteditable", "true");
      el.classList.add("editable-field");
    } else {
      el.removeAttribute("contenteditable");
      el.classList.remove("editable-field");
    }
  });
}

/** Save inline-edited profile field on blur */
function handleInlineEdit(e) {
  if (!editMode) return;
  var field = e.target.getAttribute("data-editable");
  if (!field) return;
  var data = loadData();
  var value = e.target.textContent.trim();
  // Handle nested fields like stats.experience
  if (field.indexOf(".") > -1) {
    var parts = field.split(".");
    data.profile[parts[0]][parts[1]] = value;
  } else {
    data.profile[field] = value;
  }
  saveData("profile", data.profile);
  showToast("Saved", "success");
}

/* =============================================
   Edit Modal system (AD-17..AD-21)
   ============================================= */

let currentEditType = null;  // "skill" | "project" | "experience"
let currentEditId = null;    // null = new item

/** Open the edit modal for a specific item type */
function openEditModal(type, id) {
  currentEditType = type;
  currentEditId = id || null;
  var data = loadData();
  var title = (id ? "Edit " : "Add ") + capitalize(type);
  document.getElementById("edit-modal-title").textContent = title;

  var fieldsContainer = document.getElementById("edit-fields");
  fieldsContainer.innerHTML = "";
  var itemData = null;

  if (id) {
    var list = data[type + "s"] || data[type];
    if (Array.isArray(list)) {
      itemData = list.find(function (i) { return i.id === id; });
    }
  }

  // Build form fields based on type (AD-18)
  var fields = getFieldsForType(type);
  fields.forEach(function (f) {
    var group = document.createElement("div");
    group.className = "field-group";
    var label = document.createElement("label");
    label.setAttribute("for", "edit-" + f.key);
    label.textContent = f.label;
    group.appendChild(label);

    var input;
    if (f.type === "textarea") {
      input = document.createElement("textarea");
    } else if (f.type === "select") {
      input = document.createElement("select");
      f.options.forEach(function (opt) {
        var o = document.createElement("option");
        o.value = opt; o.textContent = opt;
        input.appendChild(o);
      });
    } else {
      input = document.createElement("input");
      input.type = f.type || "text";
    }
    input.id = "edit-" + f.key;
    input.name = f.key;
    input.placeholder = f.placeholder || "";
    if (itemData) {
      var val = itemData[f.key];
      if (Array.isArray(val)) val = val.join(", ");
      input.value = val || "";
    }
    group.appendChild(input);
    fieldsContainer.appendChild(group);
  });

  document.getElementById("edit-modal").style.display = "flex";
  fieldsContainer.querySelector("input, textarea, select").focus();
}

/** Close edit modal */
function closeEditModal() {
  document.getElementById("edit-modal").style.display = "none";
  currentEditType = null;
  currentEditId = null;
}

/** Handle edit form save (AD-22) */
function handleEditSave(e) {
  e.preventDefault();
  var data = loadData();
  var fields = getFieldsForType(currentEditType);
  var item = {};

  fields.forEach(function (f) {
    var val = document.getElementById("edit-" + f.key).value.trim();
    if (f.key === "tags") {
      item[f.key] = val.split(",").map(function (t) { return t.trim(); }).filter(Boolean);
    } else if (f.key === "proficiency") {
      item[f.key] = parseInt(val, 10) || 0;
    } else {
      item[f.key] = val;
    }
  });

  var listKey = currentEditType + "s";

  if (currentEditId) {
    // Update existing item
    item.id = currentEditId;
    var idx = data[listKey].findIndex(function (i) { return i.id === currentEditId; });
    if (idx > -1) data[listKey][idx] = item;
  } else {
    // Create new item with unique ID
    item.id = currentEditType.substring(0, 2) + "-" + Date.now();
    data[listKey].push(item);
  }

  saveData(listKey.replace("skills", "skill").replace("projects", "project").replace("experiences", "experience"), data[listKey]);
  // Fix key mapping
  localStorage.setItem(LS_KEYS[listKey.replace("s", "").replace("skill", "skills").replace("project", "projects").replace("experience", "experiences")], "");
  // Simpler approach: just save directly
  localStorage.setItem(LS_KEYS.skills, JSON.stringify(data.skills));
  localStorage.setItem(LS_KEYS.projects, JSON.stringify(data.projects));
  localStorage.setItem(LS_KEYS.experience, JSON.stringify(data.experience));

  closeEditModal();
  renderAll(data);
  if (editMode) toggleEditMode(true); // Re-apply edit mode visuals
  showToast(currentEditId ? "Updated" : "Added", "success");
}

/** Delete an item (AD-19) */
function deleteItem(type, id) {
  if (!confirm("Are you sure you want to delete this item?")) return;
  var data = loadData();
  var listKey = type + "s";
  data[listKey] = data[listKey].filter(function (i) { return i.id !== id; });

  localStorage.setItem(LS_KEYS.skills, JSON.stringify(data.skills));
  localStorage.setItem(LS_KEYS.projects, JSON.stringify(data.projects));
  localStorage.setItem(LS_KEYS.experience, JSON.stringify(data.experience));

  renderAll(data);
  if (editMode) toggleEditMode(true);
  showToast("Deleted", "success");
}

/* =============================================
   Field definitions per type
   ============================================= */
function getFieldsForType(type) {
  if (type === "skill") {
    return [
      { key: "name", label: "Skill Name", placeholder: "e.g. Kubernetes" },
      { key: "category", label: "Category", type: "select", options: SKILL_CATEGORIES.slice(1) },
      { key: "proficiency", label: "Proficiency (1-100)", type: "number", placeholder: "85" }
    ];
  }
  if (type === "project") {
    return [
      { key: "title", label: "Title", placeholder: "Project name" },
      { key: "description", label: "Description", type: "textarea", placeholder: "Describe the project..." },
      { key: "link", label: "Link URL", placeholder: "https://github.com/..." },
      { key: "image", label: "Image URL", placeholder: "https://images.unsplash.com/..." },
      { key: "tags", label: "Tags (comma separated)", placeholder: "Docker, AWS, Terraform" }
    ];
  }
  if (type === "experience") {
    return [
      { key: "role", label: "Role / Title", placeholder: "Senior DevOps Engineer" },
      { key: "company", label: "Company", placeholder: "Tech Corp" },
      { key: "startDate", label: "Start Date", placeholder: "Jan 2023" },
      { key: "endDate", label: "End Date", placeholder: "Present" },
      { key: "description", label: "Description", type: "textarea", placeholder: "Describe responsibilities..." },
      { key: "tags", label: "Technologies (comma separated)", placeholder: "AWS, Docker, Jenkins" }
    ];
  }
  return [];
}

/** Capitalize first letter */
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* =============================================
   Init admin event listeners
   ============================================= */
function initAdmin() {
  // Login form (AD-04..AD-08)
  document.getElementById("login-form").addEventListener("submit", handleLogin);
  document.getElementById("login-close").addEventListener("click", closeLoginModal);
  document.getElementById("login-modal").addEventListener("click", function (e) {
    if (e.target === this) closeLoginModal();
  });

  // Edit modal
  document.getElementById("edit-form").addEventListener("submit", handleEditSave);
  document.getElementById("edit-close").addEventListener("click", closeEditModal);
  document.getElementById("edit-cancel").addEventListener("click", closeEditModal);
  document.getElementById("edit-modal").addEventListener("click", function (e) {
    if (e.target === this) closeEditModal();
  });

  // Toolbar controls (AD-11..AD-13)
  document.getElementById("edit-mode-toggle").addEventListener("change", function () {
    toggleEditMode(this.checked);
  });
  document.getElementById("admin-logout").addEventListener("click", handleLogout);

  // Add buttons (AD-20..AD-21)
  document.getElementById("add-skill-btn").addEventListener("click", function () { openEditModal("skill"); });
  document.getElementById("add-project-btn").addEventListener("click", function () { openEditModal("project"); });
  document.getElementById("add-experience-btn").addEventListener("click", function () { openEditModal("experience"); });

  // Inline editing — save on blur (AD-15)
  document.addEventListener("blur", function (e) {
    if (e.target.hasAttribute && e.target.hasAttribute("data-editable")) {
      handleInlineEdit(e);
    }
  }, true);

  // Check existing session (AD-10)
  checkSession();
}
