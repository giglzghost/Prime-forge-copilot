// scripts/fix-vercel-build.js

const fs = require("fs");
const path = require("path");

function ensurePackage(pkg) {
  try {
    require.resolve(pkg);
    console.log(`✓ ${pkg} already installed`);
  } catch {
    console.log(`Installing missing package: ${pkg}`);
    require("child_process").execSync(`npm install ${pkg} --save`, {
      stdio: "inherit",
    });
  }
}

console.log("🔧 Fixing Vercel build environment...");

// Ensure required modules exist
ensurePackage("@vercel/node");
ensurePackage("nodemailer");

// Ensure tsconfig supports JSON imports
const tsconfigPath = path.join(process.cwd(), "tsconfig.json");
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));

tsconfig.compilerOptions = tsconfig.compilerOptions || {};
tsconfig.compilerOptions.resolveJsonModule = true;
tsconfig.compilerOptions.esModuleInterop = true;
tsconfig.compilerOptions.moduleResolution = "node";

fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));

console.log("✓ tsconfig.json patched");
console.log("Vercel build environment fixed.");
