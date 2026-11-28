import { db } from 'lib/db';
import { sendMulticastPushNotification } from 'lib/firebase-admin';

export type TargetRole = 'ALL' | 'STAFF' | 'TEACHING_STAFF' | 'STUDENT' | 'PARENT';
export type NotificationType = 'EXAM_LIVE' | 'ANNOUNCEMENT' | 'EXAM_UPDATE' | 'GENERAL';
export type NotificationPriority = 'NORMAL' | 'HIGH';

export interface DispatchNotificationParams {
  title: string;
  body: string;
  type: NotificationType;
  priority?: NotificationPriority;
  targetRole?: TargetRole;
  branchId: string;
  organizationId?: string;
  classId?: string;
  sectionId?: string;
  data?: Record<string, any>;
  createdById?: string;
}

/**
 * Register or update an FCM device token for a user
 */
export async function registerDeviceToken(params: {
  userId: string;
  token: string;
  platform: 'WEB' | 'ANDROID' | 'IOS';
  deviceInfo?: string;
}) {
  const { userId, token, platform, deviceInfo } = params;

  return db.deviceToken.upsert({
    where: { token },
    update: {
      userId,
      platform,
      deviceInfo,
      updatedAt: new Date(),
    },
    create: {
      userId,
      token,
      platform,
      deviceInfo,
    },
  });
}

/**
 * Unregister a device token on logout
 */
export async function unregisterDeviceToken(token: string) {
  try {
    return await db.deviceToken.deleteMany({
      where: { token },
    });
  } catch (err) {
    console.error('[NotificationService] Error deleting device token:', err);
    return null;
  }
}

/**
 * Resolve target user IDs based on branch, role, and optional class/section filter
 */
export async function resolveAudienceUserIds(params: {
  branchId: string;
  targetRole?: TargetRole;
  classId?: string;
  sectionId?: string;
}): Promise<string[]> {
  const { branchId, targetRole = 'ALL', classId, sectionId } = params;
  const userIdsSet = new Set<string>();

  // 1. Resolve Staff
  if (targetRole === 'ALL' || targetRole === 'STAFF' || targetRole === 'TEACHING_STAFF') {
    const staffWhere: any = {
      branchId,
      isDeleted: false,
    };

    if (targetRole === 'TEACHING_STAFF') {
      staffWhere.user = {
        role: 'TeachingStaff',
      };
    }

    // If section or class specified, we can match staff teaching that section
    if (sectionId) {
      staffWhere.StaffSection = {
        some: { sectionId },
      };
    } else if (classId) {
      staffWhere.StaffSection = {
        some: { section: { classId } },
      };
    }

    const staffList = await db.staff.findMany({
      where: staffWhere,
      select: { userId: true },
    });

    staffList.forEach((s) => {
      if (s.userId) userIdsSet.add(s.userId);
    });
  }

  // 2. Resolve Students / Parents
  if (targetRole === 'ALL' || targetRole === 'STUDENT' || targetRole === 'PARENT') {
    const mappingWhere: any = {
      isCurrent: true,
      onHold: false,
      student: {
        branchId,
        isDeleted: false,
      },
    };

    if (sectionId) {
      mappingWhere.sectionId = sectionId;
    }
    if (classId) {
      mappingWhere.classId = classId;
    }

    const mappings = await db.studentMapping.findMany({
      where: mappingWhere,
      select: {
        student: {
          select: {
            userId: true,
            emailId: true,
            fatherEmailId: true,
            motherEmailId: true,
          },
        },
      },
    });

    mappings.forEach((m) => {
      if (m.student?.userId) {
        if (targetRole === 'ALL' || targetRole === 'STUDENT') {
          userIdsSet.add(m.student.userId);
        }
      }
    });

    // If parents have registered user accounts, match by email
    if (targetRole === 'ALL' || targetRole === 'PARENT') {
      const parentEmails = mappings
        .flatMap((m) => [m.student?.fatherEmailId, m.student?.motherEmailId])
        .filter((email): email is string => Boolean(email && email.trim()));

      if (parentEmails.length > 0) {
        const parentUsers = await db.user.findMany({
          where: { email: { in: parentEmails } },
          select: { id: true },
        });
        parentUsers.forEach((u) => userIdsSet.add(u.id));
      }
    }
  }

  return Array.from(userIdsSet);
}

