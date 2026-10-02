/** Site configuration — set via VITE_* env vars at build time (see .env.example). */
const env = import.meta.env;

export const APP_URL = (env.VITE_APP_URL || "https://saas-bharatrailgo-front.vercel.app").replace(/\/+$/, "");
export const API_URL = (env.VITE_API_URL || "https://saas-bharatrailgo-back.onrender.com/api").replace(/\/+$/, "");
export const SITE_URL = (env.VITE_SITE_URL || "https://saas-bharat-rail-go-web.vercel.app").replace(/\/+$/, "");
// Placeholder — replace with the real support address before launch.
export const CONTACT_EMAIL = env.VITE_CONTACT_EMAIL || "hello@bharatrailgo.in";
/** Named in the Privacy Policy (DPDP Act 2023). */
export const GRIEVANCE_OFFICER = env.VITE_GRIEVANCE_OFFICER || "Grievance Officer, BharatRailGo";
export const WHATSAPP = (env.VITE_WHATSAPP || "").replace(/\D/g, "");

export const signupUrl = (plan?: string) => `${APP_URL}/signup${plan ? `?plan=${encodeURIComponent(plan)}` : ""}`;
export const loginUrl = `${APP_URL}/login`;

export interface Plan {
  id: string;
  code: string;
  name: string;
  description?: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  limits: { maxUsers: number | null; maxBranches: number | null; maxBookingsPerMonth: number | null };
  isFeatured?: boolean;
  sortOrder?: number;
}

/** Shown when the live price list cannot be fetched. Keep in step with the backend defaults. */
export const FALLBACK_PLANS: Plan[] = [
  {
    id: "starter",
    code: "starter",
    name: "Starter",
    description: "Single-office agents",
    priceMonthly: 999,
    priceYearly: 9990,
    features: ["Bilti, GST invoices, ledger"],
    limits: { maxUsers: 3, maxBranches: 1, maxBookingsPerMonth: 1500 },
    sortOrder: 1,
  },
  {
    id: "growth",
    code: "growth",
    name: "Growth",
    description: "Growing agencies with a godown team",
    priceMonthly: 2499,
    priceYearly: 24990,
    features: ["SMS status updates"],
    limits: { maxUsers: 10, maxBranches: 3, maxBookingsPerMonth: 6000 },
    isFeatured: true,
    sortOrder: 2,
  },
  {
    id: "pro",
    code: "pro",
    name: "Pro",
    description: "Multi-city agencies",
    priceMonthly: 4999,
    priceYearly: 49990,
    features: ["Priority support"],
    limits: { maxUsers: 30, maxBranches: 10, maxBookingsPerMonth: null },
    sortOrder: 3,
  },
];

export const FEATURES = [
  {
    title: "Book a parcel in one line",
    body: "Type NDLS 3pkg 60kg Ramesh topay — BharatRailGo fills the whole booking and prices it from your rate card.",
    code: "NDLS 3pkg 60kg Ramesh topay",
  },
  {
    title: "Bilti with your name on it",
    body: "Print or WhatsApp a bilti carrying your logo, colours and numbering. Consignees get status SMS as it moves.",
  },
  {
    title: "Pure-agent GST invoices",
    body: "Railway freight you paid on the party's behalf stays non-taxable; CGST/SGST or IGST apply only to your service charges.",
  },
  {
    title: "Collections that add up",
    body: "Every payment is allocated to the oldest open bookings automatically. Each party's ledger shows exactly what is due.",
  },
  {
    title: "Branches and staff roles",
    body: "Owner, manager and staff logins. Branch staff see only their branch; you see everything — or pick one branch.",
  },
  {
    title: "The departure board",
    body: "Today's bookings by destination, money in and out, loading lists by train — plus daily, outstanding, station and GST reports in Excel.",
  },
  {
    title: "Phone, web and Windows",
    body: "The same account on an Android phone at the platform, a laptop in the office and a Windows PC at the godown.",
  },
];

export const STEPS = [
  { n: "01", title: "Create your agency", body: "Name, GSTIN and office address. Your head office, station list and numbering are set up for you." },
  { n: "02", title: "Add your parties and rates", body: "Enter customers once, set freight and hamali rates, add your staff and branches." },
  { n: "03", title: "Start booking", body: "Book parcels, print bilti, raise GST bills and record collections from day one." },
];

export const FAQ = [
  {
    q: "Is there a free trial?",
    a: "Yes — 14 days with every feature. No card is needed to start. We review each new agency before activating it, usually within one working day.",
  },
  {
    q: "Does it handle GST correctly for parcel agents?",
    a: "Yes. Invoices follow the pure-agent method: railway freight paid on the party's behalf is shown separately and not taxed, and GST is charged only on your own service charges.",
  },
  {
    q: "Can my staff use it on their phones?",
    a: "Yes. Staff sign in with their own login on Android or in any browser. You decide whether they are managers or branch staff.",
  },
  {
    q: "What happens to my data if I stop paying?",
    a: "Nothing is deleted. After the grace period the account becomes read-only: you can still view and export everything. The owner can also email a full backup at any time.",
  },
  {
    q: "How do I pay?",
    a: "Pay monthly or yearly by UPI, card or netbanking, or switch on autopay. Prices are plus 18% GST and you receive a GST invoice for every payment.",
  },
  {
    q: "Can I move my old data from Excel or Tally?",
    a: "Yes — contact us and we will help import your parties and opening balances.",
  },
];

export const BOARD_ROWS = [
  ["12951", "NDLS", "24", "LOADED"],
  ["12137", "CSMT", "08", "ON TIME"],
  ["22691", "SBC", "15", "BOOKED"],
  ["12859", "HWH", "31", "IN TRANSIT"],
  ["12627", "MAS", "12", "DELIVERED"],
  ["12301", "LKO", "19", "LOADED"],
  ["19019", "ADI", "07", "BOOKED"],
  ["12809", "PUNE", "22", "IN TRANSIT"],
];
