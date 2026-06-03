import { ConfigAction, ConfigState, SelectedSubject } from './types';

function toggleInArray<T>(arr: T[], value: T, eq: (a: T, b: T) => boolean) {
  return arr.some((x) => eq(x, value))
    ? arr.filter((x) => !eq(x, value))
    : [...arr, value];
}

function omitKey<T>(obj: Record<string, T>, key: string): Record<string, T> {
  const next = { ...obj };
  delete next[key];
  return next;
}

export function configReducer(
  state: ConfigState,
  action: ConfigAction
): ConfigState {
  switch (action.type) {
    case 'TOGGLE_CLASS': {
      const isSelected = state.selectedClassIds.includes(action.classId);
      if (isSelected) {
        // Deselecting a class drops its sections + subjects too.
        return {
          ...state,
          selectedClassIds: state.selectedClassIds.filter(
            (id) => id !== action.classId
          ),
          sectionsByClass: omitKey(state.sectionsByClass, action.classId),
          subjectsByClass: omitKey(state.subjectsByClass, action.classId),
        };
      }
      return {
        ...state,
        selectedClassIds: [...state.selectedClassIds, action.classId],
      };
    }

    case 'SET_CLASS_SECTIONS':
      return {
        ...state,
        sectionsByClass: {
          ...state.sectionsByClass,
          [action.classId]: action.sectionIds,
        },
      };

    case 'TOGGLE_SECTION': {
      const current = state.sectionsByClass[action.classId] ?? [];
      const next = toggleInArray(current, action.sectionId, (a, b) => a === b);
      // Subjects depend on sections; if no sections remain, drop subjects.
      const subjects = next.length
        ? state.subjectsByClass
        : { ...state.subjectsByClass, [action.classId]: [] };
      return {
        ...state,
        sectionsByClass: { ...state.sectionsByClass, [action.classId]: next },
        subjectsByClass: subjects,
      };
    }

    case 'TOGGLE_SUBJECT': {
      const current = state.subjectsByClass[action.classId] ?? [];
      const next = toggleInArray<SelectedSubject>(
        current,
        action.subject,
        (a, b) => a.subjectId === b.subjectId
      );
      return {
        ...state,
        subjectsByClass: { ...state.subjectsByClass, [action.classId]: next },
      };
    }

    case 'SET_CLASS_SUBJECTS':
      return {
        ...state,
        subjectsByClass: {
          ...state.subjectsByClass,
          [action.classId]: action.subjects,
        },
      };

    case 'SET_SUBJECT_MARKS':
      return {
        ...state,
        subjectMarks: { ...state.subjectMarks, ...action.marks },
      };

    case 'ADD_PARTITION':
      if (state.partitions.some((p) => p.key === action.partition.key))
        return state;
      return { ...state, partitions: [...state.partitions, action.partition] };

    case 'REMOVE_PARTITION':
      return {
        ...state,
        partitions: state.partitions.filter((p) => p.key !== action.key),
      };

    case 'UPDATE_PARTITION':
      return {
        ...state,
        partitions: state.partitions.map((p) =>
          p.key === action.key ? { ...p, ...action.patch } : p
        ),
      };

    case 'SET_PARTITIONS':
      return { ...state, partitions: action.partitions };

    case 'APPLY_TEMPLATE':
      return {
        ...state,
        subjectMarks: action.marks,
        partitions: action.partitions,
      };

    case 'SET_OVERRIDE':
      return {
        ...state,
        overrides: { ...state.overrides, [action.key]: action.override },
      };

    case 'CLEAR_OVERRIDE':
      return { ...state, overrides: omitKey(state.overrides, action.key) };

    case 'RESET':
      return {
        selectedClassIds: [],
        sectionsByClass: {},
        subjectsByClass: {},
        subjectMarks: { totalMarks: '', convertTo: '', minMark: '' },
        partitions: [],
        overrides: {},
      };

    default:
      return state;
  }
}
