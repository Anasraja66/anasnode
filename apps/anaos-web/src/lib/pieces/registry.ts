import { openai } from "@activepieces/piece-openai";
import { googleSheets } from "@activepieces/piece-google-sheets";
import { slack } from "@activepieces/piece-slack";
import { smtp } from "@activepieces/piece-smtp";
import { hubspot } from "@activepieces/piece-hubspot";
import { stripe } from "@activepieces/piece-stripe";
import { twilio } from "@activepieces/piece-twilio";
import { calendly } from "@activepieces/piece-calendly";
import { zoom } from "@activepieces/piece-zoom";
import { trello } from "@activepieces/piece-trello";
import { asana } from "@activepieces/piece-asana";
import { shopify } from "@activepieces/piece-shopify";
import { woocommerce } from "@activepieces/piece-woocommerce";
import { notion } from "@activepieces/piece-notion";
import { discord } from "@activepieces/piece-discord";
import { github } from "@activepieces/piece-github";
import { dropbox } from "@activepieces/piece-dropbox";
import { mailchimp } from "@activepieces/piece-mailchimp";
// AI & Voice & Extra CRMs
import { telegramBot } from "@activepieces/piece-telegram-bot";
import { airtable } from "@activepieces/piece-airtable";
import { sendgrid } from "@activepieces/piece-sendgrid";
import { pipedrive } from "@activepieces/piece-pipedrive";

// A global registry of all activepieces we support
export const pieceRegistry: Record<string, any> = {
  "piece-openai": openai,
  "piece-google-sheets": googleSheets,
  "piece-slack": slack,
  "piece-smtp": smtp,
  "piece-hubspot": hubspot,
  "piece-stripe": stripe,
  "piece-twilio": twilio,
  "piece-calendly": calendly,
  "piece-zoom": zoom,
  "piece-trello": trello,
  "piece-asana": asana,
  "piece-shopify": shopify,
  "piece-woocommerce": woocommerce,
  "piece-notion": notion,
  "piece-discord": discord,
  "piece-github": github,
  "piece-dropbox": dropbox,
  "piece-mailchimp": mailchimp,
  "piece-telegram-bot": telegramBot,
  "piece-airtable": airtable,
  "piece-sendgrid": sendgrid,
  "piece-pipedrive": pipedrive,
};

export function getPiece(name: string) {
  return pieceRegistry[name];
}

export function getAction(pieceName: string, actionName: string) {
  const piece = getPiece(pieceName);
  if (!piece) throw new Error(`Piece ${pieceName} not found`);
  const action = piece.actions?.[actionName] || piece.getAction(actionName);
  if (!action) throw new Error(`Action ${actionName} not found in ${pieceName}`);
  return action;
}
