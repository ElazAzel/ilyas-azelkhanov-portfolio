export const projectCategories = [
  "SaaS и бизнес-системы",
  "AI и автоматизация",
  "EdTech и сообщества",
  "Маркетплейсы",
  "События и геймификация",
  "Корпоративные платформы",
] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export type Project = {
  slug: string;
  title: string;
  descriptor: string;
  category: ProjectCategory;
  tags: string[];
  year: string;
  industry: string;
  projectType: string;
  isConcept: boolean;
  featured: boolean;
  accentColor: string;
  backgroundColor?: string;
  summary: string;
  businessProblem: string;
  businessValue: string;
  clientContext: string;
  goals: string[];
  research: { title: string; description: string }[];
  keyInsight: string;
  strategy: string[];
  targetAudience: string[];
  userFlow: string[];
  features: { title: string; description: string; value: string }[];
  branding: {
    personality: string[];
    colors: string[];
    typography: string;
    principles: string[];
  };
  technology: string[];
  deliverables: string[];
  expectedImpact?: { label: string; value: string; description: string }[];
  verifiedResults?: { label: string; value: string; description: string }[];
  liveUrl?: string;
  repositoryUrl?: string;
};
