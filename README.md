# Poptask

Poptask is a queue-inspired task manager that runs entirely in the browser. It focuses on fast capture, deadline awareness, and a playful "pop" moment when you finish a task. The app is built with vanilla HTML, CSS, and JavaScript so it can be hosted anywhere that serves static files and works great on phones.

## Features

- 📋 **Queue-first home screen** – tasks appear as cards ordered by the soonest deadline or by when they were created.
- ⏱️ **Flexible deadlines** – choose an exact date & time or pick relative timers such as "in 5 minutes" or "in 2 hours".
- 🎉 **Satisfying completion** – tapping *Pop* fires a celebratory animation and moves the task into the archive view.
- 🗃️ **Archive log** – review completed tasks, restore them if needed, or clear the history in one tap.
- 💾 **Offline-friendly** – everything is persisted in `localStorage`; no account or backend required.
- 📱 **Mobile tuned** – responsive layout, large touch targets, and glassmorphism styling feel at home on iPhone Safari.
- ♿ **Reduced motion aware** – respects the `prefers-reduced-motion` setting and softens effects automatically.

## Project structure

```
Poptask/
├── index.html        # Queue view
├── add.html          # Task creation flow
├── archive.html      # Archive view
├── scripts/
│   ├── add.js        # Add-task form logic
│   ├── archive.js    # Archive rendering & controls
│   ├── index.js      # Queue interactions & animations
│   └── storage.js    # Shared storage helpers
└── styles/
    └── main.css      # Shared styling and component rules
```

## Local usage

1. **Install a static server.** Any static host works. A quick option already bundled with Python is:

   ```bash
   python -m http.server 4173
   ```

2. **Serve the project root.** Run the command above while inside the `Poptask/` directory.

3. **Open the app.** Visit the printed URL (for example `http://localhost:4173`) in your browser. On an iPhone, make sure your computer and phone are on the same network and open the LAN URL that Python displays.

4. **Add tasks.** Tap the floating **Add** button, fill in the name, description, and deadline (absolute or relative), then press **Save**.

5. **Work the queue.** Tasks rise to the top as deadlines approach. Pop finished tasks to archive them and keep the queue clean.

6. **Review history.** Access the archive from the quick menu to revisit popped tasks or clear the log.

All task data is stored locally in the browser. Clearing site data or switching devices resets the queue.

## Deployment

Because the app is static, you can deploy it with any file host:

- **GitHub Pages** – push this repository to GitHub and enable Pages for the main branch or `docs/` folder.
- **Netlify / Vercel / Render** – create a new site from this repository; no build step is required.
- **S3 / Cloudflare R2 / Azure Storage** – upload the files and expose them via static website hosting.
- **Self-hosted** – drop the folder onto any web server (Nginx, Apache, etc.) and point a domain at it.

The entry point is `index.html`. Ensure your host serves the files with standard text content types (e.g., `text/html`, `text/css`, `application/javascript`).

## Development notes

- The codebase intentionally avoids frameworks to stay lightweight and portable. If you want to expand functionality, the vanilla structure makes it easy to integrate your preferred build tooling.
- CSS variables in `styles/main.css` centralize colors, shadows, and glass effects. Tweak them to adjust the visual design.
- `scripts/storage.js` wraps `localStorage` access and handles serialization, making it the best place to add future persistence features.
- Animations are powered by the Web Animations API to achieve smooth transitions without external libraries.

## License

This project is provided as-is for personal and educational use. Feel free to adapt it for your own deployments.
