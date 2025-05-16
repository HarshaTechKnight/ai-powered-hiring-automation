
import { Briefcase, LayoutDashboard, FileText, Mic2, FileSignature, HelpCircle, BarChartHorizontalBig, CalendarClock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Resume Screening",
    href: "/resume-screening",
    icon: FileText,
  },
  {
    title: "Interview Scheduling",
    href: "/interview-scheduling",
    icon: CalendarClock,
  },
  {
    title: "Interview Analysis",
    href: "/interview-analysis",
    icon: Mic2,
  },
  {
    title: "Job Description Generator",
    href: "/job-description-generator",
    icon: FileSignature,
  },
  {
    title: "Interview Questions",
    href: "/interview-question-generator",
    icon: HelpCircle,
  },
  {
    title: "Skill Gap Analyzer",
    href: "/skill-gap-analyzer",
    icon: BarChartHorizontalBig,
  },
];

export const APP_NAME = "KarmaHire";
export const APP_ICON = Briefcase;
