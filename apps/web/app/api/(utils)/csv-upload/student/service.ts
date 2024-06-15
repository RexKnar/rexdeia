import { UserRole } from '@prisma/client';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function addStudentCSV(payload: any) {
  const response = await db.$transaction(async (prisma) => {
    const promises = [];

    for (const community of payload) {
      if (community.name) {
        const promise = prisma.community.create({
          data: {
            name: community.name,
            isActive: community.isActive == 'TRUE' ? true : false,
          },
        });
        promises.push(promise);
      }
    }
    return Promise.all(promises);
  });
  return response.flat();
}

export async function addStudent(studentDetails: any) {
  const promises = [];
  const session = await getServerSession(authOptions);
  for (const studentDetail of studentDetails) {
    if (studentDetail.name && studentDetail.aadharCardNumber) {
      const sectionDetail = await db.section.findFirst({
        where: {
          name: studentDetail.Section,
        },
      });
      const communityDetail = await db.community.findFirst({
        where: {
          name: studentDetail.Community,
        },
      });
      const groupDetail = await db.group.findFirst({
        where: {
          name: studentDetail.Group,
        },
      });
      const mediumDetail = await db.medium.findFirst({
        where: {
          name: studentDetail.Medium,
        },
      });

      const motherTongueDetail = await db.language.findFirst({
        where: {
          name: studentDetail.MotherTongue,
        },
      });

      let user = await db.user.findFirst({
        where: {
          phoneNumber: studentDetail.PhoneNumber,
        },
      });
      if (!user) {
        user = await db.user.create({
          data: {
            password: '',
            name: studentDetail.name,
            email: studentDetail.phone_number + '@gmail.com',
            username: studentDetail.phone_number + '@gmail.com',
            phoneNumber: studentDetail.phone_number,
            role: UserRole.Student,
          },
        });

        await db.userOrganization.create({
          data: {
            user: {
              connect: {
                id: user.id,
              },
            },
            organization: {
              connect: {
                id: session.organizationId,
              },
            },
            branch: {
              connect: {
                id: session.branchId,
              },
            },
          },
        });
      }

      const studentWithoutBatchId = {
        firstName: studentDetail.Name,
        aadharCardNumber: studentDetail.AadharNumber,
        phoneNumber: studentDetail.PhoneNumber,
        email: studentDetail.phone_number + '@gmail.com',
        gender: studentDetail.Gender,
        dob: studentDetail.DateOfBirth,
        sectionId: sectionDetail.id,
        groupId: groupDetail.id,
        mediumId: mediumDetail.id,
        motherTongueId: motherTongueDetail.id,
        communityId: communityDetail.id,
        emisNumber: studentDetail.EMISId,
      };
      delete studentWithoutBatchId['batchId'];
      delete studentWithoutBatchId['motherTongueId'];
      delete studentWithoutBatchId['communityId'];

      const student = await db.student.findFirst({
        where: {
          aadharCardNumber: studentDetail.aadharCardNumber,
        },
      });
      if (!student && !studentDetail.aadharCardNumber) {
        const createdStudent = await db.student.create({
          data: {
            ...studentWithoutBatchId,
            status: 'Active',
            createdAt: new Date(),
            updatedAt: new Date(),
            studentMapping: {
              create: [
                {
                  groupId: student.additionalAttributes.joiningGroup,
                  classId: student.additionalAttributes.joiningClass,
                  mediumId: student.additionalAttributes.joiningMedium,
                },
              ],
            },
            organization: {
              connect: {
                id: session.organizationId,
              },
            },
            branch: {
              connect: {
                id: session.branchId,
              },
            },
            user: {
              connect: {
                id: user.id,
              },
            },
            ...(student.batchId && {
              batch: {
                connect: {
                  id: student.batchId,
                },
              },
            }),
            ...(student.motherTongueId && {
              motherTongue: {
                connect: {
                  id: student.motherTongueId,
                },
              },
            }),
            ...(student.communityId && {
              community: {
                connect: {
                  id: student.communityId,
                },
              },
            }),
          },
        });

        await db.admissionForm.create({
          data: {
            createdAt: new Date(),
            updatedAt: new Date(),
            student: {
              connect: {
                id: createdStudent.id,
              },
            },
            createdBy: {
              connect: {
                id: session.user.id,
              },
            },
            status: 'DirectStudentEntry',
          },
        });
        promises.push(createdStudent);
      }
    }
  }
  return promises;
}
