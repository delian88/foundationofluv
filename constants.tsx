
import React from 'react';
import { 
  Heart, Shield, Users, Globe, BookOpen, Home, Utensils, Zap, 
  GraduationCap, Briefcase, Landmark, Handshake, HeartPulse, Brain
} from 'lucide-react';

export const COLORS = {
  primary: '#8b5cf6', // Violet 500
  secondary: '#ec4899', // Pink 500
  accent: '#f59e0b', // Amber 500
  dark: '#1e1b4b', // Indigo 950
};

export const NAVIGATION = [
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Programs', href: '#programs' },
  { name: 'LUVWATTS', href: '#luvwatts' },
  { name: 'Impact', href: '#impact' },
  { name: 'Roadmap', href: '#roadmap' },
];

export const SERVICE_AREAS = [
  { title: "Motivational Speaking & Global Advocacy", description: "Global tours, books, and awareness campaigns spreading hope and dignity.", icon: <Globe className="w-6 h-6" /> },
  { title: "Community Services", description: "Workshops and trainings for families and kids to strengthen community bonds.", icon: <Users className="w-6 h-6" /> },
  { title: "Wraparound Services", description: "Comprehensive substance abuse and mental health support for holistic recovery.", icon: <Brain className="w-6 h-6" /> },
  { title: "Housing & Shelter", description: "Affordable housing solutions and safe havens for those in transition.", icon: <Home className="w-6 h-6" /> },
  { title: "Feeding Programs", description: "Strategic food drives and nutrition support for underserved communities.", icon: <Utensils className="w-6 h-6" /> },
  { title: "Outreach & Mentorship", description: "Youth empowerment through guidance and dedicated mentorship programs.", icon: <Shield className="w-6 h-6" /> },
  { title: "Family Counseling", description: "Education on parenting, birthing, and child-raising for healthy families.", icon: <HeartPulse className="w-6 h-6" /> },
  { title: "Education & Job Readiness", description: "GED prep, free certifications, and high-level workforce training.", icon: <GraduationCap className="w-6 h-6" /> },
  { title: "Financial Literacy", description: "Building financial inclusion and empowerment specifically for minority women.", icon: <Landmark className="w-6 h-6" /> },
  { title: "Healthcare Advocacy", description: "Promoting awareness and ensuring access to essential healthcare resources.", icon: <Heart className="w-6 h-6" /> },
];

export const PROGRAMS = [
  { name: "Family First Initiative", description: "Comprehensive workshops on parenting, planning, and child-raising." },
  { name: "Pathways to Purpose", description: "GED, job readiness, and certification programs with global tech partners." },
  { name: "Hope Homes", description: "Housing and shelter for displaced and vulnerable individuals." },
  { name: "Nourish with Love", description: "Feeding and nutrition programs across underserved urban communities." },
  { name: "Healing Circles", description: "Specialized wraparound services for mental health and substance abuse." },
  { name: "Women in Wealth", description: "Focused financial literacy and entrepreneurship for minority women." },
  { name: "College Access Project", description: "Preparing youth for higher education with readiness training and scholarships." },
];

export const STRATEGIC_PHASES = [
  {
    title: "Local Engagement",
    years: "Years 1–2",
    goals: [
      "Build grassroots trust and align with city/county priorities.",
      "Partner with school districts and community colleges for job readiness.",
      "Align feeding/housing with local homeless coalitions.",
      "Establish brick-and-mortar hubs for family support."
    ],
    outputs: [
      "Serve 5,000+ households in food/shelter annually.",
      "Launch 2 community hubs.",
      "Enroll 500 youth/adults in GED programs annually."
    ]
  },
  {
    title: "State-Level Engagement",
    years: "Years 1–3",
    goals: [
      "Leverage state funding streams and public-private partnerships.",
      "Align with state health departments on maternal health initiatives.",
      "Access state housing trust funds for transitional programs.",
      "Partner with state universities for technical support."
    ],
    outputs: [
      "Secure 3 state-level grants annually.",
      "Certify 2,000 individuals in workforce skills by Year 3.",
      "Increase housing capacity by 25% statewide."
    ]
  },
  {
    title: "Federal Engagement",
    years: "Years 2–4",
    goals: [
      "Secure federal partnerships (HUD, SAMHSA, USDA, DOE).",
      "Apply for USDA food security grants to expand feeding.",
      "Partner with HHS on Medicaid alignment and child health.",
      "Develop career pathways with the Dept of Education."
    ],
    outputs: [
      "Win 5+ federal grant awards by Year 4.",
      "Expand programs to 10 states.",
      "Serve 100,000 people cumulatively."
    ]
  },
  {
    title: "International Engagement",
    years: "Years 3–5",
    goals: [
      "Partner with UNICEF, WHO, UN Women, and UNESCO.",
      "Align with Sustainable Development Goals (SDGs).",
      "Secure grants from USAID and international agencies.",
      "Expand LUVWATTS movement globally through fashion and tours."
    ],
    outputs: [
      "International recognition by 3 UN agencies.",
      "Raise $10M+ in international grants by Year 5.",
      "Launch programs in 2–3 international countries."
    ]
  }
];

export const PARTNERS = [
  "Microsoft", "Amazon", "OpenAI", "Anthropic", "Google", "Meta", "Harvard", "UNICEF", "WHO"
];

export const STATS = [
  { label: "Housing Impact", value: "20", suffix: "/yr", description: "Temporary housing solutions provided" },
  { label: "Feeding Impact", value: "1000", suffix: "+", description: "Meals served annually" },
  { label: "Education Reach", value: "1200", suffix: "", description: "Certifications/GEDs in 3 years" },
  { label: "Global Outreach", value: "1", suffix: "M+", description: "People engaged annually" },
];
