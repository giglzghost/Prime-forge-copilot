// scripts/fix-vercel-build.js
// Safe guard for CI and developer environments.
// This script patches tsconfig.json to ensure JSON imports and node resolution are enabled.
// It intentionally does NOT run npm install or modify dependencies to avoid side effects in CI.

const fs = require("fs");
const path = require("path");

function patchTsconfig() {
  const tsconfigPath = path.join(process.cwd(), "tsconfig.json");
  if (!fs.existsSync(tsconfigPath)) {
    console.warn("tsconfig.json not found; skipping patch.");
    return;
  }

  try {
    const raw = fs.readFileSync(tsconfigPath, "utf8");
    const tsconfig = JSON.parse(raw);

    tsconfig.compilerOptions = tsconfig.compilerOptions || {};
    let changed = false;

    if (tsconfig.compilerOptions.resolveJsonModule !== true) {
      tsconfig.compilerOptions.resolveJsonModule = true;
      changed = true;
    }
    if (tsconfig.compilerOptions.esModuleInterop !== true) {
      tsconfig.compilerOptions.esModuleInterop = true;
      changed = true;
    }
    if (tsconfig.compilerOptions.moduleResolution !== "node") {
      tsconfig.compilerOptions.moduleResolution = "node";
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2), "utf8");
      console.log("✓ tsconfig.json patched");
    } else {
      console.log("✓ tsconfig.json already compatible");
    }
  } catch (err) {
    console.error("Error patching tsconfig.json:", err);
    process.exitCode = 0; // do not fail the build; keep this script a safe no-op on error
  }
}

function checkOptionalPackages() {
  const optional = ["@vercel/node", "nodemailer"];
  optional.forEach((pkg) => {
    try {
      require.resolve(pkg);
      console.log(`✓ ${pkg} present`);
    } catch {
      console.log(`ℹ ${pkg} not found (optional). Do not auto-install in CI.`);
    }
  });
}

console.log("🔧 Running safe prebuild guard (no installs)...");
patchTsconfig();
checkOptionalPackages();
console.log("✓ prebuild guard complete");
