import { globalRegistry } from "./registry";
import { NodeType } from "../types";

// Import Node Handlers
import { SendWhatsAppNode } from "../nodes/whatsapp";
import { WaitNode } from "../nodes/wait";

// Register all modular nodes here
export function initializeNodeRegistry() {
  globalRegistry.register(NodeType.SEND_WHATSAPP, new SendWhatsAppNode());
  globalRegistry.register(NodeType.WAIT, new WaitNode());
  
  // Future nodes will be imported and registered here
}
