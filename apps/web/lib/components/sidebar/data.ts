import {
  FileText,
  GraduationCap,
  LayoutDashboard,
  User2,
  UserCircle2,
  UserPlus2,
} from 'lucide-react';

import { SidebarMenuItem } from './types';

export const menuItems: SidebarMenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    id: 'students',
    label: 'Students',
    icon: UserCircle2,
    path: '',
    children: [
      {
        icon: null,
        label: 'Dashboard',
        id: 'students-dashboard',
        path: '/students/dashboard',
      },
      {
        icon: null,
        id: 'enroll-new-student',
        label: 'Enroll New Student',
        path: '/students/enroll-new-student',
      },
      {
        icon: null,
        id: 'student-list',
        label: 'Students List',
        path: '/students/list',
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
    path: '',
    children: [
      {
        id: 'academics-class-student',
        label: 'Class',
        icon: null,
        path: '/academics/class',
      },
      {
        id: 'academics-course-student',
        label: 'Course',
        icon: null,
        path: '/academics/course',
      },
      {
        id: 'academics-department-student',
        label: 'Department',
        icon: null,
        path: '/academics/department',
      },
      {
        id: 'academics-regulation-student',
        label: 'Regulation',
        icon: null,
        path: '/academics/regulation',
      },
    ],
  },
  {
    id: 'admission-page',
    label: 'Admissions',
    icon: UserPlus2,
    path: '',
    children: [
      {
        id: 'admission-dashboard',
        label: 'Dashboard',
        icon: null,
        path: '/admission/dashboard',
      },
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
    id: 'enquiry-page',
    label: 'Enquiry',
    icon: FileText,
    path: '',
    children: [
      {
        id: 'enquiry-addnew',
        label: 'Add New',
        icon: null,
        path: '/enquiry/add',
      },
    ],
  },
];
