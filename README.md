# Portfolio

A static, minimal portfolio. No build step.

## Structure
- `index.html` page shell (header, container, script tags)
- `css/styles.css` all styles
- `data/projects.js` projects, experiments, skills text
- `data/case-studies.js` case study write-ups (keys match project slugs)
- `js/templates.js` HTML for each page
- `js/app.js` routing and interactions

## Edit
- Edit the intro line in `js/templates.js` (`projectsPage`).
- Add project images: put files in an `images/` folder, then add `image:"images/siemens.jpg"` to the project in `data/projects.js`. Without an image, a colour gradient is shown.
- Add a project: add an entry to `P` in `data/projects.js` and a write-up in `data/case-studies.js`.
- Fill in the NVIDIA role placeholder in `data/projects.js`.

## Preview locally
Open the folder in VS Code and run "Open with Live Server" on `index.html`.

## Host on GitHub Pages
1. Push these files to a repo's `main` branch (files at the repo root).
2. Settings > Pages > Source: "Deploy from a branch", `main`, `/ (root)`.
3. Your site appears at `https://<username>.github.io/<repo>/`.
