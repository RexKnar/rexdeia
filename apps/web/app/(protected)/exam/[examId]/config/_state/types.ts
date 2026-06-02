/**
 * Local state types for the redesigned (bulk) exam-configuration flow.
 *
 * The flow lets a user select MANY classes / sections / subjects at once,
 * define ONE shared configuration, optionally override individual items, then
 * save everything in one confirmed action.
 *
 * State lives in React (useReducer) — not the URL — to avoid the flicker the
 * legacy `exams/[examId]/config` flow had from writing every selection back to
 * the query string.
 */

export type IdName = { id: string; name: string };

/** A single selected subject, scoped to the class it was chosen under. */
export type SelectedSubject = {
  subjectId: string;
  /** subject group id (the API calls this `groupId`). */
  groupId: string;
  name: string;
};

/** One assessment-format partition in the SHARED config (keyed by format name). */
export type SharedPartition = {
  /** stable key for react lists */
  key: string;
  /**
   * Assessment formats are a shared master list; we key the shared partition by
   * name so it can be re-resolved to each subject's own assessmentFormatId at
   * save time (see buildSaveUnits).
   */
  name: string;
  /** representative assessmentFormatId (used when a subject exposes the same id). */
  assessmentFormatId: string;
  totalMarks: string;
  convertTo: string;
  minMark: string;
  dateToConduct: string;
  order: number;
  excludeSubjectValidation: boolean;
};

/** Subject-level marks shared across every selected subject. */
export type SharedSubjectMarks = {
  totalMarks: string;
  convertTo: string;
  minMark: string;
};

/**
 * A per-item override. Keyed by `${classId}:${sectionId}:${subjectId}`.
 * When present, this item is saved on its own call with these partitions
 * instead of the shared ones.
 */
export type ItemOverride = {
  subjectMarks: SharedSubjectMarks;
  partitions: SharedPartition[];
};

export type ConfigState = {
  /** classes ticked in the scope selector */
  selectedClassIds: string[];
  /** classId -> ticked section ids */
  sectionsByClass: Record<string, string[]>;
  /** classId -> selected subjects (accumulated across subject-type filters) */
  subjectsByClass: Record<string, SelectedSubject[]>;

  /** shared config applied to everything unless overridden */
  subjectMarks: SharedSubjectMarks;
  partitions: SharedPartition[];

  /** key -> override */
  overrides: Record<string, ItemOverride>;
};

export const emptySubjectMarks: SharedSubjectMarks = {
  totalMarks: '',
  convertTo: '',
  minMark: '',
};

export const initialConfigState: ConfigState = {
  selectedClassIds: [],
  sectionsByClass: {},
  subjectsByClass: {},
  subjectMarks: { ...emptySubjectMarks },
  partitions: [],
  overrides: {},
};

export type ConfigAction =
  | { type: 'TOGGLE_CLASS'; classId: string }
  | { type: 'SET_CLASS_SECTIONS'; classId: string; sectionIds: string[] }
  | { type: 'TOGGLE_SECTION'; classId: string; sectionId: string }
  | { type: 'TOGGLE_SUBJECT'; classId: string; subject: SelectedSubject }
  | { type: 'SET_CLASS_SUBJECTS'; classId: string; subjects: SelectedSubject[] }
  | { type: 'SET_SUBJECT_MARKS'; marks: Partial<SharedSubjectMarks> }
  | { type: 'ADD_PARTITION'; partition: SharedPartition }
  | { type: 'REMOVE_PARTITION'; key: string }
  | { type: 'UPDATE_PARTITION'; key: string; patch: Partial<SharedPartition> }
  | { type: 'SET_PARTITIONS'; partitions: SharedPartition[] }
  | {
      type: 'APPLY_TEMPLATE';
      marks: SharedSubjectMarks;
      partitions: SharedPartition[];
    }
  | { type: 'SET_OVERRIDE'; key: string; override: ItemOverride }
  | { type: 'CLEAR_OVERRIDE'; key: string }
  | { type: 'RESET' };
