import bcrypt from 'bcrypt';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function addStudentCSV(studentDetails: any) {
  const promises = [];
  const failedStudents = [];
  const session = await getServerSession(authOptions);

  for (const studentDetail of studentDetails) {
    try {
      if (studentDetail.Name && studentDetail.AadhaarNumber) {
        const classDetail = await db.class.findFirst({
          where: {
            name: studentDetail.Class,
          },
        });

        if (!classDetail) {
          throw new Error(`Class "${studentDetail.Class}" not found`);
        }

        const sectionDetail = await db.section.findFirst({
          where: {
            name: studentDetail.Section,
            classId: classDetail.id,
            academicYearId: session.currentBatch,
          },
        });

        if (!sectionDetail) {
          throw new Error(`Section "${studentDetail.Section}" not found in Class "${studentDetail.Class}"`);
        }

        const communityDetail = await db.community.findFirst({
          where: {
            name: studentDetail.Community,
          },
        });
        const groupDetail = await db.group.findFirst({
          where: {
            name: studentDetail.Group || 'General',
            isDeleted: false,
          },
        });
        const mediumDetail = await db.medium.findFirst({
          where: {
            name: studentDetail.Medium || studentDetail.Mediun_1 || 'English',
          },
        });

        const motherTongueDetail = await db.language.findFirst({
          where: {
            name: studentDetail.MotherTongue,
          },
        });

        // Resolve masked Aadhaar numbers to avoid collisions
        let aadhaar = studentDetail.AadhaarNumber;
        if (aadhaar && (aadhaar.toLowerCase().includes('x') || aadhaar.length < 12)) {
          if (studentDetail.EMISId) {
            aadhaar = studentDetail.EMISId;
          }
        }

        let user = await db.user.findFirst({
          where: {
            username: aadhaar + '@gmail.com',
          },
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
        };

        const student = await db.student.findFirst({
          where: {
            emisNumber: studentDetail.EMISId,
          },
        });
        if (!student && aadhaar) {
          const createdStudent = await db.student.create({
            data: {
              ...studentWithoutBatchId,
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
              ...(motherTongueDetail?.id && {
                motherTongue: {
                  connect: {
                    id: motherTongueDetail.id,
                  },
                },
              }),
              ...(communityDetail?.id && {
                community: {
                  connect: {
                    id: communityDetail.id,
                  },
                },
              }),
            },
          });

          promises.push(createdStudent);
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
    createdCount: promises.length / 2,
    failedCount: failedStudents.length,
    failedStudents,
  };
}
