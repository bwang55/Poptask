# Poptask

A lightweight queue-style task web app designed for quick captures and satisfying completions. Built with vanilla HTML, CSS, and JavaScript so it can be served statically and opened on mobile browsers (including iPhone Safari).

## Features

- 📋 **Queue-first layout** – tasks are displayed as cards sorted by deadline or by the time you added them.
- ⏰ **Flexible deadlines** – choose an exact date/time or set relative reminders like “in 5 minutes” or “in 1 hour”.
- 🎉 **Pleasant pop interaction** – finishing a task triggers a pop animation and moves the task into an archive list.
- 🗃️ **Archive view** – revisit completed tasks and clear them when you’re done celebrating.
- 💾 **Offline-friendly** – all data is stored in your browser’s `localStorage`, so nothing leaves your device.
- 📱 **Mobile-ready** – responsive layout and large tap targets make the app comfortable on phones.

## Getting started

1. Serve the folder with any static web server. A simple option is Python’s built-in server:

   ```bash
   python -m http.server 4173
   ```

2. Open your browser and navigate to `http://localhost:4173` (or the URL your server prints). On mobile, host the site and share the network URL, or deploy the folder to any static hosting provider.

3. Add tasks from the floating action button, then pop them once completed!

## Project structure

```
Poptask/
├── index.html        # Main queue view
├── add.html          # Task creation form
├── archive.html      # Completed task archive
├── scripts/
│   ├── add.js        # Form logic
│   ├── archive.js    # Archive rendering
│   ├── index.js      # Queue interactions
│   └── storage.js    # LocalStorage helpers
└── styles/
    └── main.css      # Global styling
```

## Notes

- Tasks and archive entries live entirely in `localStorage`; clearing browser data will reset the app.
- Animations are minimized automatically for users who prefer reduced motion.
- The design uses system fonts for fast rendering and a clean appearance.
