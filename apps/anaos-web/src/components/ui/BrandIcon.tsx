"use client";

import React from "react";
import { Layers } from "lucide-react";

type BrandIconProps = {
  id: string;
  className?: string;
};

export default function BrandIcon({ id, className = "w-5 h-5" }: BrandIconProps) {
  if (!id) {
    return <Layers className={`${className} text-zinc-400`} />;
  }
  const normId = id.toLowerCase().replace(/[\s_-]+/g, "");

  const getIconUrl = (id: string) => {
    switch (id) {
      case "whatsapp": return "https://img.icons8.com/color/96/whatsapp--v1.png";
      case "instagram": return "https://img.icons8.com/color/96/instagram-new--v1.png";
      case "facebook": return "https://img.icons8.com/color/96/facebook-new.png";
      case "facebookmessenger": return "https://img.icons8.com/fluency/96/facebook-messenger--v2.png";
      case "shopify":
      case "shopifystore": return "https://img.icons8.com/color/96/shopify.png";
      case "smtp":
      case "gmail":
      case "businessemail":
      case "email": return "https://img.icons8.com/fluency/96/new-post.png"; // better email icon
      case "calendar":
      case "googlecalendar": return "https://img.icons8.com/color/96/google-calendar--v2.png";
      case "googlesheets": return "https://img.icons8.com/color/96/google-sheets.png";
      case "googledrive": return "https://img.icons8.com/color/96/google-drive--v2.png";
      case "google":
      case "googleoauth":
      case "googleaccount": return "https://img.icons8.com/color/96/google-logo.png";
      case "hubspot":
      case "hubspotcrm": return "https://img.icons8.com/fluency/96/hubspot.png"; // fixed hubspot
      case "twilio":
      case "phone":
      case "voice": return "https://img.icons8.com/fluency/96/ringer-volume.png"; // nicer phone
      case "openai": return "https://img.icons8.com/color/96/chatgpt.png";
      case "stripe":
      case "stripepayments": return "https://img.icons8.com/color/96/stripe.png";
      case "tiktok":
      case "tiktokads": return "https://img.icons8.com/fluency/96/tiktok.png";
      case "youtube": return "https://img.icons8.com/color/96/youtube-play.png";
      case "linkedin": return "https://img.icons8.com/color/96/linkedin.png";
      case "telegram": return "https://img.icons8.com/color/96/telegram-app.png";
      case "woocommerce": return "https://img.icons8.com/color/96/woocommerce.png";
      case "paypal": return "https://img.icons8.com/color/96/paypal.png";
      case "slack": return "https://img.icons8.com/color/96/slack-new.png";
      case "notion": return "https://img.icons8.com/color/96/notion--v1.png";
      case "airtable": return "https://img.icons8.com/fluency/96/airtable.png";
      case "salesforce": return "https://img.icons8.com/color/96/salesforce.png";
      case "blog":
      case "blogposts": return "https://img.icons8.com/fluency/96/wordpress.png";
      default: return null;
    }
  };

  const url = getIconUrl(normId);

  if (url) {
    return <img src={url} alt={normId} className={`${className} object-contain`} />;
  }

  return <Layers className={`${className} text-zinc-400`} />;
}
