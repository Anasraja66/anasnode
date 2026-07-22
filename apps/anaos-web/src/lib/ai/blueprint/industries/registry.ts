import { IndustryPlaybook } from "./types";
import { baseRealEstate, realEstatePlaybooks } from "./real-estate";
import { cleaningPlaybook } from "./heavy/cleaning";
import { maintenancePlaybook } from "./heavy/maintenance";
import { fencingPlaybook } from "./heavy/fencing";
import { itPlaybook } from "./tech/it";

const ALL_PLAYBOOKS: IndustryPlaybook[] = [
  ...realEstatePlaybooks,
  cleaningPlaybook,
  maintenancePlaybook,
  fencingPlaybook,
  itPlaybook,
  baseRealEstate,
];

export function getPlaybookForPrompt(prompt: string): IndustryPlaybook | null {
  const normalized = prompt.toLowerCase();
  
  // First try to find a highly specific regional playbook (e.g. Dubai Real Estate)
  for (const playbook of ALL_PLAYBOOKS) {
    if (playbook.id.includes("base")) continue; // Skip base playbooks on first pass
    if (playbook.matchKeywords.some(kw => normalized.includes(kw))) {
      return playbook;
    }
  }

  // Fallback to a base playbook (e.g. Global Real Estate)
  for (const playbook of ALL_PLAYBOOKS) {
    if (playbook.matchKeywords.some(kw => normalized.includes(kw))) {
      return playbook;
    }
  }

  return null;
}
