
import { Briefcase, LayoutDashboard, FileText, Mic2, FileSignature, HelpCircle, BarChartHorizontalBig, CalendarClock, UserCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
  authRequired?: boolean; // To conditionally show items like Profile
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    authRequired: true,
  },
  {
    title: "Resume Screening",
    href: "/resume-screening",
    icon: FileText,
    authRequired: true,
  },
  {
    title: "Interview Scheduling",
    href: "/interview-scheduling",
    icon: CalendarClock,
    authRequired: true,
  },
  {
    title: "Interview Analysis",
    href: "/interview-analysis",
    icon: Mic2,
    authRequired: true,
  },
  {
    title: "Job Description Generator",
    href: "/job-description-generator",
    icon: FileSignature,
    authRequired: true,
  },
  {
    title: "Interview Questions",
    href: "/interview-question-generator",
    icon: HelpCircle,
    authRequired: true,
  },
  {
    title: "Skill Gap Analyzer",
    href: "/skill-gap-analyzer",
    icon: BarChartHorizontalBig,
    authRequired: true,
  },
  {
    title: "My Profile",
    href: "/profile",
    icon: UserCircle2,
    authRequired: true,
  },
];

export const APP_NAME = "KarmaHire";
export const APP_ICON = Briefcase;
