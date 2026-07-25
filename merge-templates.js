const fs = require('fs');
const { execSync } = require('child_process');

try {
  // Get old file content
  const oldContent = execSync('git show HEAD~1:apps/anaos-web/src/lib/workflow/template-data.ts').toString();
  
  // Get current file content
  const currentContent = fs.readFileSync('apps/anaos-web/src/lib/workflow/template-data.ts', 'utf-8');

  // Extract array from old content
  const oldMatch = oldContent.match(/export const TEMPLATES: WorkflowTemplate\[\] = \[\s*([\s\S]*)\s*\];/);
  const oldArrayInner = oldMatch ? oldMatch[1] : '';

  // Extract array from current content
  const currentMatch = currentContent.match(/export const TEMPLATES: WorkflowTemplate\[\] = \[\s*([\s\S]*)\s*\];/);
  const currentArrayInner = currentMatch ? currentMatch[1] : '';

  // Combine them
  const combinedInner = `${currentArrayInner},\n\n  // --- ORIGINAL TEMPLATES KEEPING AS REQUESTED ---\n\n  ${oldArrayInner}`;

  // Replace current array with combined array
  const newContent = currentContent.replace(
    /export const TEMPLATES: WorkflowTemplate\[\] = \[\s*([\s\S]*)\s*\];/,
    `export const TEMPLATES: WorkflowTemplate[] = [\n  ${combinedInner}\n];`
  );

  fs.writeFileSync('apps/anaos-web/src/lib/workflow/template-data.ts', newContent);
  console.log("Successfully merged templates!");
} catch (e) {
  console.error("Error:", e);
}
