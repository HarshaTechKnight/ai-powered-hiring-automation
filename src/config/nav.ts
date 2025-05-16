
import { Briefcase, LayoutDashboard, FileText, Mic2 } from "lucide-react";
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
    title: "Interview Analysis",
    href: "/interview-analysis",
    icon: Mic2,
  },
];

export const APP_NAME = "KarmaHire";
export const APP_ICON = Briefcase;
