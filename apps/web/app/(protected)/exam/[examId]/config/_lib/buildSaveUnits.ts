import {
  ConfigState,
  IdName,
  SelectedSubject,
  SharedPartition,
  SharedSubjectMarks,
} from '../_state/types';

/**
 * A single save call. The redesigned flow produces these PER SUBJECT, because
 * the assessment formats (exam partitions) a subject gets must be limited to
 * the formats that subject actually owns — e.g. 6th-std Maths only has FA/SA,
 * a higher-class subject may only have Theory + Practical. A shared config can
 * toggle every format, but each subject is saved with just the ones it has.
 *
 *  - Class with NO per-item overrides → one call per subject (all sections).
 *  - Class WITH overrides → one call per (section, subject) cell so overridden
 *    cells carry their own config.
 *
 * Subjects whose owned formats don't intersect the chosen ones are skipped and
 * reported via `warnings` (no empty config is sent).
 *
 * `payload` mirrors the shape the legacy (single-subject) ExamConfigureFlyout
 * sent, which is the shape the backend is known to accept.
 */
export type SaveUnit = {
  id: string;
  classId: string;
  className: string;
  sectionIds: string[];
  sectionLabel: string;
  subjects: SelectedSubject[];
  subjectLabel: string;
  warnings: string[];
  /** null when the subject owns none of the chosen formats (skipped). */
  payload: Record<string, unknown> | null;
};

export function overrideKey(
  classId: string,
  sectionId: string,
  subjectId: string
) {
  return `${classId}:${sectionId}:${subjectId}`;
}

type Lookups = {
  examId: string;
  bySubject: Record<string, IdName[]>;
  classNameById: (id: string) => string;
  sectionNameById: (id: string) => string;
};

/**
 * Keeps only the partitions whose assessment format the subject actually owns,
 * resolving each by NAME to that subject's own assessmentFormatId.
 */
function configDetailForSubject(
  partitions: SharedPartition[],
  subject: SelectedSubject,
  bySubject: Record<string, IdName[]>
): Record<string, unknown>[] {
  const owned = bySubject[subject.subjectId] ?? [];
  return partitions
    .map((p) => {
      const match = owned.find((f) => f.name === p.name);
      if (!match) return null;
      return {
        assessmentFormatId: match.id,
        name: p.name,
        order: p.order,
        dateToConduct: p.dateToConduct,
        totalMarks: Number(p.totalMarks),
        convertTo: Number(p.convertTo),
        minMark: Number(p.minMark),
        excludeSubjectValidation: p.excludeSubjectValidation,
      };
    })
    .filter(Boolean) as Record<string, unknown>[];
}

/** Names of chosen formats the subject does NOT own (for an info warning). */
function skippedFormatNames(
  partitions: SharedPartition[],
  subject: SelectedSubject,
  bySubject: Record<string, IdName[]>
): string[] {
  const owned = bySubject[subject.subjectId] ?? [];
  return partitions
    .filter((p) => !owned.some((f) => f.name === p.name))
    .map((p) => p.name);
}

function buildPayload(
  examId: string,
  classId: string,
  sectionIds: string[],
  subject: SelectedSubject,
  marks: SharedSubjectMarks,
  configDetail: Record<string, unknown>[]
): Record<string, unknown> {
  return {
    examId,
    classId,
    sectionIds,
    subjects: [{ subjectId: subject.subjectId, groupId: subject.groupId }],
    subjectTotalMarks: Number(marks.totalMarks),
    subjectMarksToConvert: Number(marks.convertTo),
    minMark: Number(marks.minMark),
    configDetail,
  };
}

export function buildSaveUnits(
  state: ConfigState,
  { examId, bySubject, classNameById, sectionNameById }: Lookups
): SaveUnit[] {
  const units: SaveUnit[] = [];

  for (const classId of state.selectedClassIds) {
    const sectionIds = state.sectionsByClass[classId] ?? [];
    const subjects = state.subjectsByClass[classId] ?? [];
    if (!sectionIds.length || !subjects.length) continue;

    const className = classNameById(classId);
    const classHasOverride = sectionIds.some((sec) =>
      subjects.some((sub) =>
        Boolean(state.overrides[overrideKey(classId, sec, sub.subjectId)])
      )
    );

    // Section groupings: one bulk group (all sections) when no overrides,
    // otherwise one group per section so overrides can differ per section.
    const sectionGroups = classHasOverride
      ? sectionIds.map((s) => [s])
      : [sectionIds];

    for (const group of sectionGroups) {
      for (const subject of subjects) {
        const key = overrideKey(classId, group[0], subject.subjectId);
        const override = classHasOverride ? state.overrides[key] : undefined;
        const marks = override?.subjectMarks ?? state.subjectMarks;
        const partitions = override?.partitions ?? state.partitions;

        const configDetail = configDetailForSubject(
          partitions,
          subject,
          bySubject
        );
        const skipped = skippedFormatNames(partitions, subject, bySubject);

        const warnings: string[] = [];
        if (configDetail.length === 0) {
          warnings.push(
            `${subject.name} has none of the selected assessment formats — skipped`
          );
        } else if (skipped.length) {
          warnings.push(
            `${subject.name}: ${skipped.join(', ')} not applicable (skipped)`
          );
        }

        units.push({
          id: classHasOverride ? key : `${classId}:${subject.subjectId}`,
          classId,
          className,
          sectionIds: group,
          sectionLabel: group.map(sectionNameById).join(', '),
          subjects: [subject],
          subjectLabel: subject.name,
          warnings,
          // Subjects with no matching formats produce no payload (skipped).
          payload:
            configDetail.length === 0
              ? null
              : buildPayload(
                  examId,
                  classId,
                  group,
                  subject,
                  marks,
                  configDetail
                ),
        });
      }
    }
  }

  return units;
}

/** Save units that will actually be sent (subjects with ≥1 matching format). */
export function saveableUnits(units: SaveUnit[]): SaveUnit[] {
  return units.filter((u) => u.payload !== null);
}

/** Quick counts for the sticky footer / summary chips. */
export function selectionSummary(state: ConfigState) {
  const classes = state.selectedClassIds.length;
  let sections = 0;
  let subjects = 0;
  for (const classId of state.selectedClassIds) {
    sections += (state.sectionsByClass[classId] ?? []).length;
    subjects += (state.subjectsByClass[classId] ?? []).length;
  }
  return { classes, sections, subjects };
}
