# Local Development Setup

To run this Hugo-based site locally for development without pushing every edit, follow these steps.

## Prerequisites

- **Hugo** (extended version for SCSS/Tailwind support): Install via Snap with `sudo snap install hugo --channel=extended`.
- **Node.js**: Use `24.14.0` (the repo now includes `.nvmrc` and `.node-version`).
- **pnpm**: Use `10.14.0`.
- **Dependencies**: Run `pnpm install` in the project directory.

## Running the Site Locally

1. Ensure you're in the project directory: `cd /home/luca/Workspace/lucadinidue.github.io`
2. Load nvm and switch to the project Node.js version:

   `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use`

   If that version is not installed yet:

   `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm install`

3. Start the development server: `pnpm dev`

The server will start and be available at **http://localhost:1313** in your web browser.

- The server watches for file changes and automatically rebuilds/reloads the site.
- To stop the server, run `pkill -f "hugo server"` in a new terminal.

## Notes

If `pnpm dev` fails with a syntax error around `?.`, your shell is almost certainly using an old Node.js runtime such as `v10.x`. In that case:

1. Run `node -v`
2. If it is not `v24.14.0`, run `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use`
3. Verify with `node -v` and `pnpm -v`
4. Retry `pnpm dev`

This setup allows you to edit files (e.g., your `me.yaml` or content) and see changes instantly in the browser without committing/pushing. If you encounter any issues, check that Hugo and Node.js are properly installed and the correct versions are active.
