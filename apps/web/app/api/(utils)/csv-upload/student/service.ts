import bcrypt from 'bcrypt';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';
import { switchStudentToClass } from '../../../class/[id]/students/switch/service';

export async function addStudentCSV(studentDetails: any) {
  const newStudents = [];
  const promotedStudents = [];
  const failedStudents = [];
  const session = await getServerSession(authOptions);

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 1: Collect all unique lookup values from the CSV rows upfront
  // ─────────────────────────────────────────────────────────────────────────
  const uniqueClassNames = Array.from(new Set(studentDetails.map((r: any) => r.Class).filter(Boolean)));
  const uniqueSectionNames = Array.from(new Set(studentDetails.map((r: any) => r.Section).filter(Boolean)));
  const uniqueGroupNames = Array.from(new Set(studentDetails.map((r: any) => r.Group || 'General').filter(Boolean)));
  const uniqueMediumNames = Array.from(new Set(studentDetails.map((r: any) => r.Medium || r.Mediun_1 || 'English').filter(Boolean)));
  const uniqueCommunityNames = Array.from(new Set(studentDetails.map((r: any) => r.Community).filter(Boolean)));
  const uniqueMotherTongues = Array.from(new Set(studentDetails.map((r: any) => r.MotherTongue).filter(Boolean)));
  const uniqueEmisIds = Array.from(new Set(studentDetails.map((r: any) => r.EMISId).filter(Boolean)));

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 2: Bulk-fetch all reference data in parallel — single round-trip
  // ─────────────────────────────────────────────────────────────────────────
  const [
    allClasses,
    allSections,
    allGroups,
    allMediums,
    allCommunities,
    allLanguages,
    existingStudents,
  ] = await Promise.all([
    db.class.findMany({ where: { name: { in: uniqueClassNames as string[] }, branchId: session.branchId } }),
    db.section.findMany({ where: { name: { in: uniqueSectionNames as string[] }, academicYearId: session.currentBatch } }),
    db.group.findMany({ where: { name: { in: uniqueGroupNames as string[] }, isDeleted: false } }),
    db.medium.findMany({ where: { name: { in: uniqueMediumNames as string[] } } }),
    db.community.findMany({ where: { name: { in: uniqueCommunityNames as string[] } } }),
    db.language.findMany({ where: { name: { in: uniqueMotherTongues as string[] } } }),
    db.student.findMany({ where: { emisNumber: { in: uniqueEmisIds as string[] } }, select: { id: true, emisNumber: true } }),
  ]);

  // Build lookup maps for O(1) access per row
  const classMap = new Map(allClasses.map((c) => [c.name, c]));
  // Section map keyed by "sectionName-classId" to handle same name across classes
  const sectionMap = new Map(allSections.map((s) => [`${s.name}-${s.classId}`, s]));
  const groupMap = new Map(allGroups.map((g) => [g.name, g]));
  const mediumMap = new Map(allMediums.map((m) => [m.name, m]));
  const communityMap = new Map(allCommunities.map((c) => [c.name, c]));
  const languageMap = new Map(allLanguages.map((l) => [l.name, l]));
  const existingStudentMap = new Map(existingStudents.map((s) => [s.emisNumber, s]));

  // Fetch existing student mappings for current batch for all returning students in one query
  const returningStudentIds = existingStudents.map((s) => s.id);
  const existingMappings = returningStudentIds.length > 0
    ? await db.studentMapping.findMany({
      where: {
        studentId: { in: returningStudentIds },
        batchId: session.currentBatch,
        isCurrent: true,
      },
      select: { studentId: true, classId: true, sectionId: true },
    })
    : [];

  const activeMappings = new Map<string, { classId: string; sectionId: string | null }>();
  for (const mapping of existingMappings) {
    activeMappings.set(mapping.studentId, {
      classId: mapping.classId,
      sectionId: mapping.sectionId,
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 3: Process each row — DB writes only, no lookups in this loop
  // ─────────────────────────────────────────────────────────────────────────
  for (const studentDetail of studentDetails) {
    try {
      if (!studentDetail.Name || !studentDetail.AadhaarNumber) continue;

      // Resolve class & section from in-memory maps
      const classDetail = classMap.get(studentDetail.Class);
      if (!classDetail) {
        throw new Error(`Class "${studentDetail.Class}" not found`);
      }

      const sectionDetail = sectionMap.get(`${studentDetail.Section}-${classDetail.id}`);
      if (!sectionDetail) {
        throw new Error(`Section "${studentDetail.Section}" not found in Class "${studentDetail.Class}"`);
      }

      const groupDetail = groupMap.get(studentDetail.Group || 'General');
      const mediumDetail = mediumMap.get(studentDetail.Medium || studentDetail.Mediun_1 || 'English');
      const communityDetail = communityMap.get(studentDetail.Community);
      const motherTongueDetail = languageMap.get(studentDetail.MotherTongue);

      // Resolve masked Aadhaar numbers to avoid collisions
      let aadhaar = studentDetail.AadhaarNumber;
      if (aadhaar && (aadhaar.toLowerCase().includes('x') || aadhaar.length < 12)) {
        if (studentDetail.EMISId) {
          aadhaar = studentDetail.EMISId;
        }
      }

      const existingStudent = existingStudentMap.get(studentDetail.EMISId);

      if (!existingStudent && aadhaar) {
        // ── NEW STUDENT: check/create user, then create student + mapping ──
        let user = await db.user.findFirst({
          where: { username: aadhaar + '@gmail.com' },
        });

        if (!user) {
          const hashedPassword = await bcrypt.hash(
            studentDetail.Mobile || studentDetail?.PhoneNumber || 'Password@123',
            10
          );
          user = await db.user.create({
            data: {
              password: hashedPassword,
              name: studentDetail.Name,
              email: aadhaar + '@gmail.com',
              username: aadhaar + '@gmail.com',
              phoneNumber: studentDetail.Mobile || studentDetail?.PhoneNumber || '',
              role: 'Student',
            },
          });

          await db.userOrganization.create({
            data: {
              userId: user.id,
              organizationId: session.organizationId,
              branchId: session.branchId,
            },
          });
        }

        const createdStudent = await db.student.create({
          data: {
            firstName: studentDetail.Name,
            lastName: '',
            aadharCardNumber: aadhaar,
            phoneNumber: studentDetail.Mobile || studentDetail?.PhoneNumber || '',
            emailId: aadhaar + '@gmail.com',
            gender: studentDetail.Gender || '-',
            emisNumber: studentDetail.EMISId,
            fatherName: studentDetail.FatherName || '',
            motherName: studentDetail.MotherName || '',
            admissionNumber: studentDetail.AdmissionNumber || '',
            bloodGroup: studentDetail.BloodGroup || '',
            dob: studentDetail.DateOfBirth || studentDetail.DataOfBirth || '',
            additionalAttributes: {
              dateOfJoining: studentDetail.DateOfJoining || '',
              residentialAddress: studentDetail.Address || '',
              residentialPostalCode: studentDetail.PinCode || '',
            },
            status: 'Active',
            createdAt: new Date(),
            updatedAt: new Date(),
            studentMapping: {
              create: [
                {
                  groupId: groupDetail?.id || '',
                  classId: classDetail.id,
                  mediumId: mediumDetail?.id || '',
                  sectionId: sectionDetail.id,
                  batchId: session.currentBatch,
                },
              ],
            },
            organizationId: session.organizationId,
            branchId: session.branchId,
            userId: user.id,
            ...(session.currentBatch && { batchId: session.currentBatch }),
            ...(motherTongueDetail?.id && { motherTongueId: motherTongueDetail.id }),
            ...(communityDetail?.id && { communityId: communityDetail.id }),
          },
        });

        await db.admissionForm.create({
          data: {
            createdAt: new Date(),
            updatedAt: new Date(),
            studentId: createdStudent.id,
            createdById: session.user.id,
            status: 'DirectStudentEntry',
          },
        });

        newStudents.push(createdStudent);
      } else if (existingStudent) {
        // Resolve if they have an active mapping for this year/batch
        const currentMapping = activeMappings.get(existingStudent.id);

        if (currentMapping) {
          // Student is already mapped in this batch.
          // Check if class/section match the CSV row.
          if (
            currentMapping.classId !== classDetail.id ||
            currentMapping.sectionId !== sectionDetail.id
          ) {
            // Reassign the student to the class and section available in the sheet
            await switchStudentToClass({
              studentId: existingStudent.id,
              classId: classDetail.id,
              sectionId: sectionDetail.id,
              groupId: groupDetail?.id || '',
              academicYear: session.currentBatch,
            });

            // Update in-memory mapping to reflect the switch
            activeMappings.set(existingStudent.id, {
              classId: classDetail.id,
              sectionId: sectionDetail.id,
            });

            promotedStudents.push(existingStudent);
          }
          // If already mapped to the same class/section, silently skip
        } else {
          // Student is not mapped in this batch yet. Promote/map them.
          await db.studentMapping.create({
            data: {
              studentId: existingStudent.id,
              classId: classDetail.id,
              sectionId: sectionDetail.id,
              groupId: groupDetail?.id || '',
              mediumId: mediumDetail?.id || '',
              batchId: session.currentBatch,
              isCurrent: true,
            },
          });

          // Add to in-memory mapping to prevent duplicate mapping if repeated in CSV
          activeMappings.set(existingStudent.id, {
            classId: classDetail.id,
            sectionId: sectionDetail.id,
          });

          promotedStudents.push(existingStudent);
        }
      }
    } catch (rowError: any) {
      console.error(`Error importing student ${studentDetail.Name}:`, rowError);
      failedStudents.push({
        name: studentDetail.Name || 'Unknown Student',
        error: rowError.message || 'Database error occurred',
      });
    }
  }

  return {
    success: true,
    createdCount: newStudents.length,
    promotedCount: promotedStudents.length,
    failedCount: failedStudents.length,
    failedStudents,
  };
}
