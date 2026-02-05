import React from 'react';
import { 
  Heart, Shield, Users, Globe, BookOpen, Home, Utensils, Zap, 
  GraduationCap, Briefcase, Landmark, Handshake, HeartPulse, Brain,
  Sparkles, Star, Award, Leaf, Eye, Target, Scale, ShieldCheck, TrendingUp
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
  { name: 'About Us', id: 'aboutus' },
  { name: 'Global Services', id: 'globalservices' },
  { name: 'Roadmap', id: 'roadmap' },
  { name: 'LUVWATTS', id: 'luvwatts' },
  { name: 'Gallery', id: 'gallery' },
  { name: 'Programs', id: 'programs' },
];

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

export const CORE_VALUES = [
  { title: "Love in Action", description: "Compassion translated into systems, not sentiment" },
  { title: "Human-Centered Impact", description: "People before profit, always" },
  { title: "Equity & Inclusion", description: "Culturally grounded, community-led solutions" },
  { title: "Integrity & Stewardship", description: "Ethical governance, transparency, accountability" },
  { title: "Collaboration", description: "Partnerships over silos" },
  { title: "Innovation for Good", description: "Technology as a tool, not a threat" }
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

export const PARTNERS = [
  "Microsoft", "Amazon", "OpenAI", "Google", "United Nations", "World Health Org", "UNICEF", "Harvard University"
];

export const STATS = [
  { label: "Housing Units", value: "250", suffix: "+", description: "Secure homes established" },
  { label: "Global Reach", value: "1.2", suffix: "M", description: "Engaged in 12 months" },
  { label: "Education", value: "3.5", suffix: "k", description: "Certifications awarded" },
  { label: "Food Security", value: "50", suffix: "k+", description: "Meals served per quarter" },
];

export const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=2000",
    caption: "Feeding the Soul, Restoring Dignity"
  },
  {
    url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=2000",
    caption: "Empowering the Next Generation"
  },
  {
    url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=2000",
    caption: "Global Reach, Individual Impact"
  },
  {
    url: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=2000",
    caption: "Building Communities Together"
  }
];

export const GALLERY_IMAGES = [
  { url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800", title: "Outreach Program" },
  { url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800", title: "Global Mission" },
  { url: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800", title: "Community Education" },
  { url: "https://images.unsplash.com/photo-1524061614234-84496375567e?auto=format&fit=crop&q=80&w=800", title: "Housing Support" },
  { url: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&q=80&w=800", title: "Youth Mentorship" },
  { url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800", title: "Humanitarian Aid" },
  { url: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800", title: "Family Support" },
  { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800", title: "Social Impact" },
  { url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&q=80&w=800", title: "Tech Empowerment" },
];

export const DONOR_PAGE = {
  header: "Invest in Humanity",
  tagline: "Your support drives systems of love and structures of change.",
  different: {
    title: "What Makes Us Different",
    content: "Foundation of Luv bridges advocacy, media, community programs, and ethical technology under one accountable nonprofit structure. We don’t just raise awareness — we build systems that last."
  },
  pillars: [
    { title: "Mental Health & Emotional Wellness", description: "Expanding access to culturally relevant support and education." },
    { title: "Family & Community Stability", description: "Strengthening families as the foundation of resilient communities." },
    { title: "Education & Advocacy", description: "Turning powerful storytelling into real-world action and resources." },
    { title: "Economic Empowerment", description: "Creating pathways to opportunity and self-sufficiency." },
    { title: "Ethical AI & Public Good Innovation", description: "Governing initiatives like World AI Force to ensure technology serves humanity." }
  ],
  approach: [
    "Community-informed program design",
    "Ethical governance and transparency",
    "Strategic partnerships with proven experts",
    "Media and technology used responsibly for public benefit",
    "Measurable outcomes and clear reporting"
  ],
  stewardship: {
    title: "Stewardship & Accountability",
    points: [
      "Independent board governance",
      "Strict conflict-of-interest policies",
      "Transparent financial management",
      "Clear separation from for-profit vendors"
    ],
    closing: "Donor trust is not assumed — it is earned."
  },
  supportMatters: {
    title: "Why Your Support Matters",
    points: [
      "Scalable mental health and family programs",
      "Community education and advocacy initiatives",
      "Ethical oversight of emerging technologies",
      "Long-term solutions instead of short-term relief"
    ]
  },
  promise: {
    title: "Our Promise",
    points: [
      "Every dollar is stewarded with integrity.",
      "Every program is built for real impact.",
      "Every initiative centers humanity first."
    ],
    closing: "Foundation of Luv. Because love deserves structure."
  }
};
