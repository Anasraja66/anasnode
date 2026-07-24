import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Utensils,
  Stethoscope,
  Scissors,
  ShoppingBag,
  Dumbbell,
  Briefcase,
} from "lucide-react";

export type IndustryId =
  | "real-estate"
  | "restaurant"
  | "health"
  | "salon"
  | "ecommerce"
  | "fitness"
  | "cleaning"
  | "construction"
  | "maintenance"
  | "it"
  | "fencing"
  | "general";

export type IndustryPreset = {
  id: IndustryId;
  label: string;
  tagline: string;
  primary: string;
  primaryHover: string;
  accent: string;
  softBg: string;
  softBorder: string;
  gradientFrom: string;
  gradientTo: string;
  icon: LucideIcon;
  welcomeTitle: string;
  welcomeBody: string;
  inboxHint: string;
  automationHint: string;
  connectWhatsApp: string;
  statLabels: [string, string, string, string];
  templateKey: string;
};

export const INDUSTRY_PRESETS: Record<IndustryId, IndustryPreset> = {
  "real-estate": {
    id: "real-estate",
    label: "Real Estate",
    tagline: "Properties & viewings",
    primary: "#0A6BFF",
    primaryHover: "#0958d4",
    accent: "#1e40af",
    softBg: "#E6F0FF",
    softBorder: "#BFDBFE",
    gradientFrom: "#E6F0FF",
    gradientTo: "#ffffff",
    icon: Building2,
    welcomeTitle: "Your property desk is ready",
    welcomeBody:
      "Reply to buyers on WhatsApp, qualify budget, and book viewings — without hiring a tech team.",
    inboxHint: "Leads & viewing requests land here",
    automationHint: "Lead qualify · Viewing booking · Follow-ups",
    connectWhatsApp: "Connect WhatsApp for buyer messages",
    statLabels: ["Active listings flow", "Leads today", "Viewings booked", "Messages handled"],
    templateKey: "real-estate",
  },
  restaurant: {
    id: "restaurant",
    label: "Restaurant & Cafe",
    tagline: "Orders & reservations",
    primary: "#EA580C",
    primaryHover: "#C2410C",
    accent: "#9A3412",
    softBg: "#FFF7ED",
    softBorder: "#FDBA74",
    gradientFrom: "#FFF7ED",
    gradientTo: "#ffffff",
    icon: Utensils,
    welcomeTitle: "Your restaurant hub is ready",
    welcomeBody:
      "Take orders, answer menu questions, and confirm reservations on WhatsApp automatically.",
    inboxHint: "Customer orders & questions",
    automationHint: "Menu help · Orders · Table booking",
    connectWhatsApp: "Connect WhatsApp for orders & bookings",
    statLabels: ["Orders automated", "Chats today", "Reservations", "Messages answered"],
    templateKey: "restaurant",
  },
  health: {
    id: "health",
    label: "Clinic & Health",
    tagline: "Appointments & patients",
    primary: "#059669",
    primaryHover: "#047857",
    accent: "#065F46",
    softBg: "#ECFDF5",
    softBorder: "#6EE7B7",
    gradientFrom: "#ECFDF5",
    gradientTo: "#ffffff",
    icon: Stethoscope,
    welcomeTitle: "Your clinic assistant is ready",
    welcomeBody:
      "Patients can ask hours, services, and book appointments on WhatsApp — polite and clear.",
    inboxHint: "Patient messages & bookings",
    automationHint: "FAQ · Appointments · Reminders",
    connectWhatsApp: "Connect WhatsApp for patient chat",
    statLabels: ["Appointments", "Patient chats", "Reminders sent", "Messages handled"],
    templateKey: "clinic",
  },
  salon: {
    id: "salon",
    label: "Salon & Beauty",
    tagline: "Bookings & style",
    primary: "#9333EA",
    primaryHover: "#7E22CE",
    accent: "#6B21A8",
    softBg: "#FAF5FF",
    softBorder: "#D8B4FE",
    gradientFrom: "#FAF5FF",
    gradientTo: "#ffffff",
    icon: Scissors,
    welcomeTitle: "Your salon desk is ready",
    welcomeBody:
      "Clients book slots, ask for services, and get instant replies — you focus on the chair.",
    inboxHint: "Booking requests & style questions",
    automationHint: "Services · Slots · Follow-ups",
    connectWhatsApp: "Connect WhatsApp for client bookings",
    statLabels: ["Bookings today", "Client chats", "Slots filled", "Messages answered"],
    templateKey: "salon",
  },
  ecommerce: {
    id: "ecommerce",
    label: "Online Store",
    tagline: "Shopify & orders",
    primary: "#2563EB",
    primaryHover: "#1D4ED8",
    accent: "#1E3A8A",
    softBg: "#EFF6FF",
    softBorder: "#93C5FD",
    gradientFrom: "#EFF6FF",
    gradientTo: "#ffffff",
    icon: ShoppingBag,
    welcomeTitle: "Your store assistant is ready",
    welcomeBody:
      "Recover carts, answer product questions, and send order updates on WhatsApp.",
    inboxHint: "Shoppers & order questions",
    automationHint: "Cart recovery · Order updates · Support",
    connectWhatsApp: "Connect WhatsApp for shop customers",
    statLabels: ["Cart recoveries", "Orders helped", "Support chats", "Messages sent"],
    templateKey: "ecommerce",
  },
  fitness: {
    id: "fitness",
    label: "Gym & Fitness",
    tagline: "Members & classes",
    primary: "#DC2626",
    primaryHover: "#B91C1C",
    accent: "#991B1B",
    softBg: "#FEF2F2",
    softBorder: "#FCA5A5",
    gradientFrom: "#FEF2F2",
    gradientTo: "#ffffff",
    icon: Dumbbell,
    welcomeTitle: "Your gym desk is ready",
    welcomeBody:
      "Answer membership questions and class times on WhatsApp — keep members engaged.",
    inboxHint: "Member questions & sign-ups",
    automationHint: "Membership · Classes · Reminders",
    connectWhatsApp: "Connect WhatsApp for members",
    statLabels: ["Member chats", "Trials booked", "Classes filled", "Messages answered"],
    templateKey: "restaurant",
  },
  cleaning: {
    id: "cleaning",
    label: "Cleaning Services",
    tagline: "Bookings & staff",
    primary: "#0EA5E9",
    primaryHover: "#0284C7",
    accent: "#0369A1",
    softBg: "#F0F9FF",
    softBorder: "#BAE6FD",
    gradientFrom: "#F0F9FF",
    gradientTo: "#ffffff",
    icon: ShoppingBag, // We can replace with Sparkles or Brush if imported
    welcomeTitle: "Your cleaning desk is ready",
    welcomeBody: "Automate booking confirmations, assign staff, and send reminders on WhatsApp.",
    inboxHint: "Customer bookings & inquiries",
    automationHint: "Bookings · Reminders · Staff Sync",
    connectWhatsApp: "Connect WhatsApp for clients",
    statLabels: ["Bookings today", "Client chats", "Staff assigned", "Messages answered"],
    templateKey: "cleaning",
  },
  construction: {
    id: "construction",
    label: "Construction & Bids",
    tagline: "Projects & quotations",
    primary: "#EAB308",
    primaryHover: "#CA8A04",
    accent: "#A16207",
    softBg: "#FEFCE8",
    softBorder: "#FEF08A",
    gradientFrom: "#FEFCE8",
    gradientTo: "#ffffff",
    icon: Building2, // HardHat if available
    welcomeTitle: "Your construction hub is ready",
    welcomeBody: "Manage client quotations, project updates, and site queries on autopilot.",
    inboxHint: "Client queries & bids",
    automationHint: "Quotations · Updates · Follow-ups",
    connectWhatsApp: "Connect WhatsApp for clients",
    statLabels: ["Active Bids", "Client chats", "Projects active", "Messages handled"],
    templateKey: "construction",
  },
  maintenance: {
    id: "maintenance",
    label: "Maintenance & Repair",
    tagline: "Work orders & fixes",
    primary: "#F97316",
    primaryHover: "#EA580C",
    accent: "#C2410C",
    softBg: "#FFF7ED",
    softBorder: "#FDBA74",
    gradientFrom: "#FFF7ED",
    gradientTo: "#ffffff",
    icon: Scissors, // Wrench if available
    welcomeTitle: "Your maintenance desk is ready",
    welcomeBody: "Receive maintenance requests, dispatch technicians, and update tenants automatically.",
    inboxHint: "Work orders & repair requests",
    automationHint: "Work Orders · Dispatch · Updates",
    connectWhatsApp: "Connect WhatsApp for requests",
    statLabels: ["Open tickets", "Tenant chats", "Dispatches", "Messages answered"],
    templateKey: "maintenance",
  },
  it: {
    id: "it",
    label: "IT & Software",
    tagline: "Tickets & support",
    primary: "#6366F1",
    primaryHover: "#4F46E5",
    accent: "#4338CA",
    softBg: "#EEF2FF",
    softBorder: "#C7D2FE",
    gradientFrom: "#EEF2FF",
    gradientTo: "#ffffff",
    icon: Briefcase, // Monitor if available
    welcomeTitle: "Your IT support desk is ready",
    welcomeBody: "Triage support tickets, answer common tech queries, and escalate on WhatsApp.",
    inboxHint: "Support tickets & tech queries",
    automationHint: "Triage · FAQ · Escalation",
    connectWhatsApp: "Connect WhatsApp for support",
    statLabels: ["Open tickets", "User chats", "Resolved", "Messages answered"],
    templateKey: "it",
  },
  fencing: {
    id: "fencing",
    label: "Fencing Contractors",
    tagline: "Estimates & installs",
    primary: "#10B981",
    primaryHover: "#059669",
    accent: "#047857",
    softBg: "#ECFDF5",
    softBorder: "#6EE7B7",
    gradientFrom: "#ECFDF5",
    gradientTo: "#ffffff",
    icon: Building2, // Fence if available
    welcomeTitle: "Your fencing business is ready",
    welcomeBody: "Provide instant estimates, schedule site visits, and close deals on WhatsApp.",
    inboxHint: "Estimate requests & site visits",
    automationHint: "Estimates · Site visits · Follow-ups",
    connectWhatsApp: "Connect WhatsApp for leads",
    statLabels: ["Estimates sent", "Lead chats", "Visits booked", "Messages handled"],
    templateKey: "fencing",
  },
  general: {
    id: "general",
    label: "General Business",
    tagline: "Leads & support",
    primary: "#0A6BFF",
    primaryHover: "#0958d4",
    accent: "#334155",
    softBg: "#F1F5F9",
    softBorder: "#CBD5E1",
    gradientFrom: "#F1F5F9",
    gradientTo: "#ffffff",
    icon: Briefcase,
    welcomeTitle: "Your business desk is ready",
    welcomeBody:
      "Connect WhatsApp, let AI answer customers, and turn on automations in one place.",
    inboxHint: "All customer conversations",
    automationHint: "Support · Leads · Follow-ups",
    connectWhatsApp: "Connect WhatsApp to start",
    statLabels: ["Automations on", "Chats today", "Leads captured", "Messages handled"],
    templateKey: "real-estate",
  },
};

