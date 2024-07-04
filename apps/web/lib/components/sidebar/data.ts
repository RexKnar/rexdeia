import {
  BetweenHorizontalEndIcon,
  FileText,
  GraduationCap,
  SquareUserRound,
} from 'lucide-react';

import { SidebarMenuItem } from './types';

export const menuItems: SidebarMenuItem[] = [
  {
    id: 'analytics',
    label: 'Analytics',
    icon: GraduationCap,
    path: '',
    children: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: FileText,
        path: '/analytics',
      },
      {
        id: 'marks',
        label: 'Marks',
        icon: FileText,
        path: '/analytics/mark-list',
      },
    ],
  },
  {
    id: 'academics-class-student',
    label: 'Class',
    icon: FileText,
    path: '',
    children: [
      {
        id: 'class-dashboard',
        label: 'Dashboard',
        icon: FileText,
        path: '/class/dashboard',
      },
      {
        id: 'class-list',
        label: 'Class List',
        icon: FileText,
        path: '/academics/class',
      },
    ],
  },

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
    id: 'exam-page',
    label: 'Exams',
    icon: FileText,
    path: '',
    children: [
      {
        id: 'exam-list',
        label: 'Exam List',
        icon: null,
        path: '/exams',
      },
      {
        id: 'mark-entry',
        label: 'Mark Entry',
        icon: null,
        path: '/exams/mark-entry',
      },
    ],
  },
  {
    id: 'configurations',
    label: 'Configurations',
    icon: GraduationCap,
    path: '',
    children: [
      {
        id: 'academics-regulation-student',
        label: 'Regulations',
        icon: null,
        path: '/academics/regulation',
      },
      {
        id: 'academics-year',
        label: 'Academic Year',
        icon: null,
        path: '/academics/academic-year',
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
        id: 'academics-subjects-student',
        label: 'Subject Master',
        icon: null,
        path: '/academics/subject-master',
      },
      {
        id: 'academics-subjects-type',
        label: 'Subject Type',
        icon: null,
        path: '/academics/subjects/subject-type',
      },
      {
        id: 'academics-assessment-format',
        label: 'Assessment Format',
        icon: null,
        path: '/academics/subjects/assessment-format',
      },

      {
        id: 'academics-examtype',
        label: 'Exam Type',
        icon: null,
        path: '/academics/examtype',
      },
      {
        id: 'academics-term',
        label: 'Term',
        icon: null,
        path: '/academics/term',
      },
      {
        id: 'academics-grade',
        label: 'Grade',
        icon: null,
        path: '/academics/grade',
      },
      {
        id: 'academics-student-attendance',
        label: 'Student Attendance',
        icon: null,
        path: '/academics/student-attendance',
      },
    ],
  },
];

