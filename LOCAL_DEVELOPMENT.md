# Local Development Setup

To run this Hugo-based site locally for development without pushing every edit, follow these steps.

## Prerequisites

- **Hugo** (extended version for SCSS/Tailwind support): Install via Snap with `sudo snap install hugo --channel=extended`.
- **Node.js**: Install the latest version using nvm: `nvm install --lts` or `nvm install 24`.
- **pnpm**: Install globally with `npm install -g pnpm`.
- **Dependencies**: Run `pnpm install` in the project directory.

## Running the Site Locally

1. Ensure you're in the project directory: `cd /home/luca/Workspace/lucadinidue.github.io`
2. Load nvm and switch to Node.js v24: `source ~/.nvm/nvm.sh && nvm use 24`
3. Start the development server: `pnpm dev`

The server will start and be available at **http://localhost:1313** in your web browser.

- The server watches for file changes and automatically rebuilds/reloads the site.
- To stop the server, run `pkill -f "hugo server"` in a new terminal.

## Notes

This setup allows you to edit files (e.g., your `me.yaml` or content) and see changes instantly in the browser without committing/pushing. If you encounter any issues, check that Hugo and Node.js are properly installed and the correct versions are active.