import React from 'react';
import { 
  Heart, Shield, Users, Globe, BookOpen, Home, Utensils, Zap, 
  GraduationCap, Briefcase, Landmark, Handshake, HeartPulse, Brain,
  Sparkles, Star, Award, Leaf, Eye, Target, Scale, ShieldCheck, TrendingUp,
  AlertCircle, Building2, Lightbulb, Users2, Workflow, Recycle, Activity,
  PenTool, CheckCircle2, MessageSquare, Newspaper, Compass, Anchor,
  Mic2, Crosshair, UsersRound, Baby, Wallet, Stethoscope, MapPin, Search,
  Cpu, Newspaper as MediaIcon, ShieldAlert
} from 'lucide-react';

export const COLORS = {
  crimson: '#9c1c22', 
  gold: '#eeb053',    
  white: '#ffffff',   
  beige: '#fdfaf6',   
  cream: '#f9f5f0',   
  dark: '#1a1a1a',    
  accent: '#df8c3d'   
};

export const NAVIGATION = [
  { name: 'About Us', id: 'aboutus' },
  { name: 'Global Services', id: 'globalservices' },
  { name: 'Roadmap', id: 'roadmap' },
  { name: 'LUVWATTS', id: 'luvwatts' },
  { name: 'Gallery', id: 'gallery' },
  { name: 'Programs', id: 'programs' },
  { name: 'Contact Us', id: 'contact' },
];

export const LUV_ACT_PROGRAMS = [
  {
    id: "01",
    title: "Family First Initiative",
    description: "Workshops on parenting, planning, and child-raising. Strengthening the nuclear and extended family unit.",
    color: "#9c1c22"
  },
  {
    id: "02",
    title: "Pathways to Purpose",
    description: "GED, job readiness, and certification programs with global partners to secure economic futures.",
    color: "#9c1c22"
  },
  {
    id: "03",
    title: "Hope Homes",
    description: "Housing and shelter for displaced and vulnerable individuals. Building secure havens for restoration.",
    color: "#9c1c22"
  },
  {
    id: "04",
    title: "Nourish with Love",
    description: "Feeding and nutrition programs in underserved communities. Ensuring no stomach goes empty.",
    color: "#eeb053"
  },
  {
    id: "05",
    title: "Healing Circles",
    description: "Wraparound services for substance abuse and mental health. A holistic approach to recovery.",
    color: "#eeb053"
  },
  {
    id: "06",
    title: "Women in Wealth",
    description: "Financial literacy & entrepreneurship for minority women. Empowering the matriarchs of our society.",
    color: "#eeb053"
  },
  {
    id: "07",
    title: "College Access Project",
    description: "Preparing youth for college readiness and scholarships. Opening doors to higher education.",
    color: "#eeb053"
  }
];

export const LEADERSHIP_MESSAGE = {
  title: "A Message from Our Leadership",
  content: "At Foundation of Luv, we don't just see numbers; we see faces. We see families who need a hand up, children who deserve an education, and communities that require restoration. Our '7 Luv Act' isn't just a program—it's a promise to institutionalize compassion in everything we do. We are bridging the gap between awareness and sustainable systems.",
  author: "Leadership Council",
  tagline: "Building a Legacy of restoration."
};

export const LUVWATTS_CONTENT = {
  title: "The LUVWATTS Movement",
  description: "LUVWATTS represents the radiant energy of love when people come together. It is the kinetic pulse of restoration, engineering pathways where human dignity is an unshakeable reality.",
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
    icon: <Target className="w-12 h-12 text-[#9c1c22]" />
  },
  vision: {
    title: "Vision",
    content: "A world where every person has access to support systems that honor their humanity, protect their dignity, and empower their future.",
    icon: <Eye className="w-12 h-12 text-[#eeb053]" />
  }
};

export const CORE_VALUES = [
  { term: "Love in Action", definition: "Compassion translated into systems, not sentiment" },
  { term: "Human-Centered Impact", definition: "People before profit, always" },
  { term: "Equity & Inclusion", definition: "Culturally grounded, community-led solutions" },
  { term: "Integrity & Stewardship", definition: "Ethical governance, transparency, accountability" },
  { term: "Collaboration", definition: "Partnerships over silos" },
  { term: "Innovation for Good", definition: "Technology as a tool, not a threat" }
];

