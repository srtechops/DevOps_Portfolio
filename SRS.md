# Software Requirements Specification (SRS)
## Dynamic Single-Page Portfolio Application

---

> Document Status: Active — Implementation in progress.
> Version: 1.1 | Date: 2026-05-11 | Author: Portfolio Owner

---

## Table of Contents

1. Introduction
2. Overall Description
3. Functional Requirements
4. UI/UX Design Specifications
5. Admin System Requirements
6. Resume Feature Requirements
7. Non-Functional Requirements
8. File & Project Structure
9. Data Schema
10. Constraints & Assumptions
11. Docker & Containerization

---

## 1. Introduction

### 1.1 Purpose
This document defines the complete software requirements for a **dynamic, client-side-only single-page portfolio application**. It serves as the single source of truth for design, development, and review.

### 1.2 Scope
- A single HTML file with modular JS and CSS files
- No backend, server, or database — all data lives in `localStorage`
- A hidden admin system for live content editing
- Premium, production-quality visual design

### 1.3 Intended Audience
- Developer (implementor)
- Portfolio owner (content admin)
- Reviewers / interviewers viewing the portfolio

### 1.4 Definitions & Acronyms

| Term          | Definition                                                                 |
|---------------|----------------------------------------------------------------------------|
| SPA           | Single-Page Application                                                    |
| SRS           | Software Requirements Specification                                        |
| Admin         | Authenticated content editor (client-side only)                            |
| Edit Mode     | UI state where all content becomes editable inline                         |
| Glassmorphism | Design style using frosted-glass transparency + blur                       |
| localStorage  | Browser-native key-value storage (persistent, no expiry)                   |
| Tilt Effect   | CSS/JS-based 3D perspective rotation on mouse hover                        |
| Reveal Anim.  | Elements fade/slide into view when scrolled into viewport                  |

---

## 2. Overall Description

### 2.1 Product Perspective
A fully self-contained static website deployable to any static host (GitHub Pages, Netlify, Vercel, Apache, Nginx). All data is stored in the visitor's browser via `localStorage`. No API calls, authentication servers, or databases are needed.

### 2.2 Product Features (High-Level)

| #  | Feature                                                     |
|----|-------------------------------------------------------------|
| F1 | Dynamic content rendering from JS data objects              |
| F2 | Persistent storage via localStorage                         |
| F3 | Premium dark-mode UI with animations                        |
| F4 | Hidden client-side admin login system                       |
| F5 | Inline edit mode for all content sections                   |
| F6 | Resume Google Drive link converter                          |
| F7 | Fully responsive layout (mobile to desktop)                 |

### 2.3 User Classes

| User        | Description                                                       |
|-------------|-------------------------------------------------------------------|
| **Visitor** | Reads the portfolio, views projects, downloads resume             |
| **Admin**   | Logs in via hidden footer lock, edits all content live            |

### 2.4 Operating Environment
- Modern web browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- No Node.js or build tools required to run
- Static file serving (can open `index.html` directly)

---

## 3. Functional Requirements

### 3.1 Section — Profile

**Purpose:** Primary identity block rendered in the Hero and About sections.

| Req ID | Requirement                                                                      |
|--------|----------------------------------------------------------------------------------|
| PR-01  | Store and render: `name`, `title`, `intro`, `about`, `resumeUrl`                 |
| PR-02  | `name` renders in Hero `<h1>` with animated gradient text                        |
| PR-03  | `title` renders as hero subtitle (e.g., "DevOps Engineer")                       |
| PR-04  | `intro` renders as a short hero tagline paragraph                                |
| PR-05  | `about` renders as a longer About section paragraph                              |
| PR-06  | `resumeUrl` drives all "View Resume" buttons                                     |
| PR-07  | Additional profile meta: `location`, `email`, `status`, `education`, `badgeText` |
| PR-08  | Info cards in About section display location, email, status, education           |
| PR-09  | Hero stats block: years of experience, project count, certifications             |
| PR-10  | Social links (GitHub, LinkedIn, Twitter) stored and rendered in Contact + Footer |

---

### 3.2 Section — Skills

**Purpose:** Showcase technical competencies with category filtering and visual proficiency bars.

