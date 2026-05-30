import { computeTimetableSlots } from 'lib/domain/computeTimetableSlots';
import { SaveTimetableStructureModel } from 'lib/domain/timetable';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

const slotInclude = {
  slots: {
    where: { isDeleted: false },
    orderBy: { order: 'asc' as const },
    include: { periodType: { select: { id: true, name: true } } },
  },
  classLevel: { select: { id: true, name: true } },
};

function buildSlotData(payload: SaveTimetableStructureModel) {
  return computeTimetableSlots(payload.dayStartTime, payload.slots).map(
    (slot) => ({
      order: slot.order,
      kind: slot.kind,
      label: slot.label,
      startTime: slot.startTime,
      endTime: slot.endTime,
      durationMins: Number(slot.durationMins) || 0,
      session: slot.session,
      periodTypeId: slot.kind === 'Period' ? slot.periodTypeId ?? null : null,
      intervalType: slot.kind === 'Interval' ? slot.intervalType ?? null : null,
    })
  );
}

export async function getTimetableStructures(classLevelId?: string) {
  const session = await getServerSession(authOptions);

  return db.timetableStructure.findMany({
    where: {
      isDeleted: false,
      branchId: session.branchId,
      organizationId: session.organizationId,
      ...(classLevelId && { classLevelId }),
    },
    include: slotInclude,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getTimetableStructureById(id: string) {
  const session = await getServerSession(authOptions);
  return db.timetableStructure.findFirst({
    where: {
      id,
      branchId: session.branchId,
      organizationId: session.organizationId,
    },
    include: slotInclude,
  });
}

export async function createTimetableStructure(
  payload: SaveTimetableStructureModel
) {
  const session = await getServerSession(authOptions);

  return db.timetableStructure.create({
    data: {
      name: payload.name,
      dayStartTime: payload.dayStartTime,
      isActive: payload.isActive ?? true,
      classLevel: { connect: { id: payload.classLevelId } },
      branch: { connect: { id: session.branchId } },
      organization: { connect: { id: session.organizationId } },
      slots: { create: buildSlotData(payload) },
    },
    include: slotInclude,
  });
}

export async function updateTimetableStructure(
  id: string,
  payload: SaveTimetableStructureModel
) {
  const session = await getServerSession(authOptions);

  // Replace-all: the structure's slots are configuration with no dependent
  // records yet (timetable entries are assigned in a later phase), so we
  // rebuild them from the payload inside a transaction.
  return db.$transaction(async (tx) => {
    await tx.timetableSlot.deleteMany({ where: { structureId: id } });

    return tx.timetableStructure.update({
      where: { id },
      data: {
        name: payload.name,
        dayStartTime: payload.dayStartTime,
        ...(payload.isActive !== undefined && { isActive: payload.isActive }),
        classLevel: { connect: { id: payload.classLevelId } },
        branch: { connect: { id: session.branchId } },
        organization: { connect: { id: session.organizationId } },
        slots: { create: buildSlotData(payload) },
      },
      include: slotInclude,
    });
  });
}

export async function deleteTimetableStructure(id: string) {
  return db.timetableStructure.update({
    where: { id },
    data: { isDeleted: true, isActive: false },
  });
}
