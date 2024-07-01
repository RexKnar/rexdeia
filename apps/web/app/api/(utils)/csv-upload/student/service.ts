import { UserRole } from '@prisma/client';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function addStudentCSV(studentDetails: any) {
  try {
    const promises = [];
    const session = await getServerSession(authOptions);
    for (const studentDetail of studentDetails) {
      promises.push(studentDetail.AadharNumber);
      if (studentDetail.Name && studentDetail.AadharNumber) {
        const classDetail = await db.class.findFirst({
          where: {
            name: studentDetail.Class,
          },
        });
        const sectionDetail = await db.section.findFirst({
          where: {
            name: studentDetail.Section,
            classId: classDetail.id,
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
            username: studentDetail.AadharNumber + '@gmail.com',
          },
        });
        if (!user) {
          user = await db.user.create({
            data: {
              password: `${studentDetail.PhoneNumber}`,
              name: studentDetail.Name,
              email: studentDetail.AadharNumber + '@gmail.com',
              username: studentDetail.AadharNumber + '@gmail.com',
              phoneNumber: studentDetail.PhoneNumber,
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
          lastName: '',
          aadharCardNumber: studentDetail.AadharNumber,
          phoneNumber: studentDetail.PhoneNumber,
          emailId: studentDetail.AadharNumber + '@gmail.com',
          gender: studentDetail.Gender,
          emisNumber: studentDetail.EMISId,
          fatherName: studentDetail.FatherName,
          motherName: studentDetail.MotherName,
          admissionNumber: studentDetail.AdmissionNumber,
          bloodGroup: studentDetail.BloodGroup,
          dob: studentDetail.DateOfBirth,
          additionalAttributes: {
            dateOfJoining: studentDetail.DateOfJoining,
            residentialAddress: studentDetail.Address,
            residentialPostalCode: studentDetail.PinCode,
          },
        };

        const student = await db.student.findFirst({
          where: {
            aadharCardNumber: studentDetail.AadharNumber,
          },
        });

        if (!student && studentDetail.AadharNumber) {
          const createdStudent = await db.student.create({
            data: {
              ...studentWithoutBatchId,
              status: 'Active',
              createdAt: new Date(),
              updatedAt: new Date(),
              studentMapping: {
                create: [
                  {
                    groupId: groupDetail.id,
                    classId: classDetail.id,
                    mediumId: mediumDetail.id,
                    sectionId: sectionDetail.id,
                    batchId: session.currentBatch,
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
              ...(session.currentBatch && {
                batch: {
                  connect: {
                    id: session.currentBatch,
                  },
                },
              }),
              ...(motherTongueDetail.id && {
                motherTongue: {
                  connect: {
                    id: motherTongueDetail.id,
                  },
                },
              }),
              ...(communityDetail.id && {
                community: {
                  connect: {
                    id: communityDetail.id,
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
  } catch (e) {
    return e;
  }
}
