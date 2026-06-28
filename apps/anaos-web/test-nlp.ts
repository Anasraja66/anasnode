import { AnaosNLP } from "./src/lib/ai/pipeline/AnaosNLP";

const doc = AnaosNLP.processText("I need a 2 kanal plot in Lahore on urgent basis. It is a good location.", "real-estate");
console.log(JSON.stringify(doc, null, 2));