/**
 * Creates notification record, links recipients, and sends multicast FCM push notification
 */
export async function createAndDispatchNotification(params: DispatchNotificationParams) {
  const {
    title,
    body,
    type,
    priority = 'NORMAL',
    targetRole = 'ALL',
    branchId,
    organizationId,
    classId,
    sectionId,
    data = {},
    createdById,
  } = params;

  // 1. Resolve recipients
  const targetUserIds = await resolveAudienceUserIds({
    branchId,
    targetRole,
    classId,
    sectionId,
  });

  // 2. Persist Notification in DB
  const notification = await db.notification.create({
    data: {
      title,
      body,
      type,
      priority,
      targetRole,
      branchId,
      organizationId,
      classId,
      sectionId,
      data,
      createdById,
    },
  });

  if (targetUserIds.length === 0) {
    return {
      notification,
      recipientCount: 0,
      pushResults: { successCount: 0, failureCount: 0 },
    };
  }

  // 3. Create NotificationRecipient records in chunks
  const recipientData = targetUserIds.map((userId) => ({
    notificationId: notification.id,
    userId,
    isRead: false,
  }));

  const RECIPIENT_CHUNK = 1000;
  for (let i = 0; i < recipientData.length; i += RECIPIENT_CHUNK) {
    await db.notificationRecipient.createMany({
      data: recipientData.slice(i, i + RECIPIENT_CHUNK),
      skipDuplicates: true,
    });
  }

  // 4. Retrieve FCM device tokens for recipients
  const deviceTokens = await db.deviceToken.findMany({
    where: {
      userId: { in: targetUserIds },
    },
    select: { token: true },
  });

  const tokens = deviceTokens.map((d) => d.token);

  // 5. Send FCM Multicast Push
  const stringifiedData: Record<string, string> = {
    notificationId: notification.id,
    type,
    ...Object.entries(data).reduce(
      (acc, [k, v]) => ({ ...acc, [k]: String(v) }),
      {}
    ),
  };

  const pushResult = await sendMulticastPushNotification({
    tokens,
    title,
    body,
    data: stringifiedData,
  });

  // 6. Clean up invalid/expired tokens
  if (pushResult.invalidTokens.length > 0) {
    await db.deviceToken.deleteMany({
      where: {
        token: { in: pushResult.invalidTokens },
      },
    });
  }

  return {
    notification,
    recipientCount: targetUserIds.length,
    pushResults: pushResult,
  };
}

/**
 * Triggered when an exam is created/updated and live (isActive: true)
 */
