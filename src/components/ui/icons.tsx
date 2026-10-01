import {
  Compass,
  GraduationCap,
  Sparkles,
  TrendingUp,
  GitFork,
  Rocket,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  Users,
  ChevronRight,
  type LucideProps,
} from 'lucide-react';

export interface IconProps extends LucideProps {
  className?: string;
}

export const Icons = {
  // Brand & Academic Navigation
  logo: Compass,
  academic: GraduationCap,
  book: BookOpen,
  users: Users,

  // 4-Career Archetype Tiers
  directMatch: Sparkles,
  highGrowth: TrendingUp,
  interdisciplinary: GitFork,
  moonshot: Rocket,

  // Triage & Anxiety Diagnostics
  frictionAlert: AlertCircle,
  verifiedCourse: CheckCircle2,
  duration: Clock,
  externalLink: ExternalLink,
  arrowRight: ArrowRight,
  chevronRight: ChevronRight,

  // Counselor Dashboard
  shield: ShieldCheck,
  search: Search,
  filter: Filter,
} as const;

export type IconKey = keyof typeof Icons;
