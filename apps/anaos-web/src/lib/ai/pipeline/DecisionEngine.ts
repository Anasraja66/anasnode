/**
 * ─────────────────────────────────────────────────────────────────────────────
 * DecisionEngine.ts — Anaos Intelligent Action Router
 *
 * Uses the mathematical Decision Tree (ID3) to determine the NEXT BUSINESS ACTION
 * based on NLP features extracted from a customer message.
 *
 * Use Cases:
 *  - Spam Detection / Noise Filtering
 *  - Intelligent Routing (Bot vs Human Agent)
 *  - Lead Scoring (High Priority vs Low Priority)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { DecisionTree, DataRow, TreeNode } from "./DecisionTree";
import { NLPResult } from "./AnaosNLP";

export class DecisionEngine {
  
  // ── Training Data: Historical Business Rules ────────────────────────────────
  // In production, this data would come from your Database (Past Chats).
  // Target Attribute is "Action".
  private static HISTORICAL_DATA: DataRow[] = [
    // 1. Spam / Junk Patterns
    { Intent: "general_inquiry", Sentiment: "negative", HasMoney: "No",  HasLocation: "No",  Length: "Short", Action: "Block_Spam" },
    { Intent: "general_inquiry", Sentiment: "neutral",  HasMoney: "No",  HasLocation: "No",  Length: "Short", Action: "Auto_Bot" },

    // 2. High Value Leads (Ready to buy/book)
    { Intent: "book",          Sentiment: "positive", HasMoney: "Yes", HasLocation: "Yes", Length: "Long",  Action: "Route_To_Human" },
    { Intent: "buy",           Sentiment: "neutral",  HasMoney: "Yes", HasLocation: "Yes", Length: "Mid",   Action: "Route_To_Human" },
    { Intent: "buy",           Sentiment: "positive", HasMoney: "No",  HasLocation: "Yes", Length: "Mid",   Action: "Route_To_Human" },

    // 3. Price Inquiries (Send to Bot for quote)
    { Intent: "price_inquiry", Sentiment: "neutral",  HasMoney: "No",  HasLocation: "Yes", Length: "Mid",   Action: "Auto_Bot_Quote" },
    { Intent: "price_inquiry", Sentiment: "positive", HasMoney: "No",  HasLocation: "No",  Length: "Short", Action: "Auto_Bot_Quote" },

    // 4. Angry Customers (Complaints)
    { Intent: "complaint",     Sentiment: "negative", HasMoney: "No",  HasLocation: "No",  Length: "Mid",   Action: "Escalate_Manager" },
    { Intent: "complaint",     Sentiment: "negative", HasMoney: "Yes", HasLocation: "No",  Length: "Long",  Action: "Escalate_Manager" },
    
    // 5. Cancellations
    { Intent: "cancellation",  Sentiment: "negative", HasMoney: "No",  HasLocation: "No",  Length: "Short", Action: "Route_To_Support" },
    { Intent: "cancellation",  Sentiment: "neutral",  HasMoney: "No",  HasLocation: "No",  Length: "Mid",   Action: "Route_To_Support" },
  ];

  // Cached Tree so we don't recalculate Entropy every time
  private static cachedTree: TreeNode | null = null;

  /**
   * 1. Boot up the engine (Calculate ID3 Tree)
   */
  static initializeEngine() {
    console.log("[DecisionEngine] Building ID3 Decision Tree from historical rules...");
    const attributes = ["Intent", "Sentiment", "HasMoney", "HasLocation", "Length"];
    this.cachedTree = DecisionTree.buildTree(this.HISTORICAL_DATA, attributes, "Action");
    console.log("[DecisionEngine] Tree Built Successfully!");
  }

  /**
   * 2. Extract Features from an NLPResult
   */
  private static extractFeatures(nlp: NLPResult): DataRow {
    const hasMoney = nlp.summary.money.length > 0 ? "Yes" : "No";
    const hasLocation = nlp.summary.locations.length > 0 ? "Yes" : "No";
    
    const wordCount = nlp.tokens.length;
    let length = "Short";
    if (wordCount > 5) length = "Mid";
    if (wordCount > 15) length = "Long";

    return {
      Intent: nlp.intent,
      Sentiment: nlp.sentiment,
      HasMoney: hasMoney,
      HasLocation: hasLocation,
      Length: length,
    };
  }

  /**
   * 3. Make a Business Decision
   * Takes the live NLP breakdown and predicts the next move.
   */
  static determineAction(nlp: NLPResult): string {
    if (!this.cachedTree) {
      this.initializeEngine();
    }

    // Convert live NLP data into our feature vector
    const features = this.extractFeatures(nlp);

    // Predict using the mathematical Decision Tree
    const decision = DecisionTree.predict(this.cachedTree!, features);

    console.log(`[DecisionEngine] Features: ${JSON.stringify(features)} -> Predicted Action: ${decision}`);
    
    return decision;
  }
}