export async function notifyExamLive(params: {
  examId: string;
  branchId: string;
  createdById?: string;
}) {
  const { examId, branchId, createdById } = params;

  const exam = await db.exam.findUnique({
    where: { id: examId },
    include: {
      examType: true,
      term: true,
      batch: true,
      examGroup: {
        select: {
          sectionId: true,
          classId: true,
        },
      },
    },
  });

  if (!exam || !exam.isActive) {
    return null;
  }

  const sectionIds = Array.from(
    new Set(exam.examGroup.map((eg) => eg.sectionId).filter(Boolean))
  ) as string[];

  const classIds = Array.from(
    new Set(exam.examGroup.map((eg) => eg.classId).filter(Boolean))
  ) as string[];

  const title = `Exam Live: ${exam.name}`;
  const termName = exam.term?.name ? ` for ${exam.term.name}` : '';
  const body = `The exam schedule and configuration for "${exam.name}"${termName} is now live and published.`;

  // Dispatch to all relevant staff, students, and parents
  const userIdsSet = new Set<string>();

  // If exam is linked to specific classes/sections, resolve students & teachers for those
  if (sectionIds.length > 0 || classIds.length > 0) {
    for (const secId of sectionIds) {
      const uids = await resolveAudienceUserIds({
        branchId,
        targetRole: 'ALL',
        sectionId: secId,
      });
      uids.forEach((id) => userIdsSet.add(id));
    }

    for (const cId of classIds) {
      const uids = await resolveAudienceUserIds({
        branchId,
        targetRole: 'ALL',
        classId: cId,
      });
      uids.forEach((id) => userIdsSet.add(id));
    }
  } else {
    // Branch-wide exam
    const uids = await resolveAudienceUserIds({
      branchId,
      targetRole: 'ALL',
    });
    uids.forEach((id) => userIdsSet.add(id));
  }

  const targetUserIds = Array.from(userIdsSet);

  // Persist notification
  const notification = await db.notification.create({
    data: {
      title,
      body,
      type: 'EXAM_LIVE',
      priority: 'HIGH',
      targetRole: 'ALL',
      branchId,
      data: {
        examId: exam.id,
        examName: exam.name,
        url: `/exams/${exam.id}`,
      },
      createdById,
    },
  });

  if (targetUserIds.length === 0) {
    return { notification, recipientCount: 0 };
  }

  // Create recipients in batches
  const recipientData = targetUserIds.map((userId) => ({
    notificationId: notification.id,
    userId,
    isRead: false,
  }));

  const RECIPIENT_CHUNK = 1000;
  for (let i = 0; i < recipientData.length; i += RECIPIENT_CHUNK) {
    await db.notificationRecipient.createMany({
      data: recipientData.slice(i, i + RECIPIENT_CHUNK),
      skipDuplicates: true,
    });
  }

  // Push notifications
  const deviceTokens = await db.deviceToken.findMany({
    where: { userId: { in: targetUserIds } },
    select: { token: true },
  });

  const tokens = deviceTokens.map((d) => d.token);

  const pushResult = await sendMulticastPushNotification({
    tokens,
    title,
    body,
    data: {
      examId: exam.id,
      url: `/exams/${exam.id}`,
      type: 'EXAM_LIVE',
    },
  });

  if (pushResult.invalidTokens.length > 0) {
    await db.deviceToken.deleteMany({
      where: { token: { in: pushResult.invalidTokens } },
    });
  }

  return { notification, recipientCount: targetUserIds.length, pushResult };
}

/**
 * Fetch in-app notifications for a user with pagination and unread status
 */
export async function getUserNotifications(params: {
  userId: string;
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}) {
  const { userId, page = 1, limit = 20, unreadOnly = false } = params;
  const skip = (page - 1) * limit;

  const where: any = { userId };
  if (unreadOnly) {
    where.isRead = false;
  }

  const [recipients, totalCount, unreadCount] = await Promise.all([
    db.notificationRecipient.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        notification: {
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    }),
    db.notificationRecipient.count({ where }),
    db.notificationRecipient.count({
      where: { userId, isRead: false },
    }),
  ]);

  const items = recipients.map((r) => ({
    recipientId: r.id,
    notificationId: r.notificationId,
    title: r.notification.title,
    body: r.notification.body,
    type: r.notification.type,
    priority: r.notification.priority,
    data: r.notification.data,
    createdAt: r.notification.createdAt,
    isRead: r.isRead,
    readAt: r.readAt,
    createdBy: r.notification.createdBy,
  }));

  return {
    items,
    totalCount,
    unreadCount,
    page,
    totalPages: Math.ceil(totalCount / limit),
  };
}

/**
 * Mark specific notification recipients as read
 */
export async function markNotificationsAsRead(params: {
  userId: string;
  recipientIds?: string[];
  notificationIds?: string[];
}) {
  const { userId, recipientIds, notificationIds } = params;
  const where: any = { userId, isRead: false };

  if (recipientIds && recipientIds.length > 0) {
    where.id = { in: recipientIds };
  } else if (notificationIds && notificationIds.length > 0) {
    where.notificationId = { in: notificationIds };
  }

  return db.notificationRecipient.updateMany({
    where,
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string) {
  return db.notificationRecipient.updateMany({
    where: { userId, isRead: false },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  return db.notificationRecipient.count({
    where: { userId, isRead: false },
  });
}
