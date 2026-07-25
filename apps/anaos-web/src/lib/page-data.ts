import { ReactNode } from "react";

export interface PageData {
  slug: string;
  type: "automation" | "industry" | "resource";
  title: string;
  subtitle: string;
  typewriterExamples: string[];
  features: { title: string; desc: string }[];
  benefits: { title: string; desc: string }[];
  ctaText?: string;
  metaDescription?: string;
}

export const pageData: PageData[] = [
  // --- AUTOMATIONS ---
  {
    slug: "whatsapp-lead-responder",
    type: "automation",
    title: "WhatsApp Lead Responder",
    subtitle: "Automatically qualify inbound leads via WhatsApp and sync their data instantly to your CRM or Google Sheets.",
    typewriterExamples: [
      "Set up a WhatsApp bot to ask for budget and timeline...",
      "Qualify leads 24/7 on WhatsApp...",
      "Sync new WhatsApp inquiries directly to my CRM..."
    ],
    features: [
      { title: "Instant Response", desc: "Never miss a lead. Respond within seconds automatically." },
      { title: "Lead Qualification", desc: "Ask custom questions to filter out unqualified leads." },
      { title: "Data Syncing", desc: "Push qualified lead data straight to Google Sheets or your CRM." }
    ],
    benefits: [
      { title: "Increase Conversion Rate", desc: "Speed to lead is crucial. Catch them while they are hot." },
      { title: "Save Hours Daily", desc: "Stop manually copying numbers and answering the same questions." }
    ]
  },
  {
    slug: "abandoned-cart-recoverer",
    type: "automation",
    title: "Abandoned Cart Recoverer",
    subtitle: "Bring back lost sales with automated WhatsApp and SMS checkout reminders tailored for e-commerce.",
    typewriterExamples: [
      "Send a 10% discount to abandoned carts on WhatsApp...",
      "Remind customers about their cart after 1 hour...",
      "Automate cart recovery for my Shopify store..."
    ],
    features: [
      { title: "Multi-Channel Alerts", desc: "Reach customers via SMS and WhatsApp for higher open rates." },
      { title: "Dynamic Discounts", desc: "Offer time-sensitive coupon codes to close the sale." },
      { title: "Direct Checkout Links", desc: "Send them straight back to their pre-filled checkout page." }
    ],
    benefits: [
      { title: "Boost Revenue", desc: "Recover up to 20% of abandoned carts effortlessly." },
      { title: "Zero Manual Effort", desc: "Set it up once and watch the recovered sales roll in." }
    ]
  },
  {
    slug: "google-reviews-collector",
    type: "automation",
    title: "Google Reviews Collector",
    subtitle: "Automatically request 5-star ratings from happy customers after they purchase or visit.",
    typewriterExamples: [
      "Send a review request 2 days after purchase...",
      "Filter out bad reviews and only ask happy clients for Google Reviews...",
      "Automate my reputation management..."
    ],
    features: [
      { title: "Smart Timing", desc: "Trigger review requests exactly when the customer is most satisfied." },
      { title: "Feedback Filtering", desc: "Route negative feedback to support, and positive feedback to Google." },
      { title: "Analytics Tracking", desc: "See exactly how many reviews you generate each month." }
    ],
    benefits: [
      { title: "Improve Local SEO", desc: "More 5-star reviews means higher ranking on Google Maps." },
      { title: "Build Trust", desc: "Social proof drives new customers to choose you over competitors." }
    ]
  },
  {
    slug: "ai-helpdesk-support-bot",
    type: "automation",
    title: "AI Helpdesk Support Bot",
    subtitle: "Provide 24/7 automated FAQ responses on WhatsApp, powered by AI trained on your own data.",
    typewriterExamples: [
      "Train a support bot on my website's FAQ...",
      "Answer customer queries on WhatsApp instantly...",
      "Set up an AI agent for my customer support..."
    ],
    features: [
      { title: "Custom Knowledge Base", desc: "Upload your PDFs, URLs, and docs to train your AI." },
      { title: "Human Handoff", desc: "Automatically route complex questions to a live agent." },
      { title: "24/7 Availability", desc: "Provide instant answers to your customers, day or night." }
    ],
    benefits: [
      { title: "Reduce Support Costs", desc: "Deflect up to 70% of repetitive customer inquiries." },
      { title: "Higher Satisfaction", desc: "Customers love getting immediate answers." }
    ]
  },
  {
    slug: "billing-stripe-sync",
    type: "automation",
    title: "Billing & Stripe Sync",
    subtitle: "Automatically generate and send PDF invoices to paid clients via email or WhatsApp.",
    typewriterExamples: [
      "Send a PDF invoice when a Stripe payment succeeds...",
      "Automate billing receipts for my agency...",
      "Sync my payments to Quickbooks automatically..."
    ],
    features: [
      { title: "Instant Invoicing", desc: "Generate beautifully formatted PDFs the moment a payment clears." },
      { title: "Multi-Platform Sync", desc: "Connects with Stripe, PayPal, and your accounting software." },
      { title: "Failed Payment Alerts", desc: "Notify customers automatically if their card declines." }
    ],
    benefits: [
      { title: "Get Paid Faster", desc: "Streamline your accounts receivable process." },
      { title: "Professional Image", desc: "Send branded, accurate invoices every single time." }
    ]
  },
  {
    slug: "appointment-reminders",
    type: "automation",
    title: "Appointment Reminders",
    subtitle: "Reduce no-shows drastically with automated scheduling alerts and confirmations.",
    typewriterExamples: [
      "Send a WhatsApp reminder 24 hours before a booking...",
      "Automate calendar confirmations for my clinic...",
      "Allow clients to reschedule via SMS..."
    ],
    features: [
      { title: "Calendar Integration", desc: "Syncs natively with Google Calendar, Calendly, and more." },
      { title: "Two-Way Confirmations", desc: "Clients can reply 'YES' to confirm or easily reschedule." },
      { title: "Customizable Timing", desc: "Send reminders 24 hours, 1 hour, or 15 minutes before." }
    ],
    benefits: [
      { title: "Eliminate No-Shows", desc: "Keep your calendar full and your staff busy." },
      { title: "Better Client Experience", desc: "Help your clients remember their important commitments." }
    ]
  },

  // --- INDUSTRIES ---
  {
    slug: "e-commerce-and-retail",
    type: "industry",
    title: "E-commerce & Retail OS",
    subtitle: "End-to-end automation tailored for online stores. Recover carts, answer FAQs, and boost reviews.",
    typewriterExamples: [
      "Build an automation stack for my Shopify store...",
      "Set up cart recovery and order tracking...",
      "Automate customer support for my retail brand..."
    ],
    features: [
      { title: "Shopify Native", desc: "Deep integrations with your e-commerce backend." },
      { title: "Order Tracking Bots", desc: "Let customers check their order status via WhatsApp." },
      { title: "Post-Purchase Flows", desc: "Upsell and gather reviews automatically." }
    ],
    benefits: [
      { title: "Scale Without Extra Headcount", desc: "Handle 10x the order volume without hiring more support staff." },
      { title: "Maximize LTV", desc: "Keep customers coming back with automated engagement." }
    ]
  },
  {
    slug: "real-estate-and-agencies",
    type: "industry",
    title: "Real Estate & Agencies OS",
    subtitle: "Capture property leads, prequalify buyers, and automatically schedule viewings.",
    typewriterExamples: [
      "Automate lead follow-up for my real estate agency...",
      "Set up a bot to qualify buyers and book viewings...",
      "Sync Facebook Lead Ads to my CRM instantly..."
    ],
    features: [
      { title: "Lead Ad Sync", desc: "Pull leads from Facebook/Instagram instantly." },
      { title: "Automated Prequalification", desc: "Ask for budget, timeline, and location preferences." },
      { title: "Viewing Scheduler", desc: "Allow qualified leads to book directly on your calendar." }
    ],
    benefits: [
      { title: "Close Deals Faster", desc: "Engage leads in seconds while they are still looking at properties." },
      { title: "Focus on Selling", desc: "Stop chasing unqualified leads and focus on high-intent buyers." }
    ]
  },
  {
    slug: "healthcare-and-wellness",
    type: "industry",
    title: "Healthcare & Wellness OS",
    subtitle: "Automate patient onboarding, appointment reminders, and followup care campaigns.",
    typewriterExamples: [
      "Set up appointment reminders for my dental clinic...",
      "Automate patient intake forms and scheduling...",
      "Build a booking system for my wellness spa..."
    ],
    features: [
      { title: "HIPAA Compliant Options", desc: "Securely handle patient data and communications." },
      { title: "Intake Form Automation", desc: "Collect necessary information before they walk in the door." },
      { title: "Reactivation Campaigns", desc: "Automatically reach out to patients due for a checkup." }
    ],
    benefits: [
      { title: "Reduce Wait Times", desc: "Streamlined intake means a smoother lobby experience." },
      { title: "Boost Clinic Revenue", desc: "Fill empty slots and reduce costly no-shows." }
    ]
  },
  {
    slug: "restaurants-and-food",
    type: "industry",
    title: "Restaurants & Food OS",
    subtitle: "Digitize interactive menus, automate table bookings, and handle takeout orders via AI.",
    typewriterExamples: [
      "Build a WhatsApp ordering bot for my restaurant...",
      "Automate table reservations and send confirmations...",
      "Set up a digital menu and loyalty program..."
    ],
    features: [
      { title: "WhatsApp Ordering", desc: "Let customers order directly through a conversational interface." },
      { title: "Reservation Management", desc: "Automatically book tables and prevent double-booking." },
      { title: "Loyalty Integration", desc: "Track points and send special offers to regulars." }
    ],
    benefits: [
      { title: "Lower Commission Fees", desc: "Take direct orders instead of relying on expensive delivery apps." },
      { title: "Enhanced Dining Experience", desc: "Free up your staff to focus on hospitality, not the phone." }
    ]
  },
  {
    slug: "logistics-and-dispatch",
    type: "industry",
    title: "Logistics & Dispatch OS",
    subtitle: "Keep operations moving with instant shipping alerts, dispatch notifications, and invoicing.",
    typewriterExamples: [
      "Automate dispatch notifications for my trucking fleet...",
      "Set up delivery tracking updates via SMS...",
      "Build a proof-of-delivery workflow..."
    ],
    features: [
      { title: "Driver Dispatch Alerts", desc: "Instantly notify drivers of new routes or changes." },
      { title: "Live Customer Updates", desc: "Send ETA and delivery confirmations automatically." },
      { title: "Proof of Delivery", desc: "Collect signatures and photos and sync them to your CRM." }
    ],
    benefits: [
      { title: "Reduce Support Calls", desc: "Customers know exactly where their deliveries are." },
      { title: "Streamline Operations", desc: "Eliminate manual dispatching and paperwork." }
    ]
  },
  {
    slug: "saas-and-tech-startups",
    type: "industry",
    title: "SaaS & Tech Startups OS",
    subtitle: "Automate user onboarding, churn prevention, and complex webhook routing.",
    typewriterExamples: [
      "Build an onboarding email sequence for my SaaS...",
      "Trigger a webhook when a user upgrades their plan...",
      "Set up an automated churn recovery campaign..."
    ],
    features: [
      { title: "Product Analytics Sync", desc: "Trigger workflows based on user behavior in your app." },
      { title: "Custom Webhooks", desc: "Connect AnaOS to your proprietary backend seamlessly." },
      { title: "Drip Campaigns", desc: "Educate and activate new users over time." }
    ],
    benefits: [
      { title: "Increase Activation", desc: "Guide users to their 'Aha!' moment automatically." },
      { title: "Reduce Churn", desc: "Identify slipping users and intervene before they cancel." }
    ]
  },

  // --- RESOURCES ---
  {
    slug: "documentation",
    type: "resource",
    title: "Documentation",
    subtitle: "Learn how to build, deploy, and scale your automated operations with our comprehensive guides.",
    typewriterExamples: [
      "Show me how to connect a custom webhook...",
      "Find the guide on setting up Twilio SMS...",
      "How do I use conditional logic in my workflows?..."
    ],
    features: [
      { title: "Step-by-Step Guides", desc: "Follow along with detailed tutorials for every feature." },
      { title: "Video Walkthroughs", desc: "Watch our experts build complex workflows from scratch." },
      { title: "Best Practices", desc: "Learn the optimal way to structure your automations for scale." }
    ],
    benefits: [
      { title: "Faster Onboarding", desc: "Get your first workflow running in minutes, not days." },
      { title: "Master the Platform", desc: "Unlock advanced capabilities you didn't know existed." }
    ],
    ctaText: "Read the Docs"
  },
  {
    slug: "api-reference",
    type: "resource",
    title: "API Reference",
    subtitle: "Integrate AnaOS deeply into your own systems using our RESTful API.",
    typewriterExamples: [
      "Look up the endpoint for triggering a workflow...",
      "Find the authentication specs for the AnaOS API...",
      "How do I fetch workflow execution logs via API?..."
    ],
    features: [
      { title: "Comprehensive Endpoints", desc: "Control every aspect of your workspaces programmatically." },
      { title: "Secure Authentication", desc: "Use API keys with granular permission scoping." },
      { title: "High Rate Limits", desc: "Built to handle enterprise-grade request volumes." }
    ],
    benefits: [
      { title: "Total Flexibility", desc: "Build custom interfaces or integrate with legacy systems." },
      { title: "Developer Friendly", desc: "Clear requests, responses, and error codes." }
    ],
    ctaText: "View API Docs"
  },
  {
    slug: "templates",
    type: "resource",
    title: "Automation Templates",
    subtitle: "Don't start from scratch. Clone proven, high-converting workflows in one click.",
    typewriterExamples: [
      "Find a template for Shopify cart recovery...",
      "Browse real estate lead qualification workflows...",
      "Look up the best customer support AI template..."
    ],
    features: [
      { title: "100+ Ready-to-Use Templates", desc: "Covering every major industry and use case." },
      { title: "Easily Customizable", desc: "Clone a template and tweak it to fit your exact needs." },
      { title: "Community Contributions", desc: "Access workflows built by top automation experts." }
    ],
    benefits: [
      { title: "Save Massive Time", desc: "Skip the building phase and go straight to testing." },
      { title: "Proven Results", desc: "Use strategies that are already working for other businesses." }
    ],
    ctaText: "Browse Templates"
  },
  {
    slug: "help-center",
    type: "resource",
    title: "Help Center",
    subtitle: "Get answers quickly. Search FAQs, troubleshoot issues, or contact our support team.",
    typewriterExamples: [
      "How do I reset my password?...",
      "Why did my workflow execution fail?...",
      "Contact support regarding billing issues..."
    ],
    features: [
      { title: "Extensive Knowledge Base", desc: "Search through hundreds of answered questions." },
      { title: "Live Chat Support", desc: "Get real-time help from our automation specialists." },
      { title: "Community Forums", desc: "Ask questions and get help from other AnaOS users." }
    ],
    benefits: [
      { title: "Resolve Issues Fast", desc: "Minimize downtime and keep your operations running." },
      { title: "Expert Assistance", desc: "Never feel stuck with our dedicated support team." }
    ],
    ctaText: "Visit Help Center"
  }
];

export function getPageData(slug: string): PageData | undefined {
  return pageData.find(p => p.slug === slug);
}