const ALIASES: Record<string, IndustryId> = {
  "real estate": "real-estate",
  realestate: "real-estate",
  property: "real-estate",
  restaurant: "restaurant",
  cafe: "restaurant",
  food: "restaurant",
  "olive & oak": "restaurant",
  clinic: "health",
  health: "health",
  healthcare: "health",
  "healthcare & wellness": "health",
  medical: "health",
  dentist: "health",
  salon: "salon",
  beauty: "salon",
  spa: "salon",
  "salon & beauty": "salon",
  ecommerce: "ecommerce",
  "e-commerce": "ecommerce",
  shopify: "ecommerce",
  store: "ecommerce",
  fitness: "fitness",
  gym: "fitness",
  cleaning: "cleaning",
  maid: "cleaning",
  construction: "construction",
  builder: "construction",
  contractor: "construction",
  maintenance: "maintenance",
  repair: "maintenance",
  plumbing: "maintenance",
  electrical: "maintenance",
  it: "it",
  software: "it",
  tech: "it",
  fencing: "fencing",
  founder: "general",
  developer: "general",
  operations: "general",
};

export function resolveIndustryId(raw?: string | null): IndustryId {
  if (!raw) return "general";
  const key = raw.toLowerCase().trim();
  if (key in INDUSTRY_PRESETS) return key as IndustryId;
  if (ALIASES[key]) return ALIASES[key];
  for (const preset of Object.values(INDUSTRY_PRESETS)) {
    if (preset.label.toLowerCase() === key) return preset.id;
  }
  return "general";
}

export function getIndustryPreset(raw?: string | null): IndustryPreset {
  return INDUSTRY_PRESETS[resolveIndustryId(raw)];
}

/** Canonical English label stored on workspaces. */
export function normalizeIndustryLabel(raw?: string | null): string {
  return getIndustryPreset(raw).label;
}

export const INDUSTRY_OPTIONS = Object.values(INDUSTRY_PRESETS).filter(
  (p) => p.id !== "general"
);