| Req ID | Requirement                                                                              |
|--------|------------------------------------------------------------------------------------------|
| SK-01  | Each skill object: `{ id, name, category, proficiency }`                                 |
| SK-02  | `proficiency` is an integer 1–100 (percentage)                                           |
| SK-03  | `category` is one of: Cloud, DevOps, Containers, Scripting, Monitoring, Other            |
| SK-04  | Render all skills as cards with an animated progress bar                                 |
| SK-05  | Render category filter buttons above the grid                                            |
| SK-06  | Clicking a filter shows only skills matching that category; "All" shows everything       |
| SK-07  | Active filter button is visually highlighted                                             |
| SK-08  | Progress bar animates (width: 0 to proficiency%) when scrolled into view                 |
| SK-09  | Admin: add new skill via modal form                                                      |
| SK-10  | Admin: edit existing skill via modal                                                     |
| SK-11  | Admin: delete skill with confirmation                                                    |

---

### 3.3 Section — Projects

**Purpose:** Showcase portfolio projects in an image-led card grid.

| Req ID | Requirement                                                                              |
|--------|------------------------------------------------------------------------------------------|
| PJ-01  | Each project object: `{ id, title, description, link, image, tags[] }`                  |
| PJ-02  | `image` is a URL string (external image or base64)                                       |
| PJ-03  | `tags` are an array of technology/tool labels rendered as badge chips                   |
| PJ-04  | Render projects in a responsive grid (1 col mobile, 2 col tablet, 3 col desktop)        |
| PJ-05  | Each project card: image, title, description, tags, "View Project" link button          |
| PJ-06  | "View Project" opens `link` in a new tab                                                 |
| PJ-07  | Cards have 3D tilt effect on hover                                                       |
| PJ-08  | Cards reveal with staggered animation on scroll                                          |
| PJ-09  | Admin: add project via modal (with image URL input)                                      |
| PJ-10  | Admin: edit project via modal                                                            |
| PJ-11  | Admin: delete project with confirmation                                                  |

---

### 3.4 Section — Experience

**Purpose:** Display career history as a vertical timeline.

| Req ID | Requirement                                                                              |
|--------|------------------------------------------------------------------------------------------|
| EX-01  | Each experience object: `{ id, role, company, startDate, endDate, description, tags[] }` |
| EX-02  | `endDate` can be "Present" for current roles                                             |
| EX-03  | Render as a vertical timeline with connector line and pulsing dot                        |
| EX-04  | Each item shows: role, company, date range, description, tech tags                      |
| EX-05  | Timeline connector line with animated pulsing dot                                        |
| EX-06  | Items reveal with slide-in animation on scroll                                           |
| EX-07  | Admin: add experience via modal                                                          |
| EX-08  | Admin: edit experience via modal                                                         |
| EX-09  | Admin: delete experience with confirmation                                               |

---

### 3.5 Section — Contact

| Req ID | Requirement                                                         |
|--------|---------------------------------------------------------------------|
| CT-01  | Display contact description paragraph (editable by admin)           |
| CT-02  | "Send Email" button uses `mailto:` with profile email               |
| CT-03  | Social link icons rendered dynamically from profile data            |

---

## 4. UI/UX Design Specifications

### 4.1 Color Palette

| Token              | Hex / Value                                    | Usage                          |
|--------------------|------------------------------------------------|--------------------------------|
| `--color-bg`       | `#020617`                                      | Page background                |
| `--color-surface`  | `#0f172a`                                      | Card/surface background        |
| `--color-border`   | `rgba(255,255,255,0.08)`                       | Card borders                   |
| `--color-blue`     | `#3b82f6`                                      | Primary accent, CTA buttons    |
| `--color-blue-dk`  | `#1d4ed8`                                      | Button hover, active           |
| `--color-emerald`  | `#10b981`                                      | Secondary accent, tags         |
| `--color-em-dk`    | `#059669`                                      | Emerald hover                  |
| `--color-text`     | `#f1f5f9`                                      | Primary text                   |
| `--color-muted`    | `#94a3b8`                                      | Secondary / placeholder text   |
| `--color-gradient` | `linear-gradient(135deg, #3b82f6, #10b981)`    | Gradient text, borders         |

### 4.2 Typography

| Element      | Font      | Weight  | Size             |
|--------------|-----------|---------|------------------|
| Body         | Inter     | 400     | 16px base        |
| Headings     | Inter     | 700–900 | Responsive clamp |
| Code / Term. | Fira Code | 400     | 14px             |
| Section tags | Inter     | 600     | 12px uppercase   |

