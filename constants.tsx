import React from 'react';
import { 
  Heart, Shield, Users, Globe, BookOpen, Home, Utensils, Zap, 
  GraduationCap, Briefcase, Landmark, Handshake, HeartPulse, Brain,
  Sparkles, Star, Award, Leaf
} from 'lucide-react';

export const COLORS = {
  crimson: '#9c1c22',
  beige: '#fdfaf6',
  cream: '#f9f5f0',
  gold: '#e2a744',
  dark: '#332d2b',
  white: '#ffffff',
  accent: '#df8c3d'
};

export const NAVIGATION = [
  { name: 'Mission', href: '#about' },
  { name: 'Global Services', href: '#services' },
  { name: 'Roadmap', href: '#roadmap' },
  { name: 'LUVWATTS', href: '#luvwatts' },
  { name: 'Programs', href: '#programs' },
];

export const SERVICE_AREAS = [
  { title: "Global Advocacy", description: "International tours and campaigns spreading hope and restoring human dignity.", icon: <Globe className="w-6 h-6" /> },
  { title: "Mental Wellness", description: "Comprehensive mental health support and wraparound recovery services.", icon: <Brain className="w-6 h-6" /> },
  { title: "Family Solidarity", description: "Empowering families through education, counseling, and community workshops.", icon: <Users className="w-6 h-6" /> },
  { title: "Safe Havens", description: "Strategic housing solutions providing security and dignity for the vulnerable.", icon: <Home className="w-6 h-6" /> },
  { title: "Nutrition Equity", description: "Targeted feeding programs ensuring no community is left underserved.", icon: <Utensils className="w-6 h-6" /> },
  { title: "Workforce Readiness", description: "GED prep and high-level certifications for global job market entry.", icon: <GraduationCap className="w-6 h-6" /> },
];

export const STRATEGIC_PHASES = [
  {
    title: "Community Roots",
    years: "Phase 1",
    goals: [
      "Establish brick-and-mortar hubs for family support.",
      "Align feeding/housing with local coalitions.",
      "Launch grassroots trust-building initiatives."
    ],
    outputs: [
      "Serve 5,000+ households annually.",
      "Open 2 major community hubs.",
      "Enroll 500+ in GED programs."
    ]
  },
  {
    title: "Regional Expansion",
    years: "Phase 2",
    goals: [
      "Partner with state health departments on maternal care.",
      "Access state housing trust funds for transitional programs.",
      "Expand workforce skills certification network."
    ],
    outputs: [
      "Secure 3+ state-level grants.",
      "Certify 2,000+ individuals by year end.",
      "Increase housing capacity by 25%."
    ]
  },
  {
    title: "National Scale",
    years: "Phase 3",
    goals: [
      "Secure HUD, SAMHSA, and USDA federal partnerships.",
      "Scale LUVWATTS movement across 10 major states.",
      "Develop career pathways with the Dept of Education."
    ],
    outputs: [
      "Win 5+ federal grant awards.",
      "Reach 100,000 people cumulatively.",
      "Establish nationwide feeding logistics."
    ]
  },
  {
    title: "Global Influence",
    years: "Phase 4",
    goals: [
      "Partner with UN agencies (UNICEF, WHO, UNESCO).",
      "Align with UN Sustainable Development Goals (SDGs).",
      "Launch international LUVWATTS tours and fashion hubs."
    ],
    outputs: [
      "International recognition by UN agencies.",
      "Raise $10M+ for international relief.",
      "Presence in 3+ international territories."
    ]
  }
];

export const PROGRAMS = [
  { name: "First Steps Initiative", description: "Focused parenting and child-raising workshops for new families." },
  { name: "Pathways Project", description: "Bridge to tech certifications and global workforce readiness." },
  { name: "Hope Shelters", description: "Dignified housing solutions for those in transition." },
  { name: "Luv Table", description: "Community-driven food security and nutrition education." },
];

export const PARTNERS = [
  "Microsoft", "Amazon", "OpenAI", "Google", "United Nations", "World Health Org", "UNICEF", "Harvard University"
];

export const STATS = [
  { label: "Housing Units", value: "250", suffix: "+", description: "Secure homes established" },
  { label: "Global Reach", value: "1.2", suffix: "M", description: "Engaged in 12 months" },
  { label: "Education", value: "3.5", suffix: "k", description: "Certifications awarded" },
  { label: "Food Security", value: "50", suffix: "k+", description: "Meals served per quarter" },
];