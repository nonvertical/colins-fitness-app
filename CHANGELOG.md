# Dojo — Changelog

All design and functionality changes to the application, in reverse chronological order.

---

## 2026-04-05 — Habits Page

- Habit list with streak (fire icon) and running total (e.g., "23/45 days in 2026")
- Two habit types: timed (multi-entry per day) and once-per-day (single tap to record)
- Once-per-day: tap + to record, shows checkmark when done for today
- Timed: tap +, modal with configurable quick-select durations (3 clicks total per PRD)
- Add/delete habits with name, type, and duration options
- Habit detail view with:
  - Tracking stats by period (this week, month, quarter, year, since started)
  - Completion rate and current streak
  - Timed habits also show total time and entry count
  - Quick-select option management (add/remove durations)
  - Calendar view with month navigation, logged days highlighted
- Edit habit from detail view
- All data persisted to localStorage (habits + habit_logs)

---

## 2026-03-24 — Workout Default Name

- New workout name field auto-populates with "New Workout {date}" (e.g., "New Workout Mar 24, 2026")
- Still fully editable — just saves a click for the common case

---

## 2026-03-24 — App Skeleton & Workouts Section

### App Skeleton
- Set up React Router with 6 pages: Home, Exercises, Workouts, Habits, Health Profile, Calendar View
- Home is the default route (`/`)
- Mobile navigation: floating menu button (lower right) opens a sheet with all page links
- Desktop navigation: fixed sidebar
- Dark theme with orange primary color (`#FF6B35`)
- styled-components for all styling
- localStorage for all data persistence
- Renamed app from "React App" to "Dojo" (page title, sidebar branding)

### Exercises Page
- Exercise library with add, edit, delete
- Each exercise has: name, unit type (reps/time/distance/cals), notes
- Search/filter exercises
- Unit type shown as colored badge
- Empty default — no pre-populated exercises (user adds their own)

### Workouts Section
- Workout list view with status badges (scheduled/started/finished/overdue)
- Create workout modal: name, date picker, duration presets (30/45/60/75/90/105/120 min)
- Workout detail view (journal-style page per PRD)
- Workout state machine: Scheduled → Started → Finished (+ Overdue for past unstarted)
  - Start Workout records start timestamp
  - Finish Workout records end timestamp
  - Can finish without entering any data
- Training blocks: A, B, C, D, E, F, Finisher — add/remove blocks
- Add exercises to blocks from exercise library (search to find)
- Exercises labeled within blocks (A1, A2, B1, B2, etc.)
- Sets: add one at a time, each records its own values
  - Value adjusters per unit type: reps ±1, time ±5s/±1m, distance ±5m/±100m, cals ±1/±10
  - Weight is a separate field (±5 lbs adjuster)
- Notes field per workout
- All data persisted to localStorage

### Design Decisions
- Content policy established: never generate domain content (exercises, workouts, habits, etc.) — use placeholders only. All content comes from Colin.
- Workouts are journal pages, not rigid programs (per PRD)
- All sets are variable — no fixed/variable toggle