export const menuItem = {
  Admin: [
    {
      id: 'analytics',
      label: 'Analytics',
      icon: GraduationCap,
      path: '',
      children: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: FileText,
          path: '/analytics',
        },
        {
          id: 'marks',
          label: 'Marks',
          icon: FileText,
          path: '/analytics/mark-list',
        },
      ],
    },
    {
      id: 'academics-class-student',
      label: 'Class',
      icon: FileText,
      path: '',
      children: [
        {
          id: 'class-dashboard',
          label: 'Dashboard',
          icon: FileText,
          path: '/class/dashboard',
        },
        {
          id: 'class-list',
          label: 'Class List',
          icon: FileText,
          path: '/academics/class',
        },
      ],
    },

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
      id: 'exam-page',
      label: 'Exams',
      icon: FileText,
      path: '',
      children: [
        {
          id: 'exam-list',
          label: 'Exam List',
          icon: null,
          path: '/exams',
        },
        {
          id: 'mark-entry',
          label: 'Mark Entry',
          icon: null,
          path: '/exams/mark-entry',
        },
      ],
    },
    {
      id: 'configurations',
      label: 'Configurations',
      icon: GraduationCap,
      path: '',
      children: [
        {
          id: 'academics-regulation-student',
          label: 'Regulations',
          icon: null,
          path: '/academics/regulation',
        },
        {
          id: 'academics-year',
          label: 'Academic Year',
          icon: null,
          path: '/academics/academic-year',
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
          id: 'academics-subjects-student',
          label: 'Subject Master',
          icon: null,
          path: '/academics/subject-master',
        },
        {
          id: 'academics-subjects-type',
          label: 'Subject Type',
          icon: null,
          path: '/academics/subjects/subject-type',
        },
        {
          id: 'academics-assessment-format',
          label: 'Assessment Format',
          icon: null,
          path: '/academics/subjects/assessment-format',
        },

        {
          id: 'academics-examtype',
          label: 'Exam Type',
          icon: null,
          path: '/academics/examtype',
        },
        {
          id: 'academics-term',
          label: 'Term',
          icon: null,
          path: '/academics/term',
        },
        {
          id: 'academics-grade',
          label: 'Grade',
          icon: null,
          path: '/academics/grade',
        },
        {
          id: 'academics-student-attendance',
          label: 'Student Attendance',
          icon: null,
          path: '/academics/student-attendance',
        },
      ],
    },
  ],
  TeachingStaff: [
    {
      id: 'analytics',
      label: 'Analytics',
      icon: GraduationCap,
      path: '',
      children: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: FileText,
          path: '/analytics',
        },
        {
          id: 'marks',
          label: 'Marks',
          icon: FileText,
          path: '/analytics/mark-list',
        },
      ],
    },
    {
      id: 'exam-page',
      label: 'Exams',
      icon: FileText,
      path: '',
      children: [
        {
          id: 'exam-list',
          label: 'Exam List',
          icon: null,
          path: '/exams',
        },
        {
          id: 'mark-entry',
          label: 'Mark Entry',
          icon: null,
          path: '/exams/mark-entry',
        },
      ],
    },
  ],
  OfficeAdmin: [
    {
      id: 'analytics',
      label: 'Analytics',
      icon: GraduationCap,
      path: '',
      children: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: FileText,
          path: '/analytics',
        },
        {
          id: 'marks',
          label: 'Marks',
          icon: FileText,
          path: '/analytics/mark-list',
        },
      ],
    },
    {
      id: 'academics-class-student',
      label: 'Class',
      icon: FileText,
      path: '',
      children: [
        {
          id: 'class-dashboard',
          label: 'Dashboard',
          icon: FileText,
          path: '/class/dashboard',
        },
        {
          id: 'class-list',
          label: 'Class List',
          icon: FileText,
          path: '/academics/class',
        },
      ],
    },

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
      id: 'exam-page',
      label: 'Exams',
      icon: FileText,
      path: '',
      children: [
        {
          id: 'exam-list',
          label: 'Exam List',
          icon: null,
          path: '/exams',
        },
        {
          id: 'mark-entry',
          label: 'Mark Entry',
          icon: null,
          path: '/exams/mark-entry',
        },
      ],
    },
    {
      id: 'configurations',
      label: 'Configurations',
      icon: GraduationCap,
      path: '',
      children: [
        {
          id: 'academics-regulation-student',
          label: 'Regulations',
          icon: null,
          path: '/academics/regulation',
        },
        {
          id: 'academics-year',
          label: 'Academic Year',
          icon: null,
          path: '/academics/academic-year',
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
          id: 'academics-subjects-student',
          label: 'Subject Master',
          icon: null,
          path: '/academics/subject-master',
        },
        {
          id: 'academics-subjects-type',
          label: 'Subject Type',
          icon: null,
          path: '/academics/subjects/subject-type',
        },
        {
          id: 'academics-assessment-format',
          label: 'Assessment Format',
          icon: null,
          path: '/academics/subjects/assessment-format',
        },

        {
          id: 'academics-examtype',
          label: 'Exam Type',
          icon: null,
          path: '/academics/examtype',
        },
        {
          id: 'academics-term',
          label: 'Term',
          icon: null,
          path: '/academics/term',
        },
        {
          id: 'academics-grade',
          label: 'Grade',
          icon: null,
          path: '/academics/grade',
        },
        {
          id: 'academics-student-attendance',
          label: 'Student Attendance',
          icon: null,
          path: '/academics/student-attendance',
        },
      ],
    },
  ],
};
