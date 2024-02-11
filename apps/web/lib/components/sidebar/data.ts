import {
  BetweenHorizontalEndIcon,
  FileText,
  GraduationCap,
  SquareUserRound,
  UserPlus2,
} from 'lucide-react';

import { SidebarMenuItem } from './types';

export const menuItems: SidebarMenuItem[] = [
  {
    id: 'students',
    label: 'Students',
    icon: SquareUserRound,
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
    label: 'Staffs',
    icon: BetweenHorizontalEndIcon,
    path: '',
    children: [
      {
        icon: null,
        label: 'Onboard Staff',
        id: 'enroll-new-student',
        path: '/staffs/onboard-new-staff',
      },
      {
        icon: null,
        label: 'Staff List',
        id: 'staff-list',
        path: '/staffs/list',
      },
    ],
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
        id: 'academics-regulation-student',
        label: 'Regulations',
        icon: null,
        path: '/academics/regulation',
      },
      {
        id: 'academics-medium',
        label: 'Medium',
        icon: null,
        path: '/academics/medium',
      },
      {
        id: 'academics-group',
        label: 'Group',
        icon: null,
        path: '/academics/group',
      },
      {
        id: 'academics-year',
        label: 'Academic Year',
        icon: null,
        path: '/academics/academic-year',
      },
      {
        id: 'academics-exams',
        label: 'Exams',
        icon: null,
        path: '/academics/exams',
      },
      {
        id: 'academics-subjects-student',
        label: 'Subjects',
        icon: null,
        path: '/academics/subjects',
      },
      {
        id: 'academics-subjects-type',
        label: 'Subject Type',
        icon: null,
        path: '/academics/subjects/subject-type',
      },
      {
        id: 'academics-subjects-format',
        label: 'Subject Format',
        icon: null,
        path: '/academics/subjects/subject-format',
      },
      {
        id: 'academics-category',
        label: 'Category',
        icon: null,
        path: '/academics/category',
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
