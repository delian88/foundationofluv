import React from 'react';
import { 
  Heart, Shield, Users, Globe, BookOpen, Home, Utensils, Zap, 
  GraduationCap, Briefcase, Landmark, Handshake, HeartPulse, Brain,
  Sparkles, Star, Award, Leaf, Eye, Target, Scale, ShieldCheck, TrendingUp,
  AlertCircle, Building2, Lightbulb, Users2, Workflow, Recycle, Activity
} from 'lucide-react';

export const COLORS = {
  crimson: '#9c1c22', // Primary Red
  gold: '#eeb053',    // Primary Yellow/Gold
  white: '#ffffff',   // Primary White
  beige: '#fdfaf6',   // Soft background
  cream: '#f9f5f0',   // Secondary background
  dark: '#1a1a1a',    // Dark for readability
  accent: '#df8c3d'   // Complementary Orange-Red
};

export const NAVIGATION = [
  { name: 'About Us', id: 'aboutus' },
  { name: 'Global Services', id: 'globalservices' },
  { name: 'Roadmap', id: 'roadmap' },
  { name: 'LUVWATTS', id: 'luvwatts' },
  { name: 'Gallery', id: 'gallery' },
  { name: 'Programs', id: 'programs' },
];

export const LUV_ACT_PROGRAMS = [
  {
    id: "01",
    title: "Family First Initiative",
    description: "Workshops on parenting, planning, and child-raising.",
    color: "#9c1c22"
  },
  {
    id: "02",
    title: "Pathways to Purpose",
    description: "GED, job readiness, and certification programs with global partners.",
    color: "#9c1c22"
  },
  {
    id: "03",
    title: "Hope Homes",
    description: "Housing and shelter for displaced and vulnerable individuals.",
    color: "#9c1c22"
  },
  {
    id: "04",
    title: "Nourish with Love",
    description: "Feeding and nutrition programs in underserved communities.",
    color: "#eeb053"
  },
  {
    id: "05",
    title: "Healing Circles",
    description: "Wraparound services for substance abuse and mental health.",
    color: "#eeb053"
  },
  {
    id: "06",
    title: "Women in Wealth",
    description: "Financial literacy & entrepreneurship for minority women.",
    color: "#eeb053"
  },
  {
    id: "07",
    title: "College Access Project",
    description: "Preparing youth for college readiness and scholarships.",
    color: "#eeb053"
  }
];

export const LEADERSHIP_MESSAGE = {
  title: "A Message from Our Leadership",
  content: "At Foundation of Luv, we don't just see numbers; we see faces. We see families who need a hand up, children who deserve an education, and communities that require restoration. Our '7 Luv Act' isn't just a program—it's a promise to institutionalize compassion in everything we do.",
  author: "Leadership Council",
  tagline: "Building a Legacy of restoration."
};

export const LUVWATTS_CONTENT = {
  title: "The LUVWATTS Movement",
  description: "LUVWATTS represents the radiant energy of love when people come together. It embodies the heartbeat of the Foundation of Love—our movement, our community, and our voice.",
  acronym: [
    { letter: "L", term: "Light", definition: "Illuminating paths of restoration for those in darkness." },
    { letter: "U", term: "Unity", definition: "Forging unbreakable community bonds across divides." },
    { letter: "V", term: "Velocity", definition: "Accelerating the pace of social and human progress." },
    { letter: "W", term: "Wisdom", definition: "Educating and empowering through shared knowledge." },
    { letter: "A", term: "Action", definition: "Translating compassion into concrete systems of support." },
    { letter: "T", term: "Truth", definition: "Operating with radical transparency and ethical integrity." },
    { letter: "T", term: "Transformation", definition: "Creating sustainable, long-term generational change." },
    { letter: "S", term: "Stewardship", definition: "Responsible governance of resources for the public good." }
  ]
};

export const MISSION_VISION = {
  mission: {
    title: "Mission",
    content: "To uplift individuals and communities through compassion-driven programs that strengthen mental health, families, education, economic opportunity, and ethical innovation.",
    icon: <Target className="w-8 h-8" />
  },
  vision: {
    title: "Vision",
    content: "A world where every person has access to support systems that honor their humanity, protect their dignity, and empower their future.",
    icon: <Eye className="w-8 h-8" />
  }
};

