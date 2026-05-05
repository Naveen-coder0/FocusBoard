# ⚡ FocusBoard — Student Productivity Platform

A clean, minimal, distraction-free productivity UI for students.  
Built with **HTML5 + CSS3 only** — no JavaScript, no frameworks.

---

## 👥 Team Members & Work Division

| Member | Files Owned | Responsibility |
|---|---|---|
| **Krishnam Makker** | `style.css`, `index.html` | Design system + Landing page |
| **Harshit** | `tasks.html` | Tasks page |
| **Naveen Maan** | `deadlines.html` | Deadlines page |
| **Mittal** | `dashboard.html`, `focus.html` | Dashboard + Focus Mode |

---

## 🗂️ File Structure

```
FocusBoard/
├── style.css          ← Krishnam Makker — Global design system
├── index.html         ← Krishnam Makker — Landing / Home page
├── dashboard.html     ← Mittal          — Dashboard
├── tasks.html         ← Harshit         — Tasks page
├── deadlines.html     ← Naveen Maan     — Deadlines calendar
└── focus.html         ← Mittal          — Focus Mode timer
```

---

## 📋 Detailed Work Breakdown

### Krishnam Makker — `style.css` + `index.html`

**`style.css` (Design System)**
- CSS custom properties (color tokens, spacing, shadows, radius)
- CSS reset and base body styles
- App shell layout (`.app-layout` flex container)
- Sticky sidebar component
- Sidebar nav links with hover/active states
- Reusable `.card` component with hover lift effect
- Button variants: `.btn-primary`, `.btn-outline`
- Status badge variants (success, warning, danger, blue, purple, pink)
- CSS-only progress bar
- Page header typography
- CSS Grid helpers (`.grid-2`, `.grid-3`)
- Section title / eyebrow text styles
- Top navbar (used on landing page)
- Full mobile-first responsive breakpoints (sidebar → top bar on mobile)

**`index.html` (Landing Page)**
- Sticky top navbar with all page links
- Hero section: eyebrow tag, H1 headline, subtitle, CTA buttons
- Fake browser-chrome app mockup (macOS dots + mini sidebar + stat cards + task rows)
- Feature highlights: 3-card grid (Tasks, Deadlines, Focus Mode)
- Page footer

---

### Harshit — `tasks.html`

**`tasks.html` (Tasks Page)**
- Sticky sidebar navigation (active state on Tasks)
- Page header with task count summary
- Filter pill bar: All / Pending / Completed / Due Today / subject filters
- Pending task cards: title, subject badge, deadline date, status badge
- Completed task cards: strikethrough title, done badge
- Add New Task form (UI only): title input, subject dropdown, deadline picker, priority dropdown, notes textarea, submit button
- Two-column responsive layout (form stacks below list on mobile)

---

### Naveen Maan — `deadlines.html`

**`deadlines.html` (Deadlines Page)**
- Sticky sidebar navigation (active state on Deadlines)
- CSS Grid calendar for July 2025 (7-column grid)
- Today's date highlighted in accent blue
- Colored dot indicators on deadline dates (per subject)
- Subject color legend (Math=blue, Physics=purple, English=pink, History=amber, Biology=green)
- Upcoming deadlines side panel with urgency badges and completion progress bars
- Responsive: stacks to single column on smaller screens

---

### Mittal — `dashboard.html` + `focus.html`

**`dashboard.html` (Dashboard)**
- Sticky sidebar navigation (active state on Dashboard)
- Page header with greeting and date
- 3-column stat cards row: Tasks Today, Focus Hours, Streak
- Today's Tasks card with done/pending task rows and circular checkboxes
- Weekly Progress card with per-subject CSS progress bars (Math, Physics, English, Biology)
- Upcoming Deadlines side panel with date badges and urgency badges
- Two-column responsive layout (stacks on mobile)

**`focus.html` (Focus Mode)**
- Full-screen dark theme layout (`#0f1117` background)
- Dark top navigation bar with Exit button
- Session type tabs: Pomodoro / Short Break / Long Break
- SVG circular ring timer (stroke-dashoffset controls fill percentage)
- Timer display: `18:45` centered inside ring
- Control buttons: Restart (↺), Play (▶ primary), Skip (⏭)
- Current task info card (task name + subject + due time)
- Session statistics row: Sessions / Focus Time / Breaks
- Motivational footer text
- Responsive ring size adjustment for small screens

---

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#f7f8fa` |
| Surface (cards) | `#ffffff` |
| Border | `#e4e7ec` |
| Accent blue | `#4f7ef8` |
| Text | `#1a1d23` |
| Text muted | `#6b7280` |
| Border radius | `14px` (cards), `8px` (small) |
| Font | Inter (Google Fonts) |

---

## 🚀 How to Run

No build step needed. Just open any HTML file in a browser:

```
index.html       → Landing page (start here)
dashboard.html   → Main app dashboard
tasks.html       → Task manager
deadlines.html   → Calendar & deadlines
focus.html       → Focus/Pomodoro timer
```

All pages are interlinked via navigation. Works fully offline after the Google Fonts CDN loads once.

---

## 📱 Responsive Behavior

- **Desktop**: Sidebar on the left, multi-column content grids
- **Mobile (≤768px)**: Sidebar collapses to a horizontal icon-only top bar, all grids stack to single column

---

## ⚙️ Tech Stack

- HTML5 (semantic elements)
- CSS3 (Flexbox, Grid, custom properties, transitions)
- Google Fonts — Inter
- Zero JavaScript · Zero frameworks · Zero dependencies
