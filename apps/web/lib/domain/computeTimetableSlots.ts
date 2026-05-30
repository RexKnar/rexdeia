import {
  ComputedTimetableSlot,
  DaySession,
  TimetableSlotInput,
} from './timetable';

function toMinutes(time: string): number {
  const [h, m] = (time || '').split(':').map((v) => parseInt(v, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
}

function toHHMM(total: number): string {
  const mins = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Pure helper shared by the API (authoritative persistence) and the builder UI
 * (live preview). Walks the ordered slots from the day's start time, assigning
 * each slot a start/end time and a session. Everything is "Morning" until the
 * Lunch interval is passed; slots after lunch are "Afternoon" (the lunch slot
 * itself stays in the Morning session).
 */
export function computeTimetableSlots(
  dayStartTime: string,
  slots: TimetableSlotInput[]
): ComputedTimetableSlot[] {
  let cursor = toMinutes(dayStartTime);
  let afterLunch = false;

  return slots.map((slot, index) => {
    const start = cursor;
    const duration = Number(slot.durationMins) || 0;
    const end = start + duration;
    cursor = end;

    const session: DaySession = afterLunch ? 'Afternoon' : 'Morning';

    if (slot.kind === 'Interval' && slot.intervalType === 'Lunch') {
      afterLunch = true;
    }

    return {
      ...slot,
      order: index,
      startTime: toHHMM(start),
      endTime: toHHMM(end),
      session,
    };
  });
}
