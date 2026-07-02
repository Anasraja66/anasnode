"use client";

import React from "react";
import {
  SiWhatsapp,
  SiInstagram,
  SiFacebook,
  SiMessenger,
  SiShopify,
  SiGmail,
  SiGooglecalendar,
  SiGooglesheets,
  SiGoogledrive,
  SiHubspot,
  SiTwilio,
  SiOpenai,
  SiStripe,
  SiTiktok,
  SiYoutube,
} from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { FaBlog, FaLinkedin } from "react-icons/fa";
import { Layers } from "lucide-react";

type BrandIconProps = {
  id: string;
  className?: string;
};

export default function BrandIcon({ id, className = "w-5 h-5" }: BrandIconProps) {
  const normId = id.toLowerCase().replace(/[\s_-]+/g, "");

  switch (normId) {
    case "whatsapp":
      return <SiWhatsapp className={className} style={{ color: "#25D366" }} />;
    case "instagram":
      return (
        <>
          <svg width="0" height="0" className="absolute">
            <defs>
              <radialGradient id="ig-grad" cx="30%" cy="107%" r="130%">
                <stop offset="0%" stopColor="#fdf497" />
                <stop offset="5%" stopColor="#fdf497" />
                <stop offset="45%" stopColor="#fd5949" />
                <stop offset="60%" stopColor="#d6249f" />
                <stop offset="90%" stopColor="#285AEB" />
              </radialGradient>
            </defs>
          </svg>
          <SiInstagram className={className} style={{ fill: "url(#ig-grad)" }} />
        </>
      );
    case "facebook":
      return <SiFacebook className={className} style={{ color: "#1877F2" }} />;
    case "facebookmessenger":
      return <SiMessenger className={className} style={{ color: "#00B2FF" }} />;
    case "shopify":
    case "shopifystore":
      return <SiShopify className={className} style={{ color: "#96bf48" }} />;
    case "smtp":
    case "gmail":
    case "businessemail":
    case "email":
      return <MdEmail className={className} style={{ color: "#EA4335" }} />;
    case "googlecalendar":
      return <SiGooglecalendar className={className} style={{ color: "#4285F4" }} />;
    case "googlesheets":
      return <SiGooglesheets className={className} style={{ color: "#34A853" }} />;
    case "googledrive":
      return <SiGoogledrive className={className} style={{ color: "#FFBA00" }} />;
    case "google":
    case "googleoauth":
    case "googleaccount":
      return <FcGoogle className={className} />;
    case "hubspot":
    case "hubspotcrm":
      return <SiHubspot className={className} style={{ color: "#FF7A59" }} />;
    case "twilio":
      return <SiTwilio className={className} style={{ color: "#F22F46" }} />;
    case "openai":
      return <SiOpenai className={className} style={{ color: "#10A37F" }} />;
    case "stripe":
    case "stripepayments":
      return <SiStripe className={className} style={{ color: "#635BFF" }} />;
    case "tiktok":
    case "tiktokads":
      return <SiTiktok className={className} style={{ color: "#000000" }} />;
    case "youtube":
      return <SiYoutube className={className} style={{ color: "#FF0000" }} />;
    case "linkedin":
      return <FaLinkedin className={className} style={{ color: "#0A66C2" }} />;
    case "blog":
    case "blogposts":
      return <FaBlog className={className} style={{ color: "#F26522" }} />;
    default:
      return <Layers className={`${className} text-zinc-400`} />;
  }
}
