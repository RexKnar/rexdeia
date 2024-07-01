import { UserRole } from '@prisma/client';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { toTitleCase } from 'lib/utils/formatters';
import { getServerSession } from 'next-auth';

export async function addStaffCSV(staffDetails) {
  try {
    const session = await getServerSession(authOptions);
    const promises = [];
    for (const staffDetail of staffDetails) {
      if (staffDetail.Name && staffDetail.AadharNumber) {
        let user = await db.user.findFirst({
          where: { username: `${staffDetail.Mobile}@gmail.com` },
        });

        if (!user) {
          user = await db.user.create({
            data: {
              password: `${staffDetail.Mobile}`,
              name: staffDetail.Name,
              email: `${staffDetail.Mobile}@gmail.com`,
              username: `${staffDetail.Mobile}@gmail.com`,
              phoneNumber: staffDetail.Mobile,
              role: UserRole.TeachingStaff,
            },
          });

          await db.userOrganization.create({
            data: {
              user: { connect: { id: user.id } },
              organization: { connect: { id: session.organizationId } },
              branch: { connect: { id: session.branchId } },
            },
          });
        }

        const staff = await db.staff.findFirst({
          where: { mobile: staffDetail.Mobile },
        });

        if (!staff) {
          const primarySubjectTitle = toTitleCase(staffDetail.PrimarySubject);
          let primarySubject = await db.subjectMaster.findFirst({
            where: { name: primarySubjectTitle },
          });

          if (!primarySubject) {
            primarySubject = await db.subjectMaster.create({
              data: {
                name: primarySubjectTitle,
                isActive: true,
                branch: { connect: { id: session.branchId } },
              },
            });
          }

          const secondarySubjectTitle = toTitleCase(
            staffDetail.SecondarySubject
          );
          let secondarySubject = await db.subjectMaster.findFirst({
            where: { name: secondarySubjectTitle },
          });

          if (!secondarySubject) {
            secondarySubject = await db.subjectMaster.create({
              data: {
                name: secondarySubjectTitle,
                isActive: true,
                branch: { connect: { id: session.branchId } },
              },
            });
          }

          try {
            const createdStaff = await db.staff.create({
              data: {
                firstName: staffDetail.Name,
                lastName: '',
                aadharCardNumber: staffDetail.AadharNumber,
                mobile: staffDetail.Mobile,
                email: `${staffDetail.Mobile}@gmail.com`,
                gender: staffDetail.Gender,
                udiseNumber: staffDetail.udiseNumber,
                dateOfBirth: new Date(staffDetail.DateOfBirth),
                dateOfJoining: new Date(staffDetail.DateOfAppointment),

                permanentAddress1: staffDetail.Address,

                status: 'Active',
                createdAt: new Date(),
                updatedAt: new Date(),
                user: { connect: { id: user.id } },
                Organization: { connect: { id: session.organizationId } },
                Branch: { connect: { id: session.branchId } },
                primarySubject: primarySubject
                  ? { connect: { id: primarySubject.id } }
                  : undefined,
                secondarySubject: secondarySubject
                  ? { connect: { id: secondarySubject.id } }
                  : undefined,
                community: staffDetail.communityId
                  ? { connect: { id: staffDetail.communityId } }
                  : undefined,
                motherTongue: staffDetail.motherTongueId
                  ? { connect: { id: staffDetail.motherTongueId } }
                  : undefined,
                staffCategory: staffDetail.staffCategoryId
                  ? { connect: { id: staffDetail.staffCategoryId } }
                  : undefined,
                employmentType: staffDetail.employmentTypeId
                  ? { connect: { id: staffDetail.employmentTypeId } }
                  : undefined,
                designation: staffDetail.designationId
                  ? { connect: { id: staffDetail.designationId } }
                  : undefined,
                natureOfPosting: staffDetail.natureOfPostingId
                  ? { connect: { id: staffDetail.natureOfPostingId } }
                  : undefined,
              },
            });

            promises.push(createdStaff);
          } catch (e) {
            console.error('Error creating staff:', e);
          }
        }
      }
    }

    return await Promise.all(promises);
  } catch (e) {
    console.error('Error in addStaffCSV function:', e);
    throw e;
  }
}
