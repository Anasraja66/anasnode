"use client";

import React from "react";
import { 
  Layers, 
  MessageCircle, 
  Camera, 
  Globe, 
  ShoppingBag, 
  Mail, 
  Calendar, 
  Table, 
  HardDrive, 
  Search, 
  Database, 
  PhoneCall, 
  Bot, 
  CreditCard, 
  Video, 
  PlayCircle, 
  Send, 
  ShoppingCart, 
  DollarSign, 
  FileText, 
  Briefcase,
  Users,
  MessageSquare,
  Volume2,
  Mic,
  CheckCircle,
  Layout,
  Github
} from "lucide-react";

type BrandIconProps = {
  id: string;
  className?: string;
};

export default function BrandIcon({ id, className = "w-5 h-5" }: BrandIconProps) {
  if (!id) {
    return <Layers className={`${className} text-zinc-400`} />;
  }
  const normId = id.toLowerCase().replace(/[\s_-]+/g, "");

  switch (normId) {
    case "whatsapp": return <MessageCircle className={`${className}`} />;
    case "instagram": return <Camera className={`${className}`} />;
    case "facebook": return <Globe className={`${className}`} />;
    case "facebookmessenger": return <MessageCircle className={`${className}`} />;
    case "shopify":
    case "shopifystore": return <ShoppingBag className={`${className}`} />;
    case "smtp":
    case "gmail":
    case "businessemail":
    case "email": return <Mail className={`${className}`} />;
    case "calendar":
    case "googlecalendar": return <Calendar className={`${className}`} />;
    case "googlesheets": return <Table className={`${className}`} />;
    case "googledrive": return <HardDrive className={`${className}`} />;
    case "google":
    case "googleoauth":
    case "googleaccount": return <Search className={`${className}`} />;
    case "hubspot":
    case "hubspotcrm": return <Database className={`${className}`} />;
    case "twilio":
    case "phone":
    case "voice": return <PhoneCall className={`${className}`} />;
    
    // AI & Voice Engines
    case "openai":
    case "chatgpt": return <Bot className={`${className}`} />;
    case "elevenlabs": return <Volume2 className={`${className}`} />;
    case "vapi": return <Mic className={`${className}`} />;
    case "retell": return <PhoneCall className={`${className}`} />;
    case "stripe":
    case "stripepayments": return <CreditCard className={`${className}`} />;
    case "tiktok":
    case "tiktokads": return <Video className={`${className}`} />;
    case "youtube": return <PlayCircle className={`${className}`} />;
    case "linkedin": return <Users className={`${className}`} />;
    case "telegram": return <Send className={`${className}`} />;
    case "woocommerce": return <ShoppingCart className={`${className}`} />;
    case "paypal": return <DollarSign className={`${className}`} />;
    case "slack": return <MessageSquare className={`${className}`} />;
    case "notion": return <FileText className={`${className}`} />;
    case "airtable": return <Table className={`${className}`} />;
    case "salesforce": return <Briefcase className={`${className}`} />;
    case "discord": return <MessageSquare className={`${className}`} />;
    case "mailchimp": return <Mail className={`${className}`} />;
    case "pipedrive": return <Database className={`${className}`} />;
    case "calendly": return <Calendar className={`${className}`} />;
    case "zoom": return <Video className={`${className}`} />;
    case "asana": return <CheckCircle className={`${className}`} />;
    case "trello": return <Layout className={`${className}`} />;
    case "dropbox": return <HardDrive className={`${className}`} />;
    case "github": return <Github className={`${className}`} />;
    case "blog":
    case "blogposts": return <FileText className={`${className}`} />;
    default: return <Layers className={`${className} text-zinc-400`} />;
  }
}
