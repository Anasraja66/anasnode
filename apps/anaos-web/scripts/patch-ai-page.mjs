import fs from "fs";

const p = new URL("../src/app/dashboard/page.tsx", import.meta.url);
const file = fs.readFileSync(p, "utf8");
let lines = file.split(/\r?\n/);

const start = lines.findIndex((l) => l.includes("Page: AI Agent"));
const end = lines.findIndex((l, i) => i > start && l.includes("Page: Overview"));

if (start < 0 || end < 0) {
  console.error("markers not found", start, end);
  process.exit(1);
}

const insert = [
  "",
  "function AIAgentPage({ ws }: { ws: Workspace }) {",
  "  return <AnaosAIHub ws={ws} />;",
  "}",
  "",
];

let out = [...lines.slice(0, start), ...insert, ...lines.slice(end)].join("\n");

if (!out.includes("AnaosAIHub")) {
  out = out.replace(
    'import { getIndustryPreset, type IndustryPreset } from "@/lib/industry/presets";',
    'import { getIndustryPreset, type IndustryPreset } from "@/lib/industry/presets";\nimport { AnaosAIHub } from "@/components/dashboard/AnaosAIHub";'
  );
}

fs.writeFileSync(p, out);
console.log(`Removed ${end - start} lines, inserted AnaosAIHub at ${start}`);
