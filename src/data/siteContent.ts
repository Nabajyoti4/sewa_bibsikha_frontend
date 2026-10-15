import type { IconName } from "../components/Icon";

export type PersonaId = "government" | "industry" | "community" | "explorer";

export type ServiceCategory = "carbon" | "energy" | "consultancy" | "operations";

export interface Persona {
  id: PersonaId;
  label: string;
  icon: IconName;
  headline: string;
  pitch: string;
  cta: string;
}

export interface Service {
  id: string;
  title: string;
  short: string;
  description: string;
  category: ServiceCategory;
  icon: IconName;
  points: string[];
  personas: PersonaId[];
}

export interface Project {
  id: string;
  title: string;
  location: string;
  category: ServiceCategory;
  status: "Completed" | "Ongoing";
  summary: string;
  metrics?: { value: string; label: string }[];
  palette: [string, string];
  icon: IconName;
}

export interface ApproachStep {
  id: string;
  number: string;
  title: string;
  description: string;
  points: string[];
  icon: IconName;
}

export const brand = {
  name: "Bibsikha",
  legalName: "Bibsikha LLP",
  tagline: "A Climate Change Mitigation and Advisory Group",
  ceo: "Bibek Bora",
};

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Bibsikha" },
  { to: "/services", label: "Our Services" },
  { to: "/projects", label: "Projects" },
  { to: "/approach", label: "Our Approach" },
  { to: "/contact", label: "Contact Us" },
];

export const contactInfo = {
  email: "info@bibsikha.in",
  website: "www.bibsikha.in",
  addressLines: ["Khongia Gaon,", "Near Borkhongia High School,", "Jorhat - 785616 (Assam)"],
  address: "Khongia Gaon, Near Borkhongia High School, Jorhat - 785616 (Assam)",
};

export interface HeroSlide {
  id: string;
  title: string;
  caption: string;
  tag: string;
  icon: IconName;
  palette: [string, string];
  image?: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: "clean-cooking",
    title: "Clean Cooking Programme",
    caption: "Smokeless cook stoves for 3,00,000+ rural households.",
    tag: "Clean Energy",
    icon: "flame",
    palette: ["#0f5132", "#2fa36f"],
  },
  {
    id: "solar-lighting",
    title: "Solar Lanterns & Street Lights",
    caption: "Bringing clean light to rural communities.",
    tag: "Renewable Energy",
    icon: "sun",
    palette: ["#b8860b", "#e8b931"],
  },
  {
    id: "carbon-credits",
    title: "Carbon Credit Management",
    caption: "Turning climate action into business returns.",
    tag: "Carbon & SDG",
    icon: "coins",
    palette: ["#13294b", "#1f4b8f"],
  },
  {
    id: "field-teams",
    title: "Skilled Field Teams",
    caption: "350–600 project personnel on the ground.",
    tag: "Manpower",
    icon: "users",
    palette: ["#0b3d2e", "#146c43"],
  },
  {
    id: "nature",
    title: "Nature Based Solutions",
    caption: "Conserving natural resources and ecosystems.",
    tag: "Ecosystem",
    icon: "leaf",
    palette: ["#146c43", "#5bbf8a"],
  },
  {
    id: "distribution",
    title: "Clean-Energy Distribution",
    caption: "Supply chain for products of environmental importance.",
    tag: "Logistics",
    icon: "truck",
    palette: ["#0f5132", "#b8860b"],
  },
];

export const businessQuestions = [
  "How to grow your business by being climate-conscious?",
  "How to explore newer opportunities amidst challenges?",
  "How to know where to invest?",
  "How to gain more through strategised efforts in less time?",
];

export const personas: Persona[] = [
  {
    id: "explorer",
    label: "Just exploring",
    icon: "compass",
    headline: "Climate consciousness is the new business currency.",
    pitch:
      "Bibsikha is a climate change mitigation and advisory group. We give you the solutions, the framework and the manpower to grow your business manifold — while protecting the planet.",
    cta: "Explore our work",
  },
  {
    id: "government",
    label: "Government / PSU",
    icon: "shield",
    headline: "Large-scale environmental programmes, delivered on ground.",
    pitch:
      "Consultancy for every environmental programme, distribution-based solutions and 350–600 project personnel to execute large-scale public programmes across India.",
    cta: "See our achievements",
  },
  {
    id: "industry",
    label: "Industry / Business",
    icon: "chart",
    headline: "Turn carbon credits into great business returns.",
    pitch:
      "The global carbon credit market is around $300 billion a year and set to double. We help you identify your strengths and earn from Carbon Trading and the Voluntary Carbon Market.",
    cta: "Talk to a carbon expert",
  },
  {
    id: "community",
    label: "NGO / Community",
    icon: "users",
    headline: "Cleaner kitchens, brighter homes, stronger communities.",
    pitch:
      "Smokeless cook stoves, solar lanterns and clean-energy solutions that have already reached more than 3,00,000 rural households.",
    cta: "Partner with us",
  },
];

export const categoryLabels: Record<ServiceCategory, string> = {
  carbon: "Carbon & SDG",
  energy: "Clean Energy",
  consultancy: "Consultancy",
  operations: "Manpower & Logistics",
};