export const GLOBAL_SERVICES_DATA = [
  {
    title: "Motivational Speaking & Global Advocacy",
    description: "Global tours, books, and awareness campaigns that spread hope and awareness.",
    icon: <Mic2 size={32} />,
    features: ["Global Tours", "Educational Books", "Awareness Campaigns"]
  },
  {
    title: "Community Services",
    description: "Direct empowerment through workshops and specialized trainings for families and kids.",
    icon: <UsersRound size={32} />,
    features: ["Family Workshops", "Youth Training", "Capacity Building"]
  },
  {
    title: "Mental Wellness & Wraparound Services",
    description: "Culturally relevant support networks and trauma-informed resources designed to restore psychological resilience.",
    icon: <Brain size={32} />,
    features: ["Substance Abuse Support", "Mental Health Resources", "Trauma-Informed Care"]
  },
  {
    title: "Housing & Shelter",
    description: "Providing affordable housing solutions and safe havens for displaced and vulnerable individuals.",
    icon: <Building2 size={32} />,
    features: ["Affordable Housing", "Transitional Shelters", "Safe Havens"]
  },
  {
    title: "Feeding & Nutrition",
    description: "Large-scale food drives and nutritional support to ensure no community goes hungry.",
    icon: <Utensils size={32} />,
    features: ["Food Security Systems", "Nutrition Education", "Community Drives"]
  },
  {
    title: "Outreach & Mentorship",
    description: "Empowering the next generation with guidance, professional skills, and purposeful pathways.",
    icon: <GraduationCap size={32} />,
    features: ["Youth Mentorship", "GED Preparation", "Career Pathways"]
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

export const VIDEO_RESOURCES = [
  { 
    id: "7-4W_0Uu648", 
    title: "Foundation of Love Impact", 
    description: "Witness the stories of transformation and the kinetic pulse of our global outreach efforts."
  }
];

export const HERO_IMAGES = [
  { url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=2000", caption: "Feeding the Soul, Restoring Dignity" },
  { url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=2000", caption: "Empowering the Next Generation" }
];

export const STATS = [
  { label: "Annual Housing", value: "20", suffix: "", description: "Temporary solutions" },
  { label: "Community Meals", value: "1000", suffix: "+", description: "Served yearly" },
  { label: "Workforce Readiness", value: "1200", suffix: "", description: "Certifications in 3 years" },
  { label: "Advocacy Reach", value: "1", suffix: "M+", description: "People engaged annually" },
];

export const DETAILED_ABOUT = {
  header: "Foundation of Luv (FOL)",
  intro: "Foundation of Luv serves as both: A direct-impact organization delivering programs and interventions, and a holding, stewardship, and governance body for public-good initiatives that cannot legally or ethically sit under for-profit entities. Through strategic collaboration with Azariah Management Group (AMG) and its creative and technical arms, FoL transforms advocacy into action, and awareness into sustainable systems of support.",
  problemStatement: {
    title: "The Problem Statement",
    summary: "Across communities in the U.S. and globally, we are seeing a convergence of crises. Existing solutions are often fragmented: Nonprofits lack scalable infrastructure and media reach, tech solutions lack human-centered governance, and advocacy campaigns stop at storytelling, without systems change. Foundation of Luv exists to bridge these gaps.",
    crises: [
      "Rising mental health challenges among adults, parents, and youth",
      "Breakdown of family support systems and community cohesion",
      "Economic exclusion of marginalized groups",
      "Limited access to culturally relevant education and advocacy resources",
      "Rapid technological advancement without adequate ethical safeguards",
      "Advocacy content that raises awareness but lacks follow-through impact"
    ]
  },
  purpose: {
    title: "Organizational Purpose & Role",
    programmatic: [
      "Mental health and family support initiatives",
      "Community education and advocacy",
      "Youth mentorship and leadership development",
      "Social impact pilots and research"
    ],
    stewardship: [
      "Nonprofit governance for World AI Force (as a public good initiative)",
      "Future advocacy-driven platforms and coalitions",
      "Grants, donor-restricted funds, and public partnerships"
    ]
  },
  pillars: [
    {
      id: 1,
      title: "Mental Health & Emotional Wellness",
      objective: "Normalize mental health support and expand access to culturally relevant care.",
      initiatives: ["Community mental health workshops", "Parenting and caregiver wellness programs", "Trauma-informed advocacy media campaigns", "Referral networks with licensed professionals", "Digital wellness resources tied to advocacy content"],
      icon: <Brain />
    },
    {
      id: 2,
      title: "Family & Community Stability",
      objective: "Strengthen families as the foundation of resilient communities.",
      initiatives: ["Family education programs (communication, conflict resolution, parenting)", "Mentorship programs (youth & intergenerational)", "Community needs assessments", "Volunteer mobilization and service projects"],
      icon: <Users />
    },
    {
      id: 3,
      title: "Education, Advocacy & Storytelling",
      objective: "Turn awareness into action through education and media.",
      initiatives: ["Advocacy-driven docu-series and digital campaigns", "Educational toolkits aligned with media content", "Public forums, town halls, and listening sessions", "Curriculum-aligned resources for schools"],
      icon: <MediaIcon />
    },
    {
      id: 4,
      title: "Economic Empowerment & Inclusion",
      objective: "Create pathways to economic stability and participation.",
      initiatives: ["Workforce readiness and digital skills training", "Entrepreneur support programs", "Financial literacy workshops", "Access-to-opportunity partnerships"],
      icon: <TrendingUp />
    },
    {
      id: 5,
      title: "AI & Tech for Good",
      objective: "Ensuring that underrepresented communities have access to emerging technology that should serve humanity not exploit it.",
      initiatives: ["Oversight and governance of World AI Force", "Ethical AI education and public awareness", "Research and policy collaboration", "AI-for-good pilots in education, healthcare, and safety"],
      icon: <Cpu />
    }
  ],
  closing: {
    statement: "Foundation of Luv is not charity for charity’s sake.",
    tagline: "Love, structured. Advocacy, governed. Innovation, humanized."
  }
};

export const DONOR_PAGE_CONTENT = {
  different: {
    title: "What Makes Us Different",
    content: "Foundation of Luv bridges advocacy, media, community programs, and ethical technology under one accountable nonprofit structure. We don’t just raise awareness — we build systems that last."
  },
  impactPillars: [
    { 
      title: "Mental Health & Emotional Wellness", 
      description: "Providing Support & Access to Resources for all in need." 
    },
    { 
      title: "FAMILY & COMMUNITY STABILITY", 
      description: "Strengthening Families as the foundation for a Transformed Community" 
    },
    { 
      title: "Financial Literacy & Skill Empowerment", 
      description: "Creating pathways to strengthen families, access opportunities & build self-sufficiency" 
    },
    { 
      title: "AI & TECH FOR GOOD", 
      description: "(A decentralized digital ecosystem “World AI Force” that ensures technology serves humanity for good)" 
    }
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
  matters: {
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
    tagline: "Foundation of Luv. Because love deserves structure."
  }
};