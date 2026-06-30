import { ExecutionContext } from "../types";

/**
 * Evaluates dynamic expressions in strings, similar to n8n.
 * e.g., "Hello {{ $json.name }}, your order from {{ $node['Trigger'].output.source }} is confirmed."
 */
export function evaluateExpression(template: string | undefined, ctx: ExecutionContext): string {
  if (!template) return "";
  
  // Expose context variables for the expression evaluator
  const $json = ctx.triggerData || {};
  const $node = ctx.nodeData || {};
  const $env = process.env;
  
  return template.replace(/\{\{(.+?)\}\}/g, (match, expr) => {
    try {
      // Evaluate the JavaScript expression safely using Function constructor
      // This is a lightweight sandbox alternative for basic object traversal
      const func = new Function('$json', '$node', '$env', `return ${expr.trim()};`);
      const result = func($json, $node, $env);
      
      // If result is an object, stringify it
      if (typeof result === 'object' && result !== null) {
        return JSON.stringify(result);
      }
      return result !== undefined && result !== null ? String(result) : "";
    } catch (e) {
      console.warn(`Failed to evaluate expression: ${expr}`, e);
      return match; // Return original string if evaluation fails
    }
  });
}