export const serviceCategories: { id: ServiceCategory | "all"; label: string }[] = [
  { id: "all", label: "All services" },
  { id: "carbon", label: categoryLabels.carbon },
  { id: "energy", label: categoryLabels.energy },
  { id: "consultancy", label: categoryLabels.consultancy },
  { id: "operations", label: categoryLabels.operations },
];

export const services: Service[] = [
  {
    id: "carbon-market",
    title: "Environment, SDG & Voluntary Carbon Market Management",
    short: "Carbon credit management and tailor-made climate & sustainability solutions.",
    description:
      "As an Environment & Sustainability Consulting Company, we execute tailor-made solutions for private and public sector clients to achieve Climate Change and Sustainability objectives — including Carbon Credit Management in the Voluntary Carbon Market.",
    category: "carbon",
    icon: "coins",
    points: ["Carbon credit management & trading", "Carbon neutrality & emissions", "Green investments", "Project development"],
    personas: ["industry", "government"],
  },
  {
    id: "renewable",
    title: "Renewable Energy Sources Management",
    short: "Expand your territory and business in renewable energy.",
    description:
      "We assist clients to expand their territory and business in renewable energy sources with robust teamwork, delivering projects with a range of power trading products primarily based on solar energy.",
    category: "energy",
    icon: "sun",
    points: ["Solar-based power trading products", "Green energy projects", "Energy efficient lighting solutions", "Business expansion support"],
    personas: ["industry", "community"],
  },
  {
    id: "consultancy",
    title: "Consultancy Services",
    short: "Consultancy for every environmental programme.",
    description:
      "We provide consultancy services for every possible environmental programme and distribution-based solutions for Governmental as well as non-Governmental undertakings.",
    category: "consultancy",
    icon: "search",
    points: ["Environmental programme design", "Distribution-based solutions", "Government undertakings", "Non-Governmental undertakings"],
    personas: ["government", "community", "industry"],
  },
  {
    id: "manpower",
    title: "Human Resource Management Services",
    short: "Skilled manpower to execute large-scale programmes.",
    description:
      "One of the first companies of its kind from Northeast India, skilled manpower is our main strength. We provide and manage the large workforce our clients need — between 350 and 600 project-based employees at any time.",
    category: "operations",
    icon: "users",
    points: ["350–600 project-based employees", "Large-scale programme execution", "Workforce management", "Field-trained teams"],
    personas: ["government", "industry"],
  },
  {
    id: "logistics",
    title: "Supply Chain Logistics Management",
    short: "Distribution of materials, manpower and clean-energy products.",
    description:
      "We propel our clients’ business through the distribution and allocation of materials and manpower, including clean-energy appliances and other products of environmental importance.",
    category: "operations",
    icon: "truck",
    points: ["Smokeless cook stoves", "Solar lanterns", "Solar street lights", "Material & manpower allocation"],
    personas: ["community", "government"],
  },
];

export const coreCompetencies = [
  "Nature Based Solutions",
  "Energy Efficient Lighting",
  "Clean Cooking Solutions",
  "Waste Management",
  "Water Management",
  "Green Energy",
  "Carbon Neutrality",
  "Green Investments",
  "Carbon Emissions",
  "Project Development",
];

export const regions = ["Assam & North-eastern India", "Bihar", "Chhattisgarh", "Jharkhand"];

export const projects: Project[] = [
  {
    id: "clean-cooking",
    title: "Clean Energy Cooking Programme",
    location: "Assam, Bihar, Chhattisgarh, Jharkhand",
    category: "energy",
    status: "Ongoing",
    summary:
      "Energy-efficient, smokeless cook stoves introduced to 3 lakh rural households — reducing indoor air pollution that harms both health and the environment.",
    metrics: [
      { value: "3,00,000", label: "Households reached" },
      { value: "1,00,000", label: "Next-quarter target" },
    ],
    palette: ["#0f5132", "#2fa36f"],
    icon: "flame",
  },
  {
    id: "carbon-credits",
    title: "Carbon Credit Management",
    location: "Pan-India",
    category: "carbon",
    status: "Ongoing",
    summary:
      "Helping organisations identify their strengths and earn returns through Carbon Trading and the Voluntary Carbon Market.",
    palette: ["#b8860b", "#d4a017"],
    icon: "coins",
  },
  {
    id: "solar-lighting",
    title: "Solar Lanterns & Street Lights",
    location: "Rural India",
    category: "energy",
    status: "Ongoing",
    summary: "Distribution of solar lanterns, solar street lights and energy efficient lighting solutions to rural communities.",
    palette: ["#13294b", "#1f4b8f"],
    icon: "sun",
  },
  {
    id: "solar-power",
    title: "Solar Power Trading Products",
    location: "India",
    category: "energy",
    status: "Ongoing",
    summary: "Projects delivered with a range of power trading products primarily based on solar energy.",
    palette: ["#0b3d2e", "#146c43"],
    icon: "lightbulb",
  },
  {
    id: "programme-manpower",
    title: "Large-scale Programme Manpower",
    location: "Multiple states",
    category: "operations",
    status: "Ongoing",
    summary: "Providing and managing the skilled field workforce that clients need to execute large-scale programmes.",
    metrics: [
      { value: "350–600", label: "Project personnel" },
      { value: "10+", label: "Years of field work" },
    ],
    palette: ["#146c43", "#5bbf8a"],
    icon: "users",
  },
  {
    id: "nature-based",
    title: "Nature Based Solutions",
    location: "North-east India",
    category: "carbon",
    status: "Ongoing",
    summary: "Natural resource conservation, waste and water management programmes that support ecosystems and communities.",
    palette: ["#0f5132", "#b8860b"],
    icon: "leaf",
  },
];

