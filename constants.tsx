import React from 'react';
import { 
  Heart, Shield, Users, Globe, BookOpen, Home, Utensils, Zap, 
  GraduationCap, Briefcase, Landmark, Handshake, HeartPulse, Brain,
  Sparkles, Star, Award, Leaf, Eye, Target, Scale, ShieldCheck, TrendingUp,
  AlertCircle, Building2, Lightbulb, Users2, Workflow, Recycle, Activity,
  PenTool, CheckCircle2, MessageSquare, Newspaper, Compass, Anchor,
  Mic2, Crosshair, UsersRound, Baby, Wallet, Stethoscope, MapPin, Search,
  Users2 as DemographyIcon
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
    title: "Our Mission",
    content: "Our mission is to transform lives by spreading compassion, empowering communities, and fostering hope. Through humanitarian service, advocacy, and sustainable support systems, we uplift the vulnerable and create a legacy of equity, wellness, and empowerment.",
    icon: <Target className="w-12 h-12 text-[#9c1c22]" />
  },
  vision: {
    title: "Our Vision",
    content: "To create a world rooted in love, dignity, and shared humanity—where every person is empowered to live with purpose, hope, and opportunity.",
    icon: <Eye className="w-12 h-12 text-[#eeb053]" />
  }
};

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
  header: "About the Foundation of Luv (FOL)",
  background: {
    title: "Our Background",
    content: "The Foundation of Love (FOL) was created with a simple yet profound belief: that love, dignity, and compassion can transform individuals and communities. Rooted in humanitarian service, advocacy, and holistic support, FOL was established to bridge societal divides, empower the vulnerable, and create lasting pathways to opportunity. Since inception, the foundation has touched lives across diverse demographics through outreach, capacity-building, mentorship, and community-centered initiatives.",
    intro: "At FOL, we believe love is an energy that transcends barriers. Through our programs in health, education, housing, mental wellness, and community empowerment, we foster resilience and inspire individuals to reach their fullest potential. The foundation also advances global advocacy through motivational speaking, literature, and international tours that spread hope and awareness."
  },
  objectives: [
    "To strengthen families and communities through education, workshops, and counseling.",
    "To provide holistic wraparound services addressing housing, food, mental health, and substance abuse.",
    "To empower individuals with employability, digital skills, certifications, and access to higher education.",
    "To advocate for healthcare awareness, financial literacy, and inclusion for underserved populations.",
    "To build sustainable models of service delivery through global partnerships and collaborations."
  ],
  goals: [
    "Reduce family disintegration through effective counseling and family planning programs.",
    "Increase access to housing, food, and healthcare services among vulnerable groups.",
    "Enhance digital and professional readiness for minority communities by securing partnerships with global institutions.",
    "Establish safe brick-and-mortar hubs that provide day programs, training, and emergency support.",
    "Launch LUVWATTS as both a unifying community movement and a fashion-forward advocacy initiative to drive fundraising."
  ],
  principles: [
    { title: "Love as Energy (LUVWATTS)", description: "Love is the unifying force that powers transformation." },
    { title: "Dignity", description: "Every person deserves respect, compassion, and equal opportunity." },
    { title: "Inclusivity", description: "No one is left behind, regardless of race, gender, or socioeconomic status." },
    { title: "Sustainability", description: "Solutions must be enduring, scalable, and community-led." },
    { title: "Empowerment", description: "We do not just give aid—we build capacity for long-term resilience." }
  ],
  serviceAreas: [
    { name: "Motivational Speaking & Global Advocacy", detail: "Global tours, books, and awareness campaigns." },
    { name: "Community Services", detail: "Workshops and trainings for families and kids." },
    { name: "Wraparound Services", detail: "Substance abuse and mental health support." },
    { name: "Housing & Shelter", detail: "Affordable housing and safe havens." },
    { name: "Feeding Programs", detail: "Food drives and nutrition support." },
    { name: "Outreach & Mentorship", detail: "Youth empowerment and guidance." },
    { name: "Family Counseling", detail: "Family planning, breastfeeding, birthing, and child-raising education." },
    { name: "Education & Job Readiness", detail: "GED preparation, free certifications, and training with partners." },
    { name: "Financial Literacy & Women Empowerment", detail: "Building financial inclusion for minority women." },
    { name: "Healthcare Advocacy & Training", detail: "Promoting awareness and access to healthcare resources." }
  ],
  touchPoints: [
    { title: "Brick-and-Mortar Hubs", description: "Safe spaces with day programs, counseling, job training, and housing support." },
    { title: "Global Partnerships", description: "Collaborations with Microsoft, Amazon, OpenAI, Anthropic, Google, Meta, Harvard, and others." },
    { title: "LUVWATTS Movement", description: "Signature identity for followers, fashion brand for advocacy, and fundraising channel." },
    { title: "Digital Access", description: "Online programs, global speaking tours, and virtual mentorship." }
  ],
  demography: {
    title: "Who We Serve",
    primary: "Vulnerable families, children, minority women, youth, and underserved communities.",
    secondary: "Broader society through reduced poverty, improved mental health, and enhanced community cohesion."
  },
  strategicEngagement: [
    {
      level: "Local Engagement (Years 1–2)",
      goals: [
        "Partner with local school districts and workforce boards for GED/job readiness.",
        "Align feeding/housing with city homeless coalitions and food banks.",
        "Work with community health centers for wraparound services.",
        "Establish brick-and-mortar hubs for direct community support."
      ],
      outputs: [
        "Serve 5,000+ households annually in food and shelter.",
        "Launch 2 major community hubs.",
        "Enroll 500+ in GED and certification programs."
      ]
    },
    {
      level: "State-Level Engagement (Years 1–3)",
      goals: [
        "Align with state health departments on substance abuse & maternal health.",
        "Access state housing trust funds for transitional programs.",
        "Partner with state universities for technical support and research.",
        "Scale job readiness via state workforce development boards."
      ],
      outputs: [
        "Secure 3+ state-level grants annually.",
        "Certify 2,000 individuals by Year 3.",
        "Increase regional housing capacity by 25%."
      ]
    },
    {
      level: "Federal Engagement (Years 2–4)",
      goals: [
        "Align with HUD for homelessness solutions.",
        "Partner with SAMHSA for mental health services.",
        "Apply for USDA food security grants to expand programs.",
        "Work with DOE on literacy and career pathways."
      ],
      outputs: [
        "Win 5+ federal grant awards by Year 4.",
        "Expand programs to 10 states.",
        "Serve 100,000 people cumulatively."
      ]
    },
    {
      level: "International Engagement (Years 3–5)",
      goals: [
        "Partner with UNICEF, WHO, UN Women, and UNESCO on thematic programs.",
        "Align with Sustainable Development Goals (SDGs) for global legitimacy.",
        "Secure grants from USAID and international development agencies.",
        "Expand LUVWATTS movement globally via fashion and advocacy tours."
      ],
      outputs: [
        "International recognition by 3+ UN agencies.",
        "Raise $10M+ in international funding by Year 5.",
        "Launch programs in 2–3 international countries."
      ]
    }
  ],
  closing: {
    quote: "Love is not just a sentiment; it is a system of restoration.",
    tagline: "Building a Legacy of Luv."
  }
};

export const DONOR_PAGE_CONTENT = {
  different: {
    title: "What Makes Us Different",
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
