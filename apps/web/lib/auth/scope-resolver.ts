import { cache } from 'react';
import { Session } from 'types/auth';

import { db } from '../db';

export type AcademicRoleCategory =
  | 'Admin'
  | 'BranchManager'
  | 'HM'
  | 'AHM'
  | 'ClassTeacher'
  | 'TeachingStaff'
  | 'Parent'
  | 'Student'
  | 'Other';

export interface UserAcademicSecurityContext {
  userId: string;
  staffId: string | null;
  roleCategory: AcademicRoleCategory;
  isBranchWide: boolean;

  // Resource ID boundaries for active academic year
  assignedClassLevelIds: string[]; // For AHMs
  inchargeSectionIds: string[]; // For Class Teachers (isIncharge: true)
  assignedSectionIds: string[]; // Sections where staff teaches
  assignedSubjectIdsBySection: Record<string, string[]>; // sectionId -> subjectIds[]

  // Action Permissions
  canEditStudents: boolean;

  // Validation functions
  isStudentEditable: (sectionId?: string | null, classLevelId?: string | null) => boolean;
  isMarkEntryAllowed: (sectionId: string, subjectId?: string | null) => boolean;
}

/**
 * Resolves the academic security context and resource boundaries for the active session.
 * Wrapped with React cache() to guarantee exactly one resolution per server request.
 */
export const resolveUserSecurityContext = cache(
  async (session: any): Promise<UserAcademicSecurityContext> => {
    const staffId = session?.user?.staffId || null;
    const currentBatchId = session?.currentBatch;
    const userRoleStr = (session?.user?.role || '').toLowerCase();
    const orgRole = session?.user?.organizationRole;
    const archetypeStr = (orgRole?.archetype || orgRole?.roleType || '').toLowerCase();

    // 1. Check for Admin or Branch Manager (Full Branch Access)
    const isAdmin =
      userRoleStr === 'admin' ||
      archetypeStr === 'admin' ||
      archetypeStr === 'organization_admin';

    const isBranchManager =
      userRoleStr === 'branch_manager' ||
      archetypeStr === 'branch_manager';

    if (isAdmin || isBranchManager) {
      return {
        userId: session?.user?.id || '',
        staffId,
        roleCategory: isAdmin ? 'Admin' : 'BranchManager',
        isBranchWide: true,
        assignedClassLevelIds: [],
        inchargeSectionIds: [],
        assignedSectionIds: [],
        assignedSubjectIdsBySection: {},
        canEditStudents: true,
        isStudentEditable: () => true,
        isMarkEntryAllowed: () => true,
      };
    }

    // 2. Resolve Academic Relationships in parallel
    const [ahmRecords, staffAssignments] = await Promise.all([
      staffId && currentBatchId
        ? db.classLevelIncharge.findMany({
            where: {
              staffId,
              academicYearId: currentBatchId,
              branchId: session.branchId,
            },
            select: { classLevelId: true },
          })
        : [],
      staffId && currentBatchId
        ? db.academicSubjectForStaff.findMany({
            where: {
              staffId,
              academicYearId: currentBatchId,
              deletedAt: null,
            },
            select: {
              sectionId: true,
              subjectId: true,
              isIncharge: true,
            },
          })
        : [],
    ]);

    const assignedClassLevelIds = ahmRecords.map((r) => r.classLevelId);

    const inchargeSectionIds = staffAssignments
      .filter((a) => a.isIncharge)
      .map((a) => a.sectionId);

    const assignedSectionIds = Array.from(
      new Set(staffAssignments.map((a) => a.sectionId))
    );

    const assignedSubjectIdsBySection: Record<string, string[]> = {};
    for (const curr of staffAssignments) {
      if (curr.subjectId) {
        if (!assignedSubjectIdsBySection[curr.sectionId]) {
          assignedSubjectIdsBySection[curr.sectionId] = [];
        }
        if (!assignedSubjectIdsBySection[curr.sectionId].includes(curr.subjectId)) {
          assignedSubjectIdsBySection[curr.sectionId].push(curr.subjectId);
        }
      }
    }

    // Determine Role Category
    const isAHM = assignedClassLevelIds.length > 0 || archetypeStr === 'ahm';
    const isClassTeacher = inchargeSectionIds.length > 0 || archetypeStr === 'class_teacher';
    const isTeachingStaff = staffId !== null && staffAssignments.length > 0;

    let roleCategory: AcademicRoleCategory = 'Other';
    if (userRoleStr === 'hm' || archetypeStr === 'hm') {
      roleCategory = 'HM';
    } else if (isAHM) {
      roleCategory = 'AHM';
    } else if (isClassTeacher) {
      roleCategory = 'ClassTeacher';
    } else if (isTeachingStaff) {
      roleCategory = 'TeachingStaff';
    } else if (userRoleStr === 'student' || archetypeStr === 'student') {
      roleCategory = 'Student';
    } else if (userRoleStr === 'parent' || archetypeStr === 'parent') {
      roleCategory = 'Parent';
    }

    // HM has global academic oversight across branch
    const isHM = roleCategory === 'HM';

    // Can Edit Students:
    // Only Admin, BranchManager, HM, AHM, and the student's Class Teacher!
    // Regular teaching staff CANNOT edit student personal/academic details.
    const canEditStudents = isHM || isAHM || isClassTeacher;

    const isStudentEditable = (
      sectionId?: string | null,
      classLevelId?: string | null
    ): boolean => {
      if (isHM) return true;

      // Class Teacher can edit students in their incharge sections
      if (isClassTeacher && sectionId && inchargeSectionIds.includes(sectionId)) {
        return true;
      }

      // AHM can edit students in their assigned class levels
      if (isAHM && classLevelId && assignedClassLevelIds.includes(classLevelId)) {
        return true;
      }

      return false;
    };

    const isMarkEntryAllowed = (
      sectionId: string,
      subjectId?: string | null
    ): boolean => {
      if (isHM) return true;

      // Class Teacher can review/enter marks for all subjects in their section
      if (inchargeSectionIds.includes(sectionId)) {
        return true;
      }

      // Teaching Staff can only enter marks for their own assigned subject
      if (subjectId) {
        const allowedSubjects = assignedSubjectIdsBySection[sectionId] || [];
        return allowedSubjects.includes(subjectId);
      }

      // If subjectId is not provided, allow if staff teaches at least one subject in that section
      return assignedSectionIds.includes(sectionId);
    };

    return {
      userId: session.user.id,
      staffId,
      roleCategory,
      isBranchWide: isHM,
      assignedClassLevelIds,
      inchargeSectionIds,
      assignedSectionIds,
      assignedSubjectIdsBySection,
      canEditStudents,
      isStudentEditable,
      isMarkEntryAllowed,
    };
  }
);
