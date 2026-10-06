export type ModuleDomain =
  | 'ACADEMICS'
  | 'FINANCE'
  | 'HR'
  | 'LMS'
  | 'PARENT_PORTAL';

export type ModuleAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'export';

export interface ModuleDefinition {
  key: string;
  label: string;
  domain: ModuleDomain;
  description: string;
  actions: ModuleAction[];
  supportsScope: boolean;
}

export const SYSTEM_MODULES = {
  // --- ACADEMICS ---
  STUDENTS: {
    key: 'students',
    label: 'Student Directory & Records',
    domain: 'ACADEMICS',
    description: 'Student profiles, admission details, and academic assignments',
    actions: ['create', 'read', 'update', 'delete', 'export'],
    supportsScope: true, // Supports Branch / ClassLevel / Section scoping
  },
  EXAMS: {
    key: 'exams',
    label: 'Exams & Mark Entry',
    domain: 'ACADEMICS',
    description: 'Exam scheduling, partition configs, and grade/mark entries',
    actions: ['create', 'read', 'update', 'delete', 'export'],
    supportsScope: true, // Supports Branch / ClassLevel / Section / Subject scoping
  },
  CLASSES_SECTIONS: {
    key: 'classes_sections',
    label: 'Classes & Sections',
    domain: 'ACADEMICS',
    description: 'Class, grade, medium, and section structures',
    actions: ['create', 'read', 'update', 'delete'],
    supportsScope: true,
  },
  ACADEMIC_ANALYTICS: {
    key: 'academic_analytics',
    label: 'Academic Analytics & Reports',
    domain: 'ACADEMICS',
    description: 'Performance charts, exam metrics, and pass percentages',
    actions: ['read', 'export'],
    supportsScope: true,
  },
  TIMETABLE: {
    key: 'timetable',
    label: 'Timetable & Staff Workload',
    domain: 'ACADEMICS',
    description: 'Period masters, class schedules, and timetable grids',
    actions: ['create', 'read', 'update', 'delete'],
    supportsScope: true,
  },
  STAFF_ACADEMICS: {
    key: 'staff_academics',
    label: 'Staff Subject & Section Assignments',
    domain: 'ACADEMICS',
    description: 'Class teacher incharge and subject mapping',
    actions: ['create', 'read', 'update', 'delete'],
    supportsScope: true,
  },

  // --- FINANCE (Future-Proofing) ---
  FEES_COLLECTION: {
    key: 'fees_collection',
    label: 'Fee Collection & Cashiering',
    domain: 'FINANCE',
    description: 'Student fee collection, receipts, and offline payment recording',
    actions: ['create', 'read', 'update', 'delete', 'export'],
    supportsScope: true,
  },
  FEE_STRUCTURE: {
    key: 'fee_structure',
    label: 'Fee Structures & Invoicing',
    domain: 'FINANCE',
    description: 'Fee category setup, due date definitions, and billing batches',
    actions: ['create', 'read', 'update', 'delete'],
    supportsScope: false,
  },
  FINANCIAL_AUDIT: {
    key: 'financial_audit',
    label: 'Accounting Reports & Ledgers',
    domain: 'FINANCE',
    description: 'Daily collection logs, outstanding dues, and audit trails',
    actions: ['read', 'export'],
    supportsScope: false,
  },

  // --- HR & PAYROLL (Future-Proofing) ---
  STAFF_DIRECTORY: {
    key: 'staff_directory',
    label: 'Staff Directory & Employment Contracts',
    domain: 'HR',
    description: 'Employee profiles, designations, and qualification records',
    actions: ['create', 'read', 'update', 'delete', 'export'],
    supportsScope: true,
  },
  PAYROLL: {
    key: 'payroll',
    label: 'Payroll Processing & Salary Slips',
    domain: 'HR',
    description: 'Salary structures, monthly pay runs, and payslip generation',
    actions: ['create', 'read', 'update', 'delete', 'export'],
    supportsScope: false,
  },
  STAFF_LEAVES: {
    key: 'staff_leaves',
    label: 'Staff Leaves & Attendance',
    domain: 'HR',
    description: 'Daily staff attendance, leave applications, and approval workflows',
    actions: ['create', 'read', 'update', 'delete'],
    supportsScope: true,
  },

  // --- LMS & COURSES (Future-Proofing) ---
  LIVE_CLASSES: {
    key: 'live_classes',
    label: 'Live Class Rooms & Sessions',
    domain: 'LMS',
    description: 'Interactive live video classrooms and attendance logs',
    actions: ['create', 'read', 'update', 'delete'],
    supportsScope: true,
  },
  COURSE_CONTENT: {
    key: 'course_content',
    label: 'Recorded Courses & Curriculum',
    domain: 'LMS',
    description: 'Video lessons, lesson notes, and uploaded learning materials',
    actions: ['create', 'read', 'update', 'delete'],
    supportsScope: true,
  },
  COURSE_COMMERCE: {
    key: 'course_commerce',
    label: 'Course Pricing & Subscriptions',
    domain: 'LMS',
    description: 'Course catalog pricing, bundles, and student purchases',
    actions: ['create', 'read', 'update', 'delete'],
    supportsScope: false,
  },

  // --- PARENT PORTAL (Future-Proofing) ---
  PARENT_WARD_PROFILE: {
    key: 'parent_ward_profile',
    label: 'Ward Profile & Information',
    domain: 'PARENT_PORTAL',
    description: 'Child academic and personal profile view',
    actions: ['read'],
    supportsScope: true, // Strictly OWN_WARDS
  },
  PARENT_ATTENDANCE: {
    key: 'parent_attendance',
    label: 'Ward Attendance & Leave Requests',
    domain: 'PARENT_PORTAL',
    description: 'Daily and period attendance view; leave request submissions',
    actions: ['read', 'create'],
    supportsScope: true,
  },
  PARENT_ACADEMIC_PROGRESS: {
    key: 'parent_academic_progress',
    label: 'Ward Marks & Report Cards',
    domain: 'PARENT_PORTAL',
    description: 'Published report cards, test marks, and teacher remarks',
    actions: ['read', 'export'],
    supportsScope: true,
  },
  PARENT_FEE_PAYMENTS: {
    key: 'parent_fee_payments',
    label: 'Ward Fee Payments & Receipts',
    domain: 'PARENT_PORTAL',
    description: 'Online fee payment, due dates, and downloadable receipts',
    actions: ['read', 'create', 'export'],
    supportsScope: true,
  },
  PARENT_TIMETABLE: {
    key: 'parent_timetable',
    label: 'Ward Timetable & Calendar',
    domain: 'PARENT_PORTAL',
    description: 'Weekly periods, holidays, and school academic calendar',
    actions: ['read'],
    supportsScope: true,
  },
  PARENT_ANNOUNCEMENTS: {
    key: 'parent_announcements',
    label: 'School Announcements & Circulars',
    domain: 'PARENT_PORTAL',
    description: 'General school circulars and notification broadcasts',
    actions: ['read'],
    supportsScope: true,
  },
} as const satisfies Record<string, ModuleDefinition>;

export type SystemModuleKey = keyof typeof SYSTEM_MODULES;

/**
 * Returns modules grouped by domain for rendering in Flyouts / Tabs
 */
export function getModulesByDomain(): Record<ModuleDomain, ModuleDefinition[]> {
  const grouped: Record<ModuleDomain, ModuleDefinition[]> = {
    ACADEMICS: [],
    FINANCE: [],
    HR: [],
    LMS: [],
    PARENT_PORTAL: [],
  };

  Object.values(SYSTEM_MODULES).forEach((mod) => {
    grouped[mod.domain].push(mod);
  });

  return grouped;
}
