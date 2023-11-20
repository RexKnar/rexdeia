import {
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  User2,
  UserCircle2,
  UserPlus2,
} from 'lucide-react';

import { SidebarMenuItem } from './types';

export const menuItems: SidebarMenuItem[] = [
  {
    id: 'admission-dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/admission/dashboard',
  },
  {
    id: 'students',
    label: 'Students',
    icon: UserCircle2,
    path: '',
    children: [
      {
        id: 'students-add-new',
        label: 'Add new',
        icon: null,
        path: '/students/add',
      },
      {
        id: 'students-analytics',
        label: 'Analytics',
        icon: null,
        path: '/test2',
      },
      {
        id: 'student-list',
        label: 'Student List',
        icon: null,
        path: '/students/list',
      },
      {
        id: 'admission-configure',
        label: 'Configure',
        icon: null,
        path: '/test4',
      },
    ],
  },
  {
    id: 'staffs',
    label: 'Staff',
    icon: User2,
    path: '/staffs',
  },
  {
    id: 'academics',
    label: 'Academics',
    icon: GraduationCap,
    path: '/academics',
  },
  {
    id: 'admission-page',
    label: 'Admissions',
    icon: UserPlus2,
    path: '',
    children: [
      {
        id: 'admission-addnew',
        label: 'Add new',
        icon: null,
        path: '/admission/add',
      },
      {
        id: 'admission-analytics',
        label: 'Analytics',
        icon: null,
        path: '/admission/analytics',
      },
      {
        id: 'admission-configure',
        label: 'Configure',
        icon: null,
        path: '/admission/configure',
      },
    ],
  },
  {
    id: 'academics-department-student',
    label: 'Department',
    icon: HelpCircle,
    path: '/academics/department',
  },
  {
    id: 'academics-regulation-student',
    label: 'Regulation',
    icon: HelpCircle,
    path: '/academics/regulation',
  },
  {
    id: 'academics-course-student',
    label: 'Course',
    icon: HelpCircle,
    path: '/academics/course',
  },
];
