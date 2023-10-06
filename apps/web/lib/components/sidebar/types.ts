import { LucideIcon } from 'lucide-react';

export type SidebarMenuItem = {
  id: string;
  path: string;
  label: string;
  icon: LucideIcon | null;
  children?: SidebarMenuItem[];
};
