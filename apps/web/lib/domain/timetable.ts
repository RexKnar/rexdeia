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

// --- Period table (grid) ---

export type GridDay = { id: string; name: string };
export type GridSubject = { id: string; name: string };
export type GridStaff = { id: string; name: string; subjectIds: string[] };

export type GridEntry = {
  id?: string;
  dayId: string;
  slotId: string;
  subjectId: string | null;
  staffId: string | null;
};

export type GridConflict = {
  dayId: string;
  slotId: string;
  staffId: string;
  staffName: string;
  withSection: string;
  time: string;
};

export type TimetableGridData = {
  section: {
    id: string;
    name: string;
    classId: string;
    className: string;
    classLevelId: string | null;
  };
  structure: {
    id: string;
    dayStartTime: string;
    slots: TimetableSlotModel[];
  } | null;
  days: GridDay[];
  subjects: GridSubject[];
  staff: GridStaff[];
  entries: GridEntry[];
  conflicts: GridConflict[];
};

export type SaveTimetableGridModel = {
  sectionId: string;
  entries: {
    dayId: string;
    slotId: string;
    subjectId: string | null;
    staffId: string | null;
  }[];
};

// --- Staff attendance & substitution ---

export type AttendanceStatus = 'Present' | 'Absent' | 'Leave';

export type StaffDayRow = {
  id: string;
  name: string;
  status: AttendanceStatus | null;
};

export type StaffAttendanceDayData = {
  dayId: string | null;
  dayName: string;
  staff: StaffDayRow[];
};

export type MarkStaffAttendanceModel = {
  staffId: string;
  date: string;
  status: AttendanceStatus;
  remark?: string;
};

export type SubstitutionPeriod = {
  entryId: string;
  slotLabel: string;
  time: string;
  sectionName: string;
  subjectName: string;
  substituteStaffId: string | null;
};

export type StaffSubstitutionData = {
  dayId: string | null;
  periods: SubstitutionPeriod[];
  candidates: { id: string; name: string }[];
};

export type SaveSubstitutionModel = {
  date: string;
  entryId: string;
  originalStaffId?: string | null;
  substituteStaffId: string | null;
  reason?: string;
};

// --- Staff roster / timetable ---

export type RosterPeriod = {
  entryId: string;
  slotLabel: string;
  startTime: string;
  endTime: string;
  sectionName: string;
  subjectName: string;
};

export type RosterTodayPeriod = {
  slotLabel: string;
  startTime: string;
  endTime: string;
  sectionName: string;
  subjectName: string;
  type: 'regular' | 'covered' | 'substitution';
  otherStaffName?: string;
};

export type StaffRosterData = {
  staff: { id: string; name: string } | null;
  days: { id: string; name: string }[];
  weeklyByDay: Record<string, RosterPeriod[]>;
  today: {
    date: string;
    dayId: string | null;
    dayName: string;
    periods: RosterTodayPeriod[];
  } | null;
};

// --- Student attendance ---

export type StudentAttendanceScope =
  | 'period'
  | 'morning'
  | 'afternoon'
  | 'daily';

export type StudentAttendanceSlot = {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  session: DaySession;
};

export type StudentAttendanceRow = {
  studentId: string;
  name: string;
  rollNumber: number | null;
  status: AttendanceStatus | null;
};

export type StudentAttendanceData = {
  structureMissing: boolean;
  slots: StudentAttendanceSlot[];
  students: StudentAttendanceRow[];
};

export type SaveStudentAttendanceModel = {
  sectionId: string;
  date: string;
  scope: StudentAttendanceScope;
  slotId?: string | null;
  statuses: { studentId: string; status: AttendanceStatus }[];
};