### 4.3 Glassmorphism Cards

All cards apply the following CSS pattern:

```css
.glass-card {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}
```

### 4.4 Background Glowing Orbs

- Three large circular blurred divs positioned absolutely behind all content
- Orb 1: Blue (#3b82f6), top-left quadrant
- Orb 2: Emerald (#10b981), bottom-right quadrant
- Orb 3: Purple (#8b5cf6), center-right
- All use `filter: blur(120px)`, opacity ~0.15, slow floating `@keyframes float` animation

### 4.5 Animated Gradient Text

```css
.gradient-text {
  background: linear-gradient(135deg, #3b82f6, #10b981, #8b5cf6);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 4s ease infinite;
}
```

### 4.6 Scroll Reveal Animations

- All `.reveal` elements start as `opacity: 0; transform: translateY(30px)`
- `IntersectionObserver` adds `.visible` class when element enters viewport
- `.visible` transitions to `opacity: 1; transform: translateY(0)` over 0.6s
- Stagger delay on grid children via `transition-delay`

### 4.7 3D Tilt Effect

- Applied to all `.tilt-card` elements on `mousemove`
- Calculate cursor offset from card center
- Apply `rotateX` / `rotateY` (max ±15°) and `translateZ(10px)` via `perspective(1000px)`
- On `mouseleave`: reset transform with smooth transition
- Shimmer gradient overlay follows cursor position

### 4.8 Hero Terminal Animation

- Hero right panel: animated terminal window card
- Typewriter effect types out a CLI command character by character
- Simulated output lines appear with staggered delay
- Cursor blinks via CSS `@keyframes blink`
- Loops through a predefined list of commands (Kubernetes, Docker, Terraform etc.)

### 4.9 Navbar Behavior

| Requirement     | Detail                                                              |
|-----------------|---------------------------------------------------------------------|
| Sticky          | `position: fixed; top: 0` with backdrop blur                        |
| Scroll shrink   | Reduces padding when page scrolled > 50px                           |
| Active link     | Highlight nav link for visible section (IntersectionObserver)       |
| Mobile          | Hamburger icon toggles slide-down mobile menu                       |
| Logo            | Styled as `<Name />` code-bracket format                            |
| Resume button   | Visible in nav, links to converted resume URL, hidden if empty      |

---

## 5. Admin System Requirements

### 5.1 Hidden Entry Point

| Req ID | Requirement                                                                   |
|--------|-------------------------------------------------------------------------------|
| AD-01  | A lock icon (🔒) button is visible in the footer, styled with low opacity     |
| AD-02  | A **double-click** on the lock icon opens the Login Modal                     |
| AD-03  | Single click does nothing (prevents accidental triggers)                      |

### 5.2 Login Modal

| Req ID | Requirement                                                                          |
|--------|--------------------------------------------------------------------------------------|
| AD-04  | Modal overlays the page with a semi-transparent backdrop                             |
| AD-05  | Contains: username input, password input, submit button, error message area          |
| AD-06  | Credentials hardcoded in `js/admin.js` (e.g., `admin` / `portfolio2025`)             |
| AD-07  | On correct credentials: close modal, show Admin Toolbar, save to `sessionStorage`    |
| AD-08  | On wrong credentials: display inline red error "Invalid credentials"                 |
| AD-09  | Modal closeable via ✕ button or clicking the backdrop overlay                        |
| AD-10  | On page reload: check `sessionStorage` — if session exists, restore admin state      |

### 5.3 Admin Toolbar

| Req ID | Requirement                                                              |
|--------|--------------------------------------------------------------------------|
| AD-11  | Fixed bar at the bottom of the viewport                                  |
| AD-12  | Shows: "⚙️ Admin" brand label, Edit Mode toggle switch, Logout button    |
| AD-13  | Logout clears `sessionStorage`, hides toolbar, disables edit mode        |

### 5.4 Edit Mode

| Req ID | Requirement                                                                                          |
|--------|------------------------------------------------------------------------------------------------------|
| AD-14  | Toggling Edit Mode on shows action buttons on every editable item                                    |
| AD-15  | Profile / Hero / About fields: text becomes inline `<input>` or `<textarea>`; saved on blur/Enter    |
| AD-16  | Skills, Projects, Experience: show ✏️ Edit and 🗑️ Delete buttons overlaid on each card              |
| AD-17  | Clicking ✏️ opens the Edit Modal pre-filled with item data                                           |
| AD-18  | Edit Modal form has fields matching the item's data schema                                           |
| AD-19  | Clicking 🗑️ shows `confirm()` dialog before permanently deleting                                    |
| AD-20  | ➕ Add buttons appear below each section when Edit Mode is active                                    |
| AD-21  | Clicking ➕ opens an empty Edit Modal for new item creation                                          |
| AD-22  | All changes (add, edit, delete) immediately re-render and save to `localStorage`                     |
| AD-23  | Toggling Edit Mode off hides all action buttons; content returns to read-only display                |

### 5.5 localStorage Keys

| Key                    | Value                  |
|------------------------|------------------------|
| `portfolio_profile`    | JSON object            |
| `portfolio_skills`     | JSON array             |
| `portfolio_projects`   | JSON array             |
| `portfolio_experience` | JSON array             |

NOTE: On first load, if no localStorage keys exist, default data from `js/data.js` is used.

---

## 6. Resume Feature Requirements

| Req ID | Requirement                                                                                         |
|--------|-----------------------------------------------------------------------------------------------------|
| RS-01  | Admin can enter a Google Drive share link in the profile edit form                                  |
| RS-02  | App detects Google Drive share URL: `https://drive.google.com/file/d/{FILE_ID}/view`                |
| RS-03  | Regex extracts FILE_ID and converts to: `https://drive.google.com/file/d/{FILE_ID}/preview`         |
| RS-04  | If URL is already a preview or direct link, use it as-is                                            |
| RS-05  | "View Resume" button in Navbar links to converted URL (opens new tab)                               |
| RS-06  | "View Resume" button in Hero section links to the same URL                                          |
| RS-07  | If `resumeUrl` is empty/not set, both buttons are hidden                                            |
| RS-08  | Regex pattern: `/\/file\/d\/([a-zA-Z0-9_-]+)/`                                                      |

---

## 7. Non-Functional Requirements

### 7.1 Performance

| Req ID | Requirement                                                                      |
|--------|----------------------------------------------------------------------------------|
| NF-01  | First contentful paint under 2 seconds on a 4G connection                        |
| NF-02  | No blocking external API calls; fonts loaded asynchronously                      |
| NF-03  | All images use lazy loading (`loading="lazy"`)                                   |
| NF-04  | Animations use only `transform` and `opacity` (GPU-composited, no layout thrash) |

### 7.2 Responsiveness Breakpoints

| Breakpoint       | Layout                                                            |
|------------------|-------------------------------------------------------------------|
| < 640px          | Single column, stacked hero, hamburger nav                        |
| 640px – 1024px   | 2-column grids, side-by-side about                                |
| > 1024px         | Full desktop layout, hero split, 3-col project grid               |

### 7.3 Accessibility

| Req ID | Requirement                                                               |
|--------|---------------------------------------------------------------------------|
| NF-05  | All interactive elements have `aria-label` or visible text labels         |
| NF-06  | Color contrast meets WCAG AA minimum (4.5:1 for body text)                |
| NF-07  | Modal dialogs trap focus while open                                        |
| NF-08  | Skip-to-content link available for keyboard users                         |
| NF-09  | All images have meaningful `alt` attributes                                |

### 7.4 Browser Compatibility

| Browser | Minimum Version |
|---------|----------------|
| Chrome  | 90+            |
| Firefox | 88+            |
| Safari  | 14+            |
| Edge    | 90+            |

### 7.5 Security Note

IMPORTANT: Admin credentials are stored in plain JavaScript. This is intentional for a static
portfolio with no sensitive data. Do NOT use this pattern for applications handling real user data.

- Credentials are hardcoded (acceptable for demo/personal portfolio use)
- No `eval()` or `innerHTML` with unsanitized user input
- All external links use `rel="noopener noreferrer"`

### 7.6 Code Quality

| Req ID | Requirement                                                                          |
|--------|--------------------------------------------------------------------------------------|
| NF-10  | Code split into modular JS files: data.js, admin.js, render.js, animations.js, app.js |
| NF-11  | CSS uses custom properties (variables) for all design tokens                         |
| NF-12  | No external JS frameworks or libraries (vanilla only)                                |
| NF-13  | Functions are documented with inline comments                                        |
| NF-14  | No console errors in production                                                      |

---

## 8. File & Project Structure

```
Myportfolio/
│
├── index.html              # Single HTML shell with all sections and modals
├── SRS.md                  # This document
├── Dockerfile              # Docker image definition (Ubuntu + Apache2)
│
├── css/
│   └── style.css           # All styles: tokens, layout, components, animations
│
└── js/
    ├── data.js             # Default data: profile, skills, projects, experience
    ├── admin.js            # Login logic, session, edit mode, localStorage ops
    ├── render.js           # DOM rendering functions for all sections
    ├── animations.js       # IntersectionObserver reveals, tilt, terminal typer
    └── app.js              # Entry point: init, navbar scroll, wires everything
```

---

## 9. Data Schema

### 9.1 Profile Object

```js
{
  name:        "Jane Doe",
  title:       "DevOps Engineer & Cloud Architect",
  intro:       "Building scalable infrastructure...",
  about:       "I'm a passionate DevOps engineer with expertise in...",
  resumeUrl:   "https://drive.google.com/file/d/FILE_ID/view",
  location:    "San Francisco, CA",
  email:       "hello@example.com",
  status:      "Open to Work",
  education:   "B.Tech Computer Science",
  badgeText:   "Available for opportunities",
  stats: {
    experience: "3+",
    projects:   "20+",
    certs:      "5+"
  },
  social: {
    github:   "https://github.com/username",
    linkedin: "https://linkedin.com/in/username",
    twitter:  "https://twitter.com/username"
  },
  contactDesc: "I'm currently open to new opportunities..."
}
```

### 9.2 Skill Object

```js
{
  id:          "sk-001",
  name:        "Kubernetes",
  category:    "Containers",    // Cloud | DevOps | Containers | Scripting | Monitoring | Other
  proficiency: 88               // integer 1-100
}
```

### 9.3 Project Object

```js
{
  id:          "pj-001",
  title:       "CI/CD Pipeline Automation",
  description: "Automated deployment pipeline using Jenkins and ArgoCD...",
  link:        "https://github.com/username/project",
  image:       "https://images.unsplash.com/photo-...",
  tags:        ["Jenkins", "ArgoCD", "Kubernetes", "Terraform"]
}
```

### 9.4 Experience Object

```js
{
  id:          "ex-001",
  role:        "Senior DevOps Engineer",
  company:     "Tech Corp Inc.",
  startDate:   "Jan 2023",
  endDate:     "Present",       // or "Dec 2024" for past roles
  description: "Led migration of monolithic application to microservices...",
  tags:        ["AWS", "Terraform", "Docker", "Jenkins"]
}
```

---

## 10. Constraints & Assumptions

| #  | Constraint / Assumption                                                                             |
|----|-----------------------------------------------------------------------------------------------------|
| C1 | No backend — the application is 100% client-side                                                    |
| C2 | `localStorage` must be available (private browsing may limit persistence)                           |
| C3 | Google Fonts loaded from CDN; offline use falls back to system fonts                                |
| C4 | Admin credentials are intentionally hardcoded (personal portfolio, no sensitive data)               |
| C5 | Resume must be a Google Drive shareable link or direct URL                                          |
| C6 | Project images must be valid public URLs (no file upload support)                                   |
| C7 | Designed for personal use — no multi-user or role-based access                                      |
| C8 | `sessionStorage` used for admin session (auto-clears on browser tab close)                          |
| C9 | All animations respect `prefers-reduced-motion` media query                                         |
| C10| Deployable to any static host with zero configuration                                               |

---

## Suggested Implementation Order

1. `css/style.css`     — Full design system (tokens, layout, components, animations)
2. `js/data.js`        — Default data objects for all sections
3. `js/render.js`      — DOM rendering functions for all sections
4. `js/admin.js`       — Login, session, edit mode, localStorage operations
5. `js/animations.js`  — Scroll reveal, tilt effect, terminal typewriter
6. `js/app.js`         — App initialization and wiring all modules together
7. `index.html`        — HTML shell with all sections, modals, and script tags

---

## 11. Docker & Containerization

### 11.1 Overview

The portfolio is packaged as a lightweight Docker image based on **Ubuntu + Apache2**.
This enables one-command deployment on any Docker-capable host (local machine, VPS, AWS EC2, etc.)
without requiring Node.js, npm, or any build tool.

### 11.2 Base Image

| Property    | Value                          | Rationale                                              |
|-------------|--------------------------------|--------------------------------------------------------|
| Base OS     | `ubuntu:22.04`                 | LTS release — stable, well-supported, predictable deps |
| Web Server  | Apache 2.4 (apt package)       | Lightweight, battle-tested static file server          |
| Document Root | `/var/www/html`              | Apache default; no extra vhost config needed           |

> **Why not nginx or a lighter base?**
> Ubuntu + Apache was chosen to align with the DevOps learning environment
> where the portfolio owner already works with Ubuntu servers. Swap to
> `nginx:alpine` for a production-optimized ~23 MB image if needed.

### 11.3 Image Requirements

| Req ID  | Requirement                                                                         |
|---------|-------------------------------------------------------------------------------------|
| DK-01   | Base image: `ubuntu:22.04` (pinned LTS, not `latest`)                              |
| DK-02   | Install Apache2 via `apt-get` with `--no-install-recommends` to minimize image size |
| DK-03   | Clean apt cache after install (`rm -rf /var/lib/apt/lists/*`)                       |
| DK-04   | Copy all portfolio files into `/var/www/html/`                                      |
| DK-05   | Remove default Apache `index.html` before copying portfolio files                   |
| DK-06   | Expose port **80** (HTTP)                                                           |
| DK-07   | Apache runs in the **foreground** via `apachectl -D FOREGROUND`                     |
| DK-08   | Image labels must include: `author`, `email`, `version`, `description`              |
| DK-09   | `APACHE_LOG_DIR` env var set to suppress startup warnings                           |

### 11.4 Dockerfile

The complete, annotated Dockerfile lives at the project root (`Myportfolio/Dockerfile`):

```dockerfile
# ─────────────────────────────────────────────────────────────
# Stage: Single-stage build (static site — no compilation step)
# Base : Ubuntu 22.04 LTS + Apache 2.4
# ─────────────────────────────────────────────────────────────
FROM ubuntu:22.04

# ── Image Metadata ───────────────────────────────────────────
LABEL author="varun"
LABEL email="varun@srtechops.com"
LABEL version="1.0"
LABEL description="DevOps Portfolio — static site served by Apache2 on Ubuntu 22.04"

# ── Suppress debconf / apt interactive prompts ────────────────
ENV DEBIAN_FRONTEND=noninteractive
ENV APACHE_LOG_DIR=/var/log/apache2

# ── Install Apache2 ───────────────────────────────────────────
# --no-install-recommends keeps the image lean
# Clean apt lists immediately after install to reduce layer size
RUN apt-get update && \
    apt-get install -y --no-install-recommends apache2 && \
    rm -rf /var/lib/apt/lists/*

# ── Deploy Portfolio Files ────────────────────────────────────
# Remove Apache's default placeholder page first
RUN rm -f /var/www/html/index.html

# Copy all portfolio source files into the Apache document root
COPY . /var/www/html/

# ── Networking ───────────────────────────────────────────────
EXPOSE 80

# ── Startup Command ──────────────────────────────────────────
# Run Apache in foreground so the container stays alive
CMD ["apachectl", "-D", "FOREGROUND"]
```

### 11.5 Build & Run Commands

**Build the image:**
```bash
# Run from the Myportfolio/ directory
docker build -t myportfolio:latest .
```

**Run a container locally:**
```bash
# Maps host port 8080 → container port 80
docker run -d -p 8080:80 --name portfolio myportfolio:latest
```

**Access the site:**
```
http://localhost:8080
```

**Stop & remove the container:**
```bash
docker stop portfolio && docker rm portfolio
```

### 11.6 Image Size Optimizations

| Technique                              | Impact                        |
|----------------------------------------|-------------------------------|
| `--no-install-recommends`              | Skips unnecessary packages    |
| `rm -rf /var/lib/apt/lists/*`          | Removes apt cache (~30–50 MB) |
| Single `RUN` for update + install      | Collapses apt layers into one |
| No dev tools (curl, vim, etc.)         | Keeps image minimal           |

### 11.7 Deploying to Docker Hub (Optional)

```bash
# Tag for Docker Hub
docker tag myportfolio:latest <dockerhub-username>/myportfolio:latest

# Push
docker push <dockerhub-username>/myportfolio:latest

# Pull & run anywhere
docker run -d -p 80:80 <dockerhub-username>/myportfolio:latest
```

---

End of SRS Document — Version 1.1