export const approachSteps: ApproachStep[] = [
  {
    id: "understand",
    number: "01",
    title: "Understand the Context",
    description:
      "We explore the socio-economic context of every client and region, drawing on more than 10 years of field knowledge across India and the North-east.",
    points: ["Socio-economic assessment", "Indian & North-east market insight", "Climate challenges & opportunities"],
    icon: "search",
  },
  {
    id: "identify",
    number: "02",
    title: "Identify Strengths",
    description:
      "We help organisations identify their strengths and what they can deliver through a range of options and solutions in the field of Carbon Trading.",
    points: ["Strength & opportunity mapping", "Carbon trading options", "Investment priorities"],
    icon: "target",
  },
  {
    id: "strategise",
    number: "03",
    title: "Strategise & Frame",
    description:
      "Our core team designs effective strategies and frameworks so clients gain more through strategised efforts in less time.",
    points: ["Tailor-made strategies", "Execution frameworks", "Fruitful project outcomes"],
    icon: "layers",
  },
  {
    id: "execute",
    number: "04",
    title: "Execute with Manpower",
    description:
      "With 350–600 project personnel and our own supply chain, we bring speedy and effective implementation of projects on the ground.",
    points: ["Skilled field workforce", "Supply chain & distribution", "Speedy implementation"],
    icon: "users",
  },
  {
    id: "grow",
    number: "05",
    title: "Grow Manifold",
    description:
      "Projects that yield more and better results — now and in the future — turning climate consciousness into returns for business and impact for communities.",
    points: ["Carbon credit returns", "Sustainable growth", "Lasting community impact"],
    icon: "chart",
  },
];

export const impactStats = [
  { value: 3, suffix: " Lakh+", label: "Rural households impacted" },
  { value: 10, suffix: "+", label: "Years of field expertise" },
  { value: 600, suffix: "", label: "Project personnel (up to)" },
  { value: 4, suffix: "+", label: "States of operation" },
];

export const dimensions: { title: string; description: string; icon: IconName }[] = [
  { title: "Energy", description: "Clean cooking, energy efficient lighting and solar-based green energy.", icon: "sun" },
  { title: "Environment", description: "Climate change mitigation, carbon neutrality, waste and water management.", icon: "globe" },
  { title: "Ecosystem", description: "Natural resource conservation and nature based solutions.", icon: "leaf" },
];

export const strengths: { title: string; description: string; icon: IconName }[] = [
  {
    title: "Field exposure",
    description:
      "With our ground knowledge, we help translate clients’ imagination into reality by creating projects that yield more and better results, now and in the future.",
    icon: "pin",
  },
  {
    title: "Manpower",
    description:
      "Our vast manpower brings speedy and effective implementation. We are one of the most sought-after Distribution Agencies in India for carbon-reducing products.",
    icon: "users",
  },
];

export const teamExpertise: { title: string; icon: IconName }[] = [
  { title: "Livelihood Management", icon: "briefcase" },
  { title: "Women Empowerment", icon: "heart" },
  { title: "Education & Technology Development", icon: "cpu" },
  { title: "Cultural & Research-Oriented Programs", icon: "award" },
  { title: "Carbon Credit Trading", icon: "coins" },
];

export const cookingFacts = [
  { value: "400M", label: "People in India exposed to indoor air pollution from biomass firewood" },
  { value: "90%", label: "Of those exposed are women" },
  { value: "5–8 hrs", label: "Spent by women on cooking every day, 20% of it collecting fuel" },
  { value: "70%", label: "Of rural households have no ventilation in their kitchen" },
];

export const faqs = [
  {
    q: "What is Carbon Credit Management?",
    a: "Carbon credits reward verified reductions in emissions. We help companies identify their strengths and participate in Carbon Trading and the Voluntary Carbon Market — a global market of around $300 billion a year that is set to double.",
  },
  {
    q: "Where does Bibsikha operate?",
    a: "We are headquartered in Jorhat, Assam, with teams on the ground in rural regions of Assam and North-eastern India, Bihar, Chhattisgarh, Jharkhand and other states.",
  },
  {
    q: "Can you provide manpower for large programmes?",
    a: "Yes. Skilled manpower is our main strength — we have between 350 and 600 project-based employees working on projects for different clients at any time.",
  },
  {
    q: "Which products do you distribute?",
    a: "We distribute clean-energy appliances and other products of environmental importance, such as smokeless cook stoves, solar lanterns and solar street lights.",
  },
];
