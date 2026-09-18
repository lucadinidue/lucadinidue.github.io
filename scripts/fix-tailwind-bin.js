// pnpm generates node_modules/.bin/tailwindcss as a POSIX shell wrapper script
// (to set up NODE_PATH for its isolated node_modules layout). Hugo's native
// css.TailwindCSS function needs that file to be a literal Node.js script
// (starting with a `node` shebang) so it can run it directly - it does not
// spawn a shell. Without this fix, `hugo build` fails with:
//   "TAILWINDCSS: ... binary tailwindcss is not a Node.js script"
// This runs on every `pnpm install` (see package.json "postinstall") so the
// fix survives fresh installs both locally and in CI.
const fs = require('fs');
const path = require('path');

const pkgDir = path.resolve(__dirname, '..', 'node_modules', '@tailwindcss', 'cli');
const pkgJsonPath = path.join(pkgDir, 'package.json');

if (!fs.existsSync(pkgJsonPath)) {
  process.exit(0);
}

const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
const binField = pkg.bin;
const binRelative = typeof binField === 'string' ? binField : binField && binField.tailwindcss;

if (!binRelative) {
  process.exit(0);
}

const realEntry = path.join(pkgDir, binRelative);
const shimPath = path.resolve(__dirname, '..', 'node_modules', '.bin', 'tailwindcss');

if (!fs.existsSync(realEntry)) {
  process.exit(0);
}

let needsPatch = true;
if (fs.existsSync(shimPath)) {
  const isSymlinkToRealEntry =
    fs.lstatSync(shimPath).isSymbolicLink() && fs.realpathSync(shimPath) === fs.realpathSync(realEntry);
  if (isSymlinkToRealEntry) {
    needsPatch = false;
  }
}

if (needsPatch) {
  // Must be a symlink, not a copy: Node's ESM resolver follows the symlink's
  // realpath and then walks up node_modules from *there*, which is what lets
  // it find this package's dependencies (e.g. "mri") inside pnpm's nested
  // per-package node_modules. A plain copy would live outside that tree and
  // fail to resolve them.
  fs.rmSync(shimPath, { force: true });
  fs.symlinkSync(realEntry, shimPath);
  console.log('[fix-tailwind-bin] Patched node_modules/.bin/tailwindcss for Hugo compatibility.');
}
