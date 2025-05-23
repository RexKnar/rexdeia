import { UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
// import { AssignLearnerModel } from 'lib/domain/student';
import { getServerSession } from 'next-auth';

export async function assignLearner(student: any) {
  const session = await getServerSession(authOptions);

  let user = await db.user.findFirst({
    where: {
      email: student.emailId,
    },
  });
  if (!user) {
    const hashedPassword = await bcrypt.hash(
      student.phoneNumber || 'hive@2025',
      10
    );
    user = await db.user.create({
      data: {
        password: `${hashedPassword}`,
        name: `${student.firstName} ${student.lastName}`,
        email: student.emailId,
        username: student.emailId,
        phoneNumber: student.phoneNumber,
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
  let createdStudent = await db.student.findFirst({
    where: {
      emailId: student.emailId,
    },
  });
  if (!createdStudent) {
    createdStudent = await db.student.create({
      data: {
        emailId: student.emailId,
        phoneNumber: student.phoneNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        gender: student.gender,
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
        additionalAttributes: {},
        emisNumber: student.phoneNumber,

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
      },
    });
  }

  const isPaidFullPayment =
    student.paymentType === 'FullPayment' || student.paymentType === 'Free'
      ? true
      : false;
  const purchaseOrder = await db.coursePurchaseRecord.create({
    data: {
      course: {
        connect: {
          id: student.courseId,
        },
      },
      isPaid: true,
      user: {
        connect: {
          id: user.id,
        },
      },
      paymentType: student.paymentType,
      paidFullPayment: isPaidFullPayment,
      actualAmount: student.courseAmount,
      discountAmount: parseFloat(student.discountAmount),
      createdAt: new Date(),
      updatedAt: new Date(),
      student: {
        connect: {
          id: createdStudent.id,
        },
      },
      branch: {
        connect: {
          id: session.branchId,
        },
      },
      organization: {
        connect: {
          id: session.organizationId,
        },
      },
    },
  });

  await db.paymentHistory.create({
    data: {
      paymentMethod: student.paymentMethod,
      coursePurchase: {
        connect: {
          id: purchaseOrder.id,
        },
      },
      // purchaseOrderId: purchaseOrder.id,
      paymentDate: new Date(student.paymentDate),
      referenceId: student.referenceId,
      amount: parseFloat(student.paidAmount),
      createdBy: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });

  return createdStudent;
}
