// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync } = require("child_process");

const envVars = fs.readFileSync(".env", "utf8")
  .split("\n")
  .filter(line => line && !line.startsWith("#"))
  .reduce((acc, line) => {
    const [key, ...rest] = line.split("=");
    if (key) {
      acc[key.trim()] = rest.join("=").replace(/^"|"$/g, "").trim();
    }
    return acc;
  }, {});

for (const [key, value] of Object.entries(envVars)) {
  console.log(`Setting ${key}...`);
  try {
    execSync(`npx vercel env rm ${key} production preview development --yes`, { stdio: "ignore" });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {} // Ignore if doesn't exist
  try {
    for (const env of ["production", "preview", "development"]) {
      try {
        execSync(`npx vercel env add ${key} ${env}`, { input: value, stdio: "inherit" });
      } catch (e) {
        console.error(`Failed to set ${key} for ${env}`, e.message);
      }
    }
  } catch (e) {
    console.error(`Failed to set ${key}`, e.message);
  }
}
console.log("Done!");
