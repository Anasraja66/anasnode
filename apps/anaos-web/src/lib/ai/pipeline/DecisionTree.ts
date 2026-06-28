/**
 * ─────────────────────────────────────────────────────────────────────────────
 * DecisionTree.ts — Information Gain & Entropy (ID3 Algorithm)
 *
 * This script automatically builds a Decision Tree from a dataset by calculating
 * Entropy and Information Gain, exactly like the math in the lecture!
 * 
 * Perfect for: Spam Detection, Sentiment Classification, Profit Prediction.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface DataRow {
  [feature: string]: string; // e.g., { Age: "Old", Competition: "Yes", Type: "Software", Profit: "Down" }
}

export interface TreeNode {
  attribute?: string;              // The feature we split on (e.g., "Age")
  branches?: Record<string, TreeNode>; // The branches (e.g., "Old", "Mid", "New")
  label?: string;                  // If it's a leaf node, the final prediction (e.g., "Down")
  isLeaf: boolean;
}

export class DecisionTree {

  /**
   * 1. Calculate Entropy of a dataset based on a target class.
   * Formula: -Σ (p * log2(p))
   */
  static calculateEntropy(data: DataRow[], targetAttr: string): number {
    if (data.length === 0) return 0;

    const counts: Record<string, number> = {};
    for (const row of data) {
      const val = row[targetAttr];
      counts[val] = (counts[val] || 0) + 1;
    }

    let entropy = 0;
    for (const key in counts) {
      const p = counts[key] / data.length;
      if (p > 0) {
        entropy -= p * Math.log2(p);
      }
    }
    return parseFloat(entropy.toFixed(4));
  }

  /**
   * 2. Calculate Information Gain for a specific attribute.
   * Formula: Gain(A) = Entropy(S) - Σ (|Sv| / |S|) * Entropy(Sv)
   */
  static calculateGain(data: DataRow[], attribute: string, targetAttr: string): number {
    const totalEntropy = this.calculateEntropy(data, targetAttr);

    // Split data by attribute values
    const subsets: Record<string, DataRow[]> = {};
    for (const row of data) {
      const val = row[attribute];
      if (!subsets[val]) subsets[val] = [];
      subsets[val].push(row);
    }

    let remainderEntropy = 0;
    for (const key in subsets) {
      const subset = subsets[key];
      const subsetEntropy = this.calculateEntropy(subset, targetAttr);
      const weight = subset.length / data.length;
      remainderEntropy += weight * subsetEntropy;
    }

    const gain = totalEntropy - remainderEntropy;
    return parseFloat(gain.toFixed(4));
  }

  /**
   * 3. Recursive ID3 Algorithm to build the Decision Tree.
   */
  static buildTree(data: DataRow[], attributes: string[], targetAttr: string): TreeNode {
    // Base Case 1: If all examples have the same label, return a leaf node
    const uniqueLabels = [...new Set(data.map(row => row[targetAttr]))];
    if (uniqueLabels.length === 1) {
      return { isLeaf: true, label: uniqueLabels[0] };
    }

    // Base Case 2: If no more attributes to split on, return the most common label
    if (attributes.length === 0) {
      const majorityLabel = this.getMajorityLabel(data, targetAttr);
      return { isLeaf: true, label: majorityLabel };
    }

    // Find the attribute with the MAXIMUM Information Gain
    let bestAttr = attributes[0];
    let maxGain = -1;

    for (const attr of attributes) {
      const gain = this.calculateGain(data, attr, targetAttr);
      if (gain > maxGain) {
        maxGain = gain;
        bestAttr = attr;
      }
    }

    // Create the root node for this sub-tree
    const node: TreeNode = { isLeaf: false, attribute: bestAttr, branches: {} };

    // Split data by the best attribute's values
    const subsets: Record<string, DataRow[]> = {};
    for (const row of data) {
      const val = row[bestAttr];
      if (!subsets[val]) subsets[val] = [];
      subsets[val].push(row);
    }

    const remainingAttrs = attributes.filter(a => a !== bestAttr);

    // Recursively build branches
    for (const val in subsets) {
      const subset = subsets[val];
      node.branches![val] = this.buildTree(subset, remainingAttrs, targetAttr);
    }

    return node;
  }

  /**
   * Helper: Find the most frequent class label in a dataset
   */
  private static getMajorityLabel(data: DataRow[], targetAttr: string): string {
    const counts: Record<string, number> = {};
    let maxCount = 0;
    let majority = "";

    for (const row of data) {
      const val = row[targetAttr];
      counts[val] = (counts[val] || 0) + 1;
      if (counts[val] > maxCount) {
        maxCount = counts[val];
        majority = val;
      }
    }
    return majority;
  }

  /**
   * Helper: Print the tree beautifully
   */
  static printTree(node: TreeNode, indent: string = ""): string {
    if (node.isLeaf) {
      return `-> [${node.label}]\n`;
    }
    let str = `\n`;
    for (const branch in node.branches) {
      str += `${indent}├── If ${node.attribute} == ${branch} ${this.printTree(node.branches[branch], indent + "│   ")}`;
    }
    return str;
  }

  /**
   * 4. PREDICT NEW DATA
   * Traverse the trained tree to predict the outcome for a new unseen data row.
   */
  static predict(node: TreeNode, row: DataRow): string {
    if (node.isLeaf) return node.label!;

    const featureValue = row[node.attribute!];
    
    // If we have a branch for this feature value, follow it
    if (node.branches && node.branches[featureValue]) {
      return this.predict(node.branches[featureValue], row);
    }

    // Fallback: If unseen data appears, we can't decide perfectly, 
    // so we could either return a default or 'UNKNOWN'
    return "UNKNOWN";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LECTURE DATA TEST CASE (Uncomment to run)
// ─────────────────────────────────────────────────────────────────────────────
/*
const lectureData: DataRow[] = [
  { Age: "Old", Competition: "Yes", Type: "Software", Profit: "Down" },
  { Age: "Old", Competition: "No",  Type: "Hardware", Profit: "Down" },
  { Age: "Old", Competition: "No",  Type: "Software", Profit: "Down" },
  { Age: "Mid", Competition: "Yes", Type: "Software", Profit: "Down" },
  { Age: "Mid", Competition: "Yes", Type: "Hardware", Profit: "Down" },
  { Age: "Mid", Competition: "No",  Type: "Hardware", Profit: "Up" },
  { Age: "Mid", Competition: "No",  Type: "Software", Profit: "Up" },
  { Age: "New", Competition: "Yes", Type: "Software", Profit: "Up" },
  { Age: "New", Competition: "No",  Type: "Hardware", Profit: "Up" },
  { Age: "New", Competition: "No",  Type: "Software", Profit: "Up" },
];

const tree = DecisionTree.buildTree(lectureData, ["Age", "Competition", "Type"], "Profit");
console.log(DecisionTree.printTree(tree));

// OUTPUT EXPECTED (Exactly like the lecture slide!):
// ├── If Age == Old -> [Down]
// ├── If Age == Mid 
// │   ├── If Competition == Yes -> [Down]
// │   ├── If Competition == No -> [Up]
// ├── If Age == New -> [Up]
*/
