"use client";

import React from "react";
import { Layers } from "lucide-react";

type BrandIconProps = {
  id: string;
  className?: string;
};

export default function BrandIcon({ id, className = "w-5 h-5" }: BrandIconProps) {
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
      case "email": return "https://img.icons8.com/color/96/gmail-new.png";
      case "googlecalendar": return "https://img.icons8.com/color/96/google-calendar--v2.png";
      case "googlesheets": return "https://img.icons8.com/color/96/google-sheets.png";
      case "googledrive": return "https://img.icons8.com/color/96/google-drive--v2.png";
      case "google":
      case "googleoauth":
      case "googleaccount": return "https://img.icons8.com/color/96/google-logo.png";
      case "hubspot":
      case "hubspotcrm": return "https://img.icons8.com/color/96/hubspot.png";
      case "twilio": return "https://img.icons8.com/color/96/twilio.png";
      case "openai": return "https://img.icons8.com/color/96/chatgpt.png";
      case "stripe":
      case "stripepayments": return "https://img.icons8.com/color/96/stripe.png";
      case "tiktok":
      case "tiktokads": return "https://img.icons8.com/color/96/tiktok--v1.png";
      case "youtube": return "https://img.icons8.com/color/96/youtube-play.png";
      case "linkedin": return "https://img.icons8.com/color/96/linkedin.png";
      case "blog":
      case "blogposts": return "https://img.icons8.com/color/96/wordpress.png";
      default: return null;
    }
  };

  const url = getIconUrl(normId);

  if (url) {
    return <img src={url} alt={normId} className={`${className} object-contain`} crossOrigin="anonymous" />;
  }

  return <Layers className={`${className} text-zinc-400`} />;
}
