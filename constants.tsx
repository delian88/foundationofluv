import React from 'react';
import { 
  Heart, Shield, Users, Globe, BookOpen, Home, Utensils, Zap, 
  GraduationCap, Briefcase, Landmark, Handshake, HeartPulse, Brain,
  Sparkles, Star, Award, Leaf, Eye, Target, Scale, ShieldCheck, TrendingUp,
  AlertCircle, Building2, Lightbulb, Users2, Workflow
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
  description: "LUVWATTS is more than an acronym; it's the kinetic energy of our foundation. It powers our feeding programs, fuels our education initiatives, and lights the way for those in darkness.",
  pillars: [
    "Light (Restoration)",
    "Unity (Community)",
    "Velocity (Progress)",
    "Wisdom (Education)"
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

export const DETAILED_ABOUT = {
  header: "Foundation of Luv Profile",
  dualRole: {
    intro: "Foundation of Luv serves as both:",
    points: [
      "A direct-impact organization delivering programs and interventions, and",
      "A holding, stewardship, and governance body for public-good initiatives that cannot legally or ethically sit under for-profit entities."
    ],
    collaboration: "Through strategic collaboration with Azariah Management Group (AMG) and its creative and technical arms, FoL transforms advocacy into action, and awareness into sustainable systems of support."
  },
  problemStatement: {
    title: "The Problem Statement",
    context: "Across communities in the U.S. and globally, we are seeing a convergence of crises:",
    crises: [
      "Rising mental health challenges among adults, parents, and youth",
      "Breakdown of family support systems and community cohesion",
      "Economic exclusion of marginalized groups",
      "Limited access to culturally relevant education and advocacy resources",
      "Rapid technological advancement without adequate ethical safeguards",
      "Advocacy content that raises awareness but lacks follow-through impact"
    ],
    fragmented: {
      title: "Existing solutions are often fragmented:",
      points: [
        "Nonprofits lack scalable infrastructure and media reach",
        "Tech solutions lack human-centered governance",
        "Advocacy campaigns stop at storytelling, without systems change"
      ]
    },
    closing: "Foundation of Luv exists to bridge these gaps."
  },
  values: [
    { title: "Love in Action", description: "Compassion translated into systems, not sentiment" },
    { title: "Human-Centered Impact", description: "People before profit, always" },
    { title: "Equity & Inclusion", description: "Culturally grounded, community-led solutions" },
    { title: "Integrity & Stewardship", description: "Ethical governance, transparency, accountability" },
    { title: "Collaboration", description: "Partnerships over silos" },
    { title: "Innovation for Good", description: "Technology as a tool, not a threat" }
  ],
  ecosystem: {
    role1: {
      title: "1. A Programmatic Nonprofit",
      items: ["Mental health and family support initiatives", "Community education and advocacy", "Youth mentorship and leadership development", "Social impact pilots and research"]
    },
    role2: {
      title: "2. A Holding & Stewardship Organization",
      items: ["World AI Force (as a public good initiative)", "Future advocacy-driven platforms and coalitions", "Grants, donor-restricted funds, and public partnerships"]
    },
    ensures: ["IRS compliance", "Ethical separation from for-profit entities", "Long-term sustainability and donor trust"]
  },
  pillars: [
    {
      id: 1,
      title: "Mental Health & Emotional Wellness",
      objective: "Normalize mental health support and expand access to culturally relevant care.",
      initiatives: ["Community mental health workshops", "Parenting and caregiver wellness programs", "Trauma-informed advocacy media campaigns", "Referral networks with licensed professionals", "Digital wellness resources tied to advocacy content (e.g., BlackbyAngel, Family First)"],
      targets: ["Parents & caregivers", "Youth and young adults", "Underserved and marginalized communities"]
    },
    {
      id: 2,
      title: "Family & Community Stability",
      objective: "Strengthen families as the foundation of resilient communities.",
      initiatives: ["Family education programs (communication, conflict resolution, parenting)", "Mentorship programs (youth & intergenerational)", "Community needs assessments and response design", "Volunteer mobilization and service projects"]
    },
    {
      id: 3,
      title: "Education, Advocacy & Storytelling",
      objective: "Turn awareness into action through education and media.",
      initiatives: ["Advocacy-driven docu-series and digital campaigns", "Educational toolkits aligned with media content", "Public forums, town halls, and listening sessions", "Curriculum-aligned resources for schools and community groups"],
      advantage: "Unlike traditional nonprofits, FoL integrates professional media production (via AMG/Studio AMG) to reach wider audiences, influence policy, and support outcomes storytelling."
    },
    {
      id: 4,
      title: "Economic Empowerment & Inclusion",
      objective: "Create pathways to economic stability and participation.",
      initiatives: ["Workforce readiness and digital skills training", "Entrepreneur support programs (especially creatives and technologists)", "Financial literacy workshops", "Access-to-opportunity partnerships"]
    },
    {
      id: 5,
      title: "Ethical AI, Technology & Public Good",
      objective: "Ensure emerging technologies serve humanity, not exploit it.",
      initiatives: ["Oversight and governance of World AI Force", "Ethical AI education and public awareness", "Research and policy collaboration", "AI-for-good pilots in education, healthcare, and community safety"],
      role: "Acts as the nonprofit anchor and ethical steward, holds IP or licenses for public-good use, and ensures independence."
    }
  ],
  closing: {
    quote: "Foundation of Luv is not charity for charity’s sake. It is love, structured. Advocacy, governed. Innovation, humanized.",
    tagline: "It exists to ensure that compassion is not just expressed but institutionalized."
  }
};

export const DONOR_PAGE_CONTENT = {
  different: {
    title: "Show some Love",
    content: "Foundation of Luv bridges advocacy, media, community programs, and ethical technology under one accountable nonprofit structure. We don’t just raise awareness — we build systems that last."
  },
  impactPillars: [
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

export const STATS = [
  { label: "Housing Units", value: "250", suffix: "+", description: "Secure homes established" },
  { label: "Global Reach", value: "1.2", suffix: "M", description: "Engaged in 12 months" },
  { label: "Education", value: "3.5", suffix: "k", description: "Certifications awarded" },
  { label: "Food Security", value: "50", suffix: "k+", description: "Meals served per quarter" },
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
    goals: ["Establish brick-and-mortar hubs for family support.", "Align feeding/housing with local coalitions.", "Launch grassroots trust-building initiatives."],
    outputs: ["Serve 5,000+ households annually.", "Open 2 major community hubs.", "Enroll 500+ in GED programs."]
  },
  {
    title: "Regional Expansion",
    years: "Phase 2",
    goals: ["Partner with state health departments on maternal care.", "Access state housing trust funds for transitional programs.", "Expand workforce skills certification network."],
    outputs: ["Secure 3+ state-level grants.", "Certify 2,000+ individuals by year end.", "Increase housing capacity by 25%."]
  },
  {
    title: "National Scale",
    years: "Phase 3",
    goals: ["Secure HUD, SAMHSA, and USDA federal partnerships.", "Scale LUVWATTS movement across 10 major states.", "Develop career pathways with the Dept of Education."],
    outputs: ["Win 5+ federal grant awards.", "Reach 100,000 people cumulatively.", "Establish nationwide feeding logistics."]
  }
];

export const GALLERY_IMAGES = [
  { url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800", title: "Outreach 2024" },
  { url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800", title: "Global Support" },
  { url: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800", title: "Community Hub" },
  { url: "https://images.unsplash.com/photo-1524061614234-84496375567e?auto=format&fit=crop&q=80&w=800", title: "Housing Progress" },
  { url: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&q=80&w=800", title: "Youth Mentorship" },
  { url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800", title: "Humanitarian Aid" },
];

export const HERO_IMAGES = [
  { url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=2000", caption: "Feeding the Soul, Restoring Dignity" },
  { url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=2000", caption: "Empowering the Next Generation" }
];