export const GLOBAL_SERVICES_DATA = [
  {
    title: "Mental Wellness Advocacy",
    description: "Culturally relevant support networks and trauma-informed resources designed to restore psychological resilience.",
    icon: <Brain />,
    features: ["Community workshops", "Digital wellness tools", "Professional referral networks"]
  },
  {
    title: "Family Integrity Programs",
    description: "Strengthening the core unit of society through education, conflict resolution, and shared growth.",
    icon: <Users />,
    features: ["Parenting workshops", "Intergenerational mentorship", "Conflict mediation"]
  },
  {
    title: "Economic Participation",
    description: "Bridging the wealth gap through financial literacy and workforce readiness in emerging markets.",
    icon: <TrendingUp />,
    features: ["Job readiness training", "Financial literacy", "Minority entrepreneur support"]
  },
  {
    title: "Ethical Technology Governance",
    description: "Providing a moral compass for emerging technologies like AI to ensure they serve the public good.",
    icon: <Workflow />,
    features: ["AI safety research", "Human-centered tech pilots", "Public awareness campaigns"]
  },
  {
    title: "Humanitarian Logistics",
    description: "Large-scale distribution of basic needs including food security and secure housing solutions.",
    icon: <ShieldCheck />,
    features: ["Food security systems", "Safe haven housing", "Disaster relief support"]
  },
  {
    title: "Education & Literacy",
    description: "Empowering the next generation with the tools needed for academic and professional success.",
    icon: <GraduationCap />,
    features: ["GED preparation", "College readiness", "Digital literacy"]
  }
];

export const STRATEGIC_PHASES = [
  {
    title: "Foundational Roots",
    years: "Phase 1: Establishing the Core",
    goals: ["Launch the 7 Luv Acts in primary hubs.", "Secure initial state and regional partnerships.", "Establish the FOL Ethical Technology board."],
    outputs: ["5,000 households served.", "2 major community hubs active.", "500+ GED certifications."]
  },
  {
    title: "Scaling the Pulse",
    years: "Phase 2: National Resonance",
    goals: ["Expand service centers to 10 major states.", "Implement the LUVWATTS energy model nationwide.", "Forge federal departmental alliances (HUD, USDA)."],
    outputs: ["25,000 individuals served annually.", "10,000 workforce certifications.", "50+ partner coalitions."]
  },
  {
    title: "Global Restoration",
    years: "Phase 3: International Movement",
    goals: ["Extend humanitarian logistics to international partners.", "Standardize FOL ethical AI governance globally.", "Achieve sustainable global endowment for public good."],
    outputs: ["1M+ global reach.", "Worldwide advocacy chapters established.", "Generational systems of support realized."]
  }
];

export const GALLERY_IMAGES = [
  { url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800", title: "Outreach 2024" },
  { url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800", title: "Global Support" },
  { url: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800", title: "Community Hub" },
  { url: "https://images.unsplash.com/photo-1524061614234-84496375567e?auto=format&fit=crop&q=80&w=800", title: "Housing Progress" },
  { url: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&q=80&w=800", title: "Youth Mentorship" },
  { url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800", title: "Humanitarian Aid" },
  { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800", title: "Community Shoe Drive" },
  { url: "https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&q=80&w=800", title: "LUVWATTS Movement" }
];

export const HERO_IMAGES = [
  { url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=2000", caption: "Feeding the Soul, Restoring Dignity" },
  { url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=2000", caption: "Empowering the Next Generation" }
];

export const STATS = [
  { label: "Housing Units", value: "250", suffix: "+", description: "Secure homes established" },
  { label: "Global Reach", value: "1.2", suffix: "M", description: "Engaged in 12 months" },
  { label: "Education", value: "3.5", suffix: "k", description: "Certifications awarded" },
  { label: "Food Security", value: "50", suffix: "k+", description: "Meals served per quarter" },
];

// Detailed About Section Content
export const DETAILED_ABOUT = {
  header: "Engineering Pathways to Human Dignity",
  dualRole: {
    intro: "Foundation of Love (FOL) serves as both a sanctuary and a catalyst.",
    points: [
      "A Sanctuary: Providing immediate relief through the 7 Luv Acts.",
      "A Catalyst: Driving systemic change through ethical tech and policy advocacy.",
      "A Movement: Restoring human dignity through structured compassion."
    ]
  },
  problemStatement: {
    crises: [
      "Systemic Poverty & Inequity",
      "Mental Health Crisis",
      "Educational Gaps",
      "Technological Misalignment",
      "Family Fragmentation"
    ]
  },
  values: [
    { title: "Dignity", description: "Every individual is inherently valuable and deserves respect." },
    { title: "Integrity", description: "Operating with radical transparency and ethical consistency." },
    { title: "Innovation", description: "Leveraging technology and creativity for social good." }
  ],
  closing: {
    quote: "Compassion is not an emotion; it is a system of action.",
    tagline: "The Pulse of Restoration"
  }
};

// Donor Section Content
export const DONOR_PAGE_CONTENT = {
  different: {
    content: "Your contribution fuels a movement designed for sustainable, long-term generational impact."
  },
  impactPillars: [
    { title: "Direct Relief", description: "Immediate access to food, housing, and essentials." },
    { title: "Education", description: "Funding GED programs and collegiate pathways." },
    { title: "Wellness", description: "Providing critical mental health support services." }
  ],
  promise: {
    points: [
      "100% Transparency in allocation.",
      "Direct Impact on local communities.",
      "Sustained support for long-term growth."
    ],
    tagline: "Building a Legacy Together"
  }
};
