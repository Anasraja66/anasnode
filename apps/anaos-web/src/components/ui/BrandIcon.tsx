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
  GitBranch,
  Headphones,
  BotMessageSquare,
  Target,
  Cloud,
  Server,
  Webhook,
  Image,
  Twitter,
  Youtube,
  Share2,
  CalendarDays,
  PenTool,
  Figma,
  BarChart2,
  UserPlus
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
    case "zendesk": return <Headphones className={`${className}`} />;
    case "intercom": return <MessageSquare className={`${className}`} />;
    case "freshdesk": return <Headphones className={`${className}`} />;
    case "typeform": return <FileText className={`${className}`} />;
    case "googleforms": return <FileText className={`${className}`} />;
    case "wordpress": return <Globe className={`${className}`} />;
    case "webflow": return <Globe className={`${className}`} />;
    case "mysql": return <Database className={`${className}`} />;
    case "postgres":
    case "postgresql": return <Database className={`${className}`} />;
    case "github": return <GitBranch className={`${className}`} />;
    case "claude": return <BotMessageSquare className={`${className}`} />;
    case "gemini": return <BotMessageSquare className={`${className}`} />;
    case "dalle":
    case "midjourney": return <Image className={`${className}`} />;
    case "pinecone": return <Database className={`${className}`} />;
    case "facebookleads":
    case "tiktokleads":
    case "linkedinads":
    case "googleads": return <Target className={`${className}`} />;
    case "twitter": return <Twitter className={`${className}`} />;
    case "youtube": return <Youtube className={`${className}`} />;
    case "vimeo": return <Video className={`${className}`} />;
    case "buffer":
    case "hootsuite": return <Share2 className={`${className}`} />;
    case "klaviyo":
    case "brevo":
    case "convertkit":
    case "constantcontact": return <Mail className={`${className}`} />;
    case "messagebird":
    case "plivo":
    case "manychat": return <MessageCircle className={`${className}`} />;
    case "magento":
    case "bigcommerce": return <ShoppingCart className={`${className}`} />;
    case "salesforce":
    case "zohocrm":
    case "activecampaign": return <Users className={`${className}`} />;
    case "bamboohr":
    case "workable":
    case "deel": return <UserPlus className={`${className}`} />;
    case "paypal":
    case "razorpay":
    case "quickbooks":
    case "xero": return <CreditCard className={`${className}`} />;
    case "googledrive":
    case "onedrive": return <Cloud className={`${className}`} />;
    case "googledocs":
    case "docusign": return <FileText className={`${className}`} />;
    case "canva": return <PenTool className={`${className}`} />;
    case "figma": return <Figma className={`${className}`} />;
    case "mixpanel":
    case "amplitude":
    case "segment": return <BarChart2 className={`${className}`} />;
    case "webex":
    case "gotowebinar": return <Video className={`${className}`} />;
    case "microsoftteams": return <Users className={`${className}`} />;
    case "monday":
    case "clickup":
    case "jira": return <Layout className={`${className}`} />;
    case "aws": return <Server className={`${className}`} />;
    case "ftp": return <HardDrive className={`${className}`} />;
    case "webhooks": return <Webhook className={`${className}`} />;
    case "blog":
    case "blogposts": return <FileText className={`${className}`} />;
    default: return <Layers className={`${className} text-zinc-400`} />;
  }
}
