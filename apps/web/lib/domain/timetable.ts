export type SlotKind = 'Period' | 'Interval';
export type IntervalType = 'Lunch' | 'RefreshmentBreak' | 'Other';
export type DaySession = 'Morning' | 'Afternoon';

/** A single slot as authored in the builder / sent to the API (no computed times). */
export type TimetableSlotInput = {
  kind: SlotKind;
  label: string;
  durationMins: number;
  periodTypeId?: string | null;
  intervalType?: IntervalType | null;
};

/** A slot with its computed start/end time and session. */
export type ComputedTimetableSlot = TimetableSlotInput & {
  order: number;
  startTime: string;
  endTime: string;
  session: DaySession;
};

export type SaveTimetableStructureModel = {
  id?: string;
  name: string;
  classLevelId: string;
  dayStartTime: string;
  isActive?: boolean;
  slots: TimetableSlotInput[];
};

export type TimetableSlotModel = ComputedTimetableSlot & {
  id: string;
  structureId: string;
  periodType?: { id: string; name: string } | null;
};

export type TimetableStructureModel = {
  id: string;
  name: string;
  classLevelId: string;
  dayStartTime: string;
  isActive: boolean;
  classLevel?: { id: string; name: string } | null;
  slots: TimetableSlotModel[];
};
