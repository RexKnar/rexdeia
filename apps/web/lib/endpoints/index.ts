import ExamAnalyticsEndpoints from './examAnalyticsEndpoints';
import InstitutionCourseEndpoints from './institute/courseEndpoints';
import LearnerEndpoints from './institute/learnerEndpoints';
import SubjectEndpoints from './subjectEndpoints';
import { EndpointDetails } from './types';

export const ADD_ENQUIRY = `ADD_ENQUIRY`;
export const REGISTER_USER = `REGISTER_USER`;
export const ADD_ADMISSION = `ADD_ADMISSION`;
export const UPDATE_BRANCH = `UPDATE_BRANCH`;
export const LIST_ENQUIRY = `LIST_ENQUIRY`;
export const ADD_DEPARTMENT = `ADD_DEPARTMENT`;
export const ADD_REGULATION = `ADD_REGULATION`;
export const DELETE_REGULATION = `DELETE_REGULATION`;
export const ADD_COURSE = `ADD_COURSE`;
export const DELETE_COURSE = `DELETE_COURSE`;
export const UPDATE_DEPARTMENT = `UPDATE_DEPARTMENT`;
export const DELETE_DEPARTMENT = `DELETE_DEPARTMENT`;
export const ONBOARD_ACCOUNT = `ONBOARD_ACCOUNT`;
export const UPDATE_ORGANIZATION = `UPDATE_ORGANIZATION`;
export const FETCH_ORGANIZATION_BY_ID = `FETCH_ORGANIZATION_BY_ID`;
export const ADD_PAYMENT = `ADD_PAYMENT`;
export const ADD_STUDENT = `ADD_STUDENT`;
export const GET_USER_DETAILS = `GET_USER_DETAILS`;
export const UPDATE_USER_DETAILS = `UPDATE_USER_DETAILS`;
export const UPDATE_USER_PASSWORD = `UPDATE_USER_PASSWORD`;
export const GET_ADMISSIONS_LIST = `GET_ADMISSIONS_LIST`;
export const GET_ADMISSIONS_FORM_SHARE_DETAILS = `GET_ADMISSIONS_FORM_SHARE_DETAILS`;
export const CREATE_SHARE_FOR_FORM = `CREATE_SHARE_FOR_FORM`;
export const UPDATE_SHARE_FOR_FORM = `UPDATE_SHARE_FOR_FORM`;
export const GET_STUDENTS_LIST = `GET_STUDENTS_LIST`;
export const GET_STUDENT_SEARCH_LIST = `GET_STUDENT_SEARCH_LIST`;
export const ADD_CLASS = `ADD_CLASS`;
export const ADD_MEDIUM = `ADD_MEDIUM`;
export const GET_CLASS_LIST = `GET_CLASS_LIST`;
export const GET_CLASS_BY_ID = `GET_CLASS_BY_ID`;
export const UPDATE_CLASS_BY_ID = `UPDATE_CLASS_BY_ID`;
export const GET_REGULATION_LIST = `GET_REGULATION_LIST`;
export const GET_REGULATION_BY_ID = `GET_REGULATION_BY_ID`;
export const GET_MEDIUM_BY_ID = `GET_MEDIUM_BY_ID`;
export const GET_ASSESSMENT_FORMAT_BY_ID = `GET_ASSESSMENT_FORMAT_BY_ID`;
export const UPDATE_REGULATION_BY_ID = `UPDATE_REGULATION_BY_ID`;
export const UPDATE_MEDIUM_BY_ID = `UPDATE_MEDIUM_BY_ID`;
export const GET_GROUP_LIST = `GET_GROUP_LIST`;
export const GET_GROUPS_BY_CLASS_ID = `GET_GROUPS_BY_CLASS_ID`;
export const GET_MEDIUM_LIST = `GET_MEDIUM_LIST`;
export const GET_BATCHES_LIST = `GET_BATCHES_LIST`;
export const CREATE_BATCH = `CREATE_BATCH`;
export const GET_BATCH_BY_ID = `GET_BATCH_BY_ID`;
export const GET_GROUP_BY_ID = `GET_GROUP_BY_ID`;
export const UPDATE_BATCH_BY_ID = `UPDATE_BATCH_BY_ID`;
export const DELETE_BATCH_BY_ID = `DELETE_BATCH_BY_ID`;
export const UPDATE_GROUP_BY_ID = `UPDATE_GROUP_BY_ID`;
export const GET_SUBJECT_LIST = `GET_SUBJECT_LIST`;
export const ADD_SUBJECT = `ADD_SUBJECT`;
export const ADD_GROUP = `ADD_GROUP`;
export const ADD_SECTION = `ADD_SECTION`;
export const GET_SECTION_BY_ID = `GET_SECTION_BY_ID`;

export const DELETE_SUBJECT_BY_ID = `DELETE_SUBJECT_BY_ID`;
export const UPDATE_SUBJECT_BY_ID = `UPDATE_SUBJECT_BY_ID`;
export const GET_SUBJECT_BY_ID = `GET_SUBJECT_BY_ID`;
export const GET_ASSESSMENT_FORMAT_LIST = `GET_ASSESSMENT_FORMAT_LIST`;
export const ADD_ASSESSMENT_FORMAT = 'ADD_ASSESSMENT_FORMAT';
export const ADD_SUBJECT_TYPE = 'ADD_SUBJECT_TYPE';
export const UPDATE_ASSESSMENT_FORMAT_BY_ID = `UPDATE_ASSESSMENT_FORMAT_BY_ID`;
export const UPDATE_SUBJECT_TYPE_BY_ID = `UPDATE_SUBJECT_TYPE_BY_ID`;
export const GET_SUBJECT_TYPE_BY_ID = `GET_SUBJECT_TYPE_BY_ID`;
export const GET_SUBJECT_TYPE_LIST = `GET_SUBJECT_TYPE_LIST`;
export const UPDATE_SECTION_BY_ID = `UPDATE_SECTION_BY_ID`;
export const DELETE_GROUP_BY_ID = `DELETE_GROUP_BY_ID`;
export const DELETE_MEDIUM_BY_ID = `DELETE_MEDIUM_BY_ID`;
export const DELETE_ASSESSMENT_FORMAT_BY_ID = `DELETE_ASSESSMENT_FORMAT_BY_ID`;
export const DELETE_SUBJECT_TYPE_BY_ID = `DELETE_SUBJECT_TYPE_BY_ID`;
export const GET_SUBJECT_LIST_BY_SECTION_ID = `GET_SUBJECT_LIST_BY_SECTION_ID`;
export const DELETE_STUDENT_BY_ID = `DELETE_STUDENT_BY_ID`;
export const ADD_GRADE = `ADD_GRADE`;
export const GET_GRADE_LIST = `GET_GRADE_LIST`;
export const GET_GRADE_BY_ID = `GET_GRADE_BY_ID`;
export const UPDATE_GRADE_BY_ID = `UPDATE_GRADE_BY_ID`;
export const ADD_SCALE_TO_GRADE = `ADD_SCALE_TO_GRADE`;
export const DELETE_GRADE_SCALE_BY_ID = `DELETE_GRADE_SCALE_BY_ID`;
export const ADD_STAFF = `ADD_STAFF`;
export const GET_STAFF_LIST = `GET_STAFF_LIST`;
export const GET_STAFF_BY_ID = `GET_STAFF_BY_ID`;
export const GET_SUBJECT_LIST_BY_CLASS_ID = `GET_SUBJECT_LIST_BY_CLASS_ID`;
export const GET_ALL_SECTIONS_BY_CLASS_ID = `GET_ALL_SECTIONS_BY_CLASS_ID`;
export const GET_STATE_BY_COUNTRY_CODE = `GET_STATE_BY_COUNTRY_CODE`;
export const GET_COUNTRY_LIST = `GET_COUNTRY_LIST`;
export const GET_BLOOD_GROUP_LIST = `GET_BLOOD_GROUP_LIST`;
export const GET_CITY_BY_STATE_CODE = `GET_CITY_BY_STATE_CODE`;
export const GET_STAFF_LIST_BY_SECTION_ID = `GET_STAFF_LIST_BY_SECTION_ID`;
export const GET_STUDENT_LIST_BY_SECTION_ID = `GET_STUDENT_LIST_BY_SECTION_ID`;
export const GET_STAFF_LIST_BY_CLASS_ID = `GET_STAFF_LIST_BY_CLASS_ID`;
export const GET_STUDENT_LIST_BY_CLASS_ID = `GET_STUDENT_LIST_BY_CLASS_ID`;
export const GET_STUDENT_HISTORY_LIST_BY_ID = `GET_STUDENT_HISTORY_LIST_BY_ID`;
export const ASSIGN_STAFF_BY_CLASS_ID = `ASSIGN_STAFF_BY_CLASS_ID`;
export const ADD_SUBJECT_BY_CLASS_ID = `ADD_SUBJECT_BY_CLASS_ID`;
export const ADD_ASSESSMENT_FORMAT_WITH_PARENT_ID = `ADD_ASSESSMENT_FORMAT_WITH_PARENT_ID`;
export const ASSIGN_STUDENT_BY_CLASS_ID = `ASSIGN_STUDENT_BY_CLASS_ID`;
export const REASSIGN_STUDENT = `REASSIGN_STUDENT`;
export const GET_SUBJECT_LIST_BY_FILTER = `GET_SUBJECT_LIST_BY_FILTER`;
export const GET_SUBJECTS_BY_SECTION_IDS = `GET_SUBJECTS_BY_SECTION_IDS`;
export const GET_TERM_LIST = `GET_TERM_LIST`;
export const GET_ASSESSMENT_FORMAT_BY_SUBJECT_ID = `GET_ASSESSMENT_FORMAT_BY_SUBJECT_ID`;
export const GET_SECTION_BY_CLASS_GROUP = `GET_SECTION_BY_CLASS_GROUP`;
export const ADD_EXAM_CONFIGURATION_BY_EXAM_ID = `ADD_EXAM_CONFIGURATION_BY_EXAM_ID`;
export const GET_EXAM_LIST = `GET_EXAM_LIST`;
export const ADD_EXAM = `ADD_EXAM`;
export const UPDATE_EXAM = `UPDATE_EXAM`;
export const GET_EXAM_BY_CLASS_SECTION = `GET_EXAM_BY_CLASS_SECTION`;
export const GET_EXAM_BY_SECTION_ID = `GET_EXAM_BY_SECTION_ID`; //new
export const GET_SUBJECTS_WITH_FORMATS_BY_EXAM = `GET_SUBJECTS_WITH_FORMATS_BY_EXAM`;
export const GET_MARK_ENTRY_FORM_STRUCTURE = `GET_MARK_ENTRY_FORM_STRUCTURE`;
export const GET_MARK_WITH_MARK_ENTRY_CONFIGS = `GET_MARK_WITH_MARK_ENTRY_CONFIGS`;
export const ADD_MARK_ENTRY = `ADD_MARK_ENTRY`;
export const GET_STAFFS_BY_SECTION = `GET_STAFFS_BY_SECTION`;
export const GET_MARKS_WITH_FORMAT_BY_EXAM = `GET_MARKS_WITH_FORMAT_BY_EXAM`;
export const ADD_TERM = 'ADD_TERM';
export const GET_SUBJECT_MASTER_LIST = `GET_SUBJECT_MASTER_LIST`;
export const ADD_SUBJECT_MASTER = `ADD_SUBJECT_MASTER`;
export const GET_SUBJECT_MASTER_BY_ID = `GET_SUBJECT_MASTER_BY_ID`;
export const UPDATE_SUBJECT_MASTER_BY_ID = `UPDATE_SUBJECT_MASTER_BY_ID`;
export const DELETE_SUBJECT_MASTER_BY_ID = `DELETE_SUBJECT_MASTER_BY_ID`;
export const ADD_EXAM_TYPE = `ADD_EXAM_TYPE`;
export const GET_STUDENT_LIST_BY_FILTER_WITH_PAGINATION = `GET_STUDENT_LIST_BY_FILTER_WITH_PAGINATION`;
export const GET_TERM_BY_ID = `GET_TERM_BY_ID`;
export const GET_EXAM_TYPE_LIST = `GET_EXAM_TYPE_LIST`;
export const GET_EXAM_TYPE_BY_ID = `GET_EXAM_TYPE_BY_ID`;
export const UPDATE_EXAM_TYPE_BY_ID = `UPDATE_EXAM_TYPE_BY_ID`;
export const DELETE_EXAM_TYPE_BY_ID = `DELETE_EXAM_TYPE_BY_ID`;
export const DELETE_EXAM_CONFIG_BY_ID = `DELETE_EXAM_CONFIG_BY_ID`;
export const GET_EXAM_CONFIG_BY_ID = `GET_EXAM_CONFIG_BY_ID`;
export const EDIT_EXAM_CONFIG_BY_ID = `EDIT_EXAM_CONFIG_BY_ID`;
export const GET_STUDENT_BY_ID = `GET_STUDENT_BY_ID`;
export const UPDATE_STUDENT_BY_ID = `UPDATE_STUDENT_BY_ID`;
export const UPDATE_TERM_BY_ID = `UPDATE_TERM_BY_ID`;
export const DELETE_TERM_BY_ID = `DELETE_TERM_BY_ID`;
export const GET_STUDENTS_MARKS_BY_CLASS_ID_AND_EXAM_ID = `GET_STUDENTS_MARKS_BY_CLASS_ID_AND_EXAM_ID`;
export const GET_STAFF_SUBJECT_LIST_BY_CLASS_ID = `GET_STAFF_SUBJECT_LIST_BY_CLASS_ID`;
export const GET_STUDENTS_LIST_FOR_ASSIGN = `GET_STUDENTS_LIST_FOR_ASSIGN`;
export const GET_STUDENT_LIST_FOR_PROMOTE = `GET_STUDENTS_LIST_FOR_PROMOTE`;
export const ASSIGN_STUDENTS_FOR_PROMOTE = `ASSIGN_STUDENTS_FOR_PROMOTE`;
export const GET_EXAM_DETAIL_BY_EXAM_ID = `GET_EXAM_DETAIL_BY_EXAM_ID`;
export const GET_SUBJECT_EXAM_CONFIG_DETAIL = `GET_SUBJECT_EXAM_CONFIG_DETAIL`;
export const EDIT_EXAM_SUBJECT_CONFIG_BY_ID = `EDIT_EXAM_SUBJECT_CONFIG_BY_ID`;
export const GET_EXAM_CONFIG_SUBJECT_DETAIL_BY_SECTION_IDS = `GET_EXAM_CONFIG_SUBJECT_DETAIL_BY_SECTION_IDS`;
export const GET_EXAM_SUBJECT_CONFIG_DETAIL_BY_ID = `GET_EXAM_SUBJECT_CONFIG_DETAIL_BY_ID`;
export const ADD_EXAM_CONFIG = `ADD_EXAM_CONFIG`;
export const GET_EXAM_CONFIG_SUBJECT_DETAIL = `GET_EXAM_CONFIG_SUBJECT_DETAIL`;
export const EXAM_MARK_ENTRY = `EXAM_MARK_ENTRY`;
export const UPDATE_STAFF_BY_ID = `UPDATE_STAFF_BY_ID`;
export const GET_SUBJECT_LIST_BY_STAFF_ID = `GET_SUBJECT_LIST_BY_STAFF_ID`;
export const UNASSIGN_STAFF_SECTION_BY_ID = `UNASSIGN_STAFF_SECTION_BY_ID`;
export const ADD_COMMUNITY = `ADD_COMMUNITY`;
export const ADD_LANGUAGE = `ADD_LANGUAGE`;
export const ADD_STAFF_CATEGORY = `ADD_STAFF_CATEGORY`;
export const ADD_DESIGNATION = `ADD_DESIGNATION`;
export const ADD_NATURE_OF_POSTING = `ADD_NATURE_OF_POSTING`;
export const ADD_EMPLOYMENT_TYPE = `ADD_EMPLOYMENT_TYPE`;
export const GET_COMMUNITY_LIST = `GET_COMMUNITY_LIST`;
export const GET_LANGUAGE_LIST = `GET_LANGUAGE_LIST`;
export const GET_STAFF_CATEGORY_LIST = `GET_STAFF_CATEGORY_LIST`;
export const GET_DESIGNATION_LIST = `GET_DESIGNATION_LIST`;
export const GET_NATURE_OF_POSTING_LIST = `GET_NATURE_OF_POSTING_LIST`;
export const GET_EMPLOYMENT_TYPE_LIST = `GET_EMPLOYMENT_TYPE_LIST`;
export const UPDATE_COMMUNITY_BY_ID = `UPDATE_COMMUNITY_BY_ID`;
export const UPDATE_LANGUAGE_BY_ID = `UPDATE_LANGUAGE_BY_ID`;
export const UPDATE_STAFF_CATEGORY_BY_ID = `UPDATE_STAFF_CATEGORY_BY_ID`;
export const UPDATE_DESIGNATION_BY_ID = `UPDATE_DESIGNATION_BY_ID`;
export const UPDATE_NATURE_OF_POSTING_BY_ID = `UPDATE_NATURE_OF_POSTING_BY_ID`;
export const UPDATE_EMPLOYMENT_TYPE_BY_ID = `UPDATE_EMPLOYMENT_TYPE_BY_ID`;
export const DELETE_COMMUNITY_BY_ID = `DELETE_COMMUNITY_BY_ID`;
export const DELETE_LANGUAGE_BY_ID = `DELETE_LANGUAGE_BY_ID`;
export const DELETE_STAFF_CATEGORY_BY_ID = `DELETE_STAFF_CATEGORY_BY_ID`;
export const DELETE_DESIGNATION_BY_ID = `DELETE_DESIGNATION_BY_ID`;
export const DELETE_NATURE_OF_POSTING_BY_ID = `DELETE_NATURE_OF_POSTING_BY_ID`;
export const DELETE_EMPLOYMENT_TYPE_BY_ID = `DELETE_EMPLOYMENT_TYPE_BY_ID`;
export const GET_SUBJECTS_BY_CLASS_AND_GROUP_ID = `GET_SUBJECTS_BY_CLASS_AND_GROUP_ID`;
export const ADD_CLASSLEVEL = `ADD_CLASSLEVEL`;
export const GET_CLASSLEVELS_LIST = `GET_CLASSLEVELS_LIST`;
export const GET_CLASSLEVEL_BY_ID = `GET_CLASSLEVEL_BY_ID`;
export const GET_CLASSES_BY_CLASSLEVEL_ID = `GET_CLASSES_BY_CLASSLEVEL_ID`;
export const GET_STUDENTS_BY_CLASSLEVEL_ID = `GET_STUDENTS_BY_CLASSLEVEL_ID`;
export const UPDATE_CLASSLEVEL_BY_ID = `UPDATE_CLASSLEVEL_BY_ID`;
export const DELETE_CLASSLEVEL_BY_ID = `DELETE_CLASSLEVEL_BY_ID`;
export const ADD_LEVELCONFIG = `ADD_LEVELCONFIG`;
export const GET_LEVELCONFIG_LIST = `GET_LEVELCONFIG_LIST`;
export const GET_LEVELCONFIG_BY_ID = `GET_LEVELCONFIG_BY_ID`;
export const UPDATE_LEVELCONFIG_BY_ID = `UPDATE_LEVELCONFIG_BY_ID`;
export const DELETE_LEVELCONFIG_BY_ID = `DELETE_LEVELCONFIG_BY_ID`;
export const ADD_DAYS = `ADD_DAYS`;
export const GET_DAYS_LIST = `GET_DAYS_LIST`;
export const GET_DAYS_BY_ID = `GET_DAYS_BY_ID`;
export const UPDATE_DAYS_BY_ID = `UPDATE_DAYS_BY_ID`;
export const DELETE_DAYS_BY_ID = `DELETE_DAYS_BY_ID`;
export const ADD_PERIOD_TYPE = `ADD_PERIOD_TYPE`;
export const GET_PERIOD_TYPES_LIST = `GET_PERIOD_TYPES_LIST`;
export const GET_PERIOD_TYPE_BY_ID = `GET_PERIOD_TYPE_BY_ID`;
export const UPDATE_PERIOD_TYPE_BY_ID = `UPDATE_PERIOD_TYPE_BY_ID`;
export const DELETE_PERIOD_TYPE_BY_ID = `DELETE_PERIOD_TYPE_BY_ID`;
export const ADD_PERIOD_MASTER = `ADD_PERIOD_MASTER`;
export const GET_PERIOD_MASTERS_LIST = `GET_PERIOD_MASTERS_LIST`;
export const GET_PERIOD_MASTER_BY_ID = `GET_PERIOD_MASTER_BY_ID`;
export const UPDATE_PERIOD_MASTER_BY_ID = `UPDATE_PERIOD_MASTER_BY_ID`;
export const DELETE_PERIOD_MASTER_BY_ID = `DELETE_PERIOD_MASTER_BY_ID`;
export const ADD_PERIOD = `ADD_PERIOD`;
export const GET_PERIODS_LIST = `GET_PERIODS_LIST`;
export const GET_PERIOD_BY_ID = `GET_PERIOD_BY_ID`;
export const UPDATE_PERIOD_BY_ID = `UPDATE_PERIOD_BY_ID`;
export const DELETE_PERIOD_BY_ID = `DELETE_PERIOD_BY_ID`;
export const ADD_PERIOD_MODE = `ADD_PERIOD_MODE`;
export const GET_PERIOD_MODE_LIST = `GET_PERIOD_MODE_LIST`;
export const GET_PERIOD_MODE_BY_ID = `GET_PERIOD_MODE_BY_ID`;
export const UPDATE_PERIOD_MODE_BY_ID = `UPDATE_PERIOD_MODE_BY_ID`;
export const DELETE_PERIOD_MODE_BY_ID = `DELETE_PERIOD_MODE_BY_ID`;
export const ARCHIVE_STUDENT_BY_ID = `ARCHIVE_STUDENT_BY_ID`;
export const UPDATE_ROLLNUMBERS = `UPDATE_ROLLNUMBERS`;

export default <EndpointDetails>{
  ...ExamAnalyticsEndpoints,
  ...SubjectEndpoints,
  ...InstitutionCourseEndpoints,
  ...LearnerEndpoints,
  [REGISTER_USER]: {
    requestType: `POST`,
    endpoint: `/api/register`,
  },
  [ADD_ADMISSION]: {
    requestType: `POST`,
    endpoint: `/api/admission`,
  },
  [ADD_ENQUIRY]: {
    requestType: `POST`,
    endpoint: `/api/enquiry`,
  },
  [LIST_ENQUIRY]: {
    requestType: `POST`,
    endpoint: `/api/enquiryList`,
  },
  [ADD_DEPARTMENT]: {
    requestType: `POST`,
    endpoint: `/api/department`,
  },
  [ADD_MEDIUM]: {
    requestType: `POST`,
    endpoint: `/api/medium`,
  },
  [UPDATE_DEPARTMENT]: {
    requestType: `PUT`,
    endpoint: `/api/department`,
  },
  [DELETE_DEPARTMENT]: {
    requestType: `DELETE`,
    endpoint: `/api/department`,
  },
  [ADD_REGULATION]: {
    requestType: `POST`,
    endpoint: `/api/regulation`,
  },
  [ADD_GROUP]: {
    requestType: `POST`,
    endpoint: `/api/group`,
  },
  [DELETE_REGULATION]: {
    requestType: `DELETE`,
    endpoint: `/api/regulation`,
  },
  [ADD_COURSE]: {
    requestType: `POST`,
    endpoint: `/api/course`,
  },
  [DELETE_COURSE]: {
    requestType: `DELETE`,
    endpoint: `/api/course`,
  },
  [ONBOARD_ACCOUNT]: {
    requestType: `POST`,
    endpoint: `/api/onboarding/account`,
  },
  [FETCH_ORGANIZATION_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/organization/[organizationId]`,
  },
  [UPDATE_ORGANIZATION]: {
    requestType: `PUT`,
    endpoint: `/api/organization/[organizationId]`,
  },
  [UPDATE_BRANCH]: {
    requestType: `PUT`,
    endpoint: `/api/branch/[branchId]`,
  },
  [ADD_PAYMENT]: {
    requestType: `POST`,
    endpoint: `/api/payment`,
  },
  [ADD_STUDENT]: {
    requestType: `POST`,
    endpoint: `/api/student`,
  },
  [GET_USER_DETAILS]: {
    requestType: `GET`,
    endpoint: `/api/user`,
  },
  [UPDATE_USER_DETAILS]: {
    requestType: `PUT`,
    endpoint: `/api/user/[userId]`,
  },
  [UPDATE_USER_PASSWORD]: {
    requestType: `PUT`,
    endpoint: `/api/user/password`,
  },
  [GET_ADMISSIONS_LIST]: {
    requestType: `GET`,
    endpoint: `/api/admission`,
  },
  [GET_ADMISSIONS_FORM_SHARE_DETAILS]: {
    requestType: `GET`,
    endpoint: `/api/forms/[formId]/share`,
  },
  [CREATE_SHARE_FOR_FORM]: {
    requestType: `POST`,
    endpoint: `/api/share`,
  },
  [UPDATE_SHARE_FOR_FORM]: {
    requestType: `PUT`,
    endpoint: `/api/share/[shareId]`,
  },
  [GET_STUDENTS_LIST]: {
    requestType: `GET`,
    endpoint: `/api/student`,
  },
  [GET_STUDENT_SEARCH_LIST]: {
    requestType: `GET`,
    endpoint: `/api/student/search`,
  },
  [ADD_CLASS]: {
    requestType: `POST`,
    endpoint: `/api/class`,
  },
  [ADD_GRADE]: {
    requestType: 'POST',
    endpoint: `/api/grade`,
  },
  [GET_GRADE_LIST]: {
    requestType: `GET`,
    endpoint: `/api/grade`,
  },
  [UPDATE_GRADE_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/grade/[id]`,
  },
  [GET_GRADE_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/grade/[id]`,
  },
  [ADD_SCALE_TO_GRADE]: {
    requestType: `POST`,
    endpoint: `/api/grade/scale`,
  },
  [DELETE_GRADE_SCALE_BY_ID]: {
    requestType: `DELETE`,
    endpoint: `/api/grade/scale/[id]`,
  },
  [GET_CLASS_LIST]: {
    requestType: `PUT`,
    endpoint: `/api/class`,
  },
  [GET_CLASS_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/class/[id]`,
  },
  [UPDATE_CLASS_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/class/[id]`,
  },
  [GET_REGULATION_LIST]: {
    requestType: `PUT`,
    endpoint: `/api/regulation`,
  },
  [GET_REGULATION_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/regulation/[id]`,
  },
  [GET_MEDIUM_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/medium/[id]`,
  },
  [GET_GROUP_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/group/[id]`,
  },
  [GET_GROUP_LIST]: {
    requestType: `PUT`,
    endpoint: `/api/group`,
  },
  [GET_GROUPS_BY_CLASS_ID]: {
    requestType: `PUT`,
    endpoint: `/api/class/group`,
  },
  [GET_MEDIUM_LIST]: {
    requestType: `PUT`,
    endpoint: `/api/medium`,
  },
  [UPDATE_REGULATION_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/regulation/[id]`,
  },
  [UPDATE_MEDIUM_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/medium/[id]`,
  },
  [UPDATE_GROUP_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/group/[id]`,
  },
  [GET_ASSESSMENT_FORMAT_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/subject/assessment-format/[id]`,
  },
  [UPDATE_ASSESSMENT_FORMAT_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/subject/assessment-format/[id]`,
  },
  [GET_BATCHES_LIST]: {
    requestType: `PUT`,
    endpoint: `/api/batch`,
  },
  [CREATE_BATCH]: {
    requestType: `POST`,
    endpoint: `/api/batch`,
  },
  [DELETE_BATCH_BY_ID]: {
    requestType: `DELETE`,
    endpoint: `/api/batch/[id]`,
  },
  [GET_BATCH_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/batch/[id]`,
  },
  [UPDATE_BATCH_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/batch/[id]`,
  },
  [ADD_SUBJECT]: {
    requestType: `POST`,
    endpoint: `/api/subject`,
  },
  [GET_SUBJECT_LIST]: {
    requestType: `GET`,
    endpoint: `/api/subject`,
  },
  [GET_SECTION_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/section/[id]`,
  },
  [GET_SECTION_BY_CLASS_GROUP]: {
    requestType: `PUT`,
    endpoint: `/api/section`,
  },
  [ADD_SECTION]: {
    requestType: `POST`,
    endpoint: `/api/section`,
  },
  [DELETE_SUBJECT_BY_ID]: {
    requestType: `DELETE`,
    endpoint: `/api/subject/[id]`,
  },
  [UPDATE_SUBJECT_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/subject/[id]`,
  },
  [GET_SUBJECT_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/subject/[id]`,
  },
  [UPDATE_SECTION_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/section/[id]`,
  },
  [DELETE_GROUP_BY_ID]: {
    requestType: `DELETE`,
    endpoint: `/api/group/[id]`,
  },
  [DELETE_MEDIUM_BY_ID]: {
    requestType: `DELETE`,
    endpoint: `/api/medium/[id]`,
  },
  [DELETE_ASSESSMENT_FORMAT_BY_ID]: {
    requestType: `DELETE`,
    endpoint: `/api/subject/assessment-format/[id]`,
  },
  [DELETE_SUBJECT_TYPE_BY_ID]: {
    requestType: `DELETE`,
    endpoint: `/api/subject/subjectType/[id]`,
  },
  [GET_ASSESSMENT_FORMAT_LIST]: {
    requestType: `PUT`,
    endpoint: `/api/subject/assessment-format`,
  },
  [ADD_ASSESSMENT_FORMAT]: {
    requestType: `POST`,
    endpoint: `/api/subject/assessment-format`,
  },
  [ADD_ASSESSMENT_FORMAT_WITH_PARENT_ID]: {
    requestType: `POST`,
    endpoint: `/api/subject/assessment-format/[id]`,
  },
  [ADD_SUBJECT_TYPE]: {
    requestType: `POST`,
    endpoint: `/api/subject/subjectType`,
  },
  [GET_SUBJECT_TYPE_LIST]: {
    requestType: `PUT`,
    endpoint: `/api/subject/subjectType`,
  },
  [GET_SUBJECT_LIST_BY_SECTION_ID]: {
    requestType: `GET`,
    endpoint: `/api/section/[id]/subjects`,
  },
  [GET_SUBJECTS_BY_SECTION_IDS]: {
    requestType: `PUT`,
    endpoint: `/api/class/[id]/sections/subjects`,
  },
  [DELETE_STUDENT_BY_ID]: {
    requestType: `DELETE`,
    endpoint: `/api/student/[id]`,
  },
  [ADD_STAFF]: {
    requestType: `POST`,
    endpoint: `/api/staff`,
  },
  [GET_STAFF_LIST]: {
    requestType: `GET`,
    endpoint: `/api/staff`,
  },
  [GET_STAFF_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/staff/[id]`,
  },
  [GET_SUBJECT_LIST_BY_CLASS_ID]: {
    requestType: `GET`,
    endpoint: `/api/class/[id]/subjects`,
  },
  [UPDATE_SUBJECT_TYPE_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/subject/subjectType/[id]`,
  },
  [GET_SUBJECT_TYPE_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/subject/subjectType/[id]`,
  },
  [GET_ALL_SECTIONS_BY_CLASS_ID]: {
    requestType: `PUT`,
    endpoint: `/api/class/[id]/sections`,
  },
  [GET_STATE_BY_COUNTRY_CODE]: {
    requestType: `GET`,
    endpoint: `/api/countries/[countryCode]/states`,
  },
  [GET_COUNTRY_LIST]: {
    requestType: `GET`,
    endpoint: `/api/countries`,
  },
  [GET_BLOOD_GROUP_LIST]: {
    requestType: `GET`,
    endpoint: `/api/blood-groups`,
  },
  [GET_CITY_BY_STATE_CODE]: {
    requestType: `GET`,
    endpoint: `/api/countries/[countryCode]/states/[stateCode]/cities`,
  },
  [GET_STAFF_LIST_BY_SECTION_ID]: {
    requestType: `GET`,
    endpoint: `/api/section/[id]/staffs`,
  },
  [GET_STUDENT_LIST_BY_SECTION_ID]: {
    requestType: `GET`,
    endpoint: `/api/section/[id]/students`,
  },
  [GET_STAFF_LIST_BY_CLASS_ID]: {
    requestType: `GET`,
    endpoint: `/api/class/[id]/staffs`,
  },
  [ARCHIVE_STUDENT_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/student/[id]/archive`,
  },
  [GET_STUDENT_LIST_BY_CLASS_ID]: {
    requestType: `GET`,
    endpoint: `/api/class/[id]/students`,
  },
  [GET_STUDENT_HISTORY_LIST_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/student/[id]/history`,
  },
  [ASSIGN_STAFF_BY_CLASS_ID]: {
    requestType: `POST`,
    endpoint: `/api/class/[id]/staffs`,
  },
  [ADD_SUBJECT_BY_CLASS_ID]: {
    requestType: `POST`,
    endpoint: `/api/class/[id]/subjects`,
  },
  [ASSIGN_STUDENT_BY_CLASS_ID]: {
    requestType: `POST`,
    endpoint: `/api/class/[id]/students`,
  },
  [REASSIGN_STUDENT]: {
    requestType: `PUT`,
    endpoint: `/api/class/[id]/students/switch`,
  },
  [GET_STUDENT_LIST_FOR_PROMOTE]: {
    requestType: `PUT`,
    endpoint: `/api/promotion/students`,
  },
  [ASSIGN_STUDENTS_FOR_PROMOTE]: {
    requestType: `POST`,
    endpoint: `/api/promotion/students`,
  },

  [GET_SUBJECT_LIST_BY_FILTER]: {
    requestType: `PUT`,
    endpoint: `/api/exam/subject`,
  },
  [GET_EXAM_TYPE_LIST]: {
    requestType: `PUT`,
    endpoint: `/api/exam/exam-type`,
  },
  [GET_TERM_LIST]: {
    requestType: `PUT`,
    endpoint: `/api/exam/term`,
  },
  [GET_ASSESSMENT_FORMAT_BY_SUBJECT_ID]: {
    requestType: `GET`,
    endpoint: `/api/exam/subject/[id]/assessment-format`,
  },
  [GET_EXAM_DETAIL_BY_EXAM_ID]: {
    requestType: `GET`,
    endpoint: `/api/exam/[id]`,
  },
  [ADD_EXAM_CONFIGURATION_BY_EXAM_ID]: {
    requestType: `POST`,
    endpoint: `/api/exam/[id]/configuration`,
  },
  [GET_EXAM_LIST]: {
    requestType: `GET`,
    endpoint: `/api/exam`,
  },
  [ADD_EXAM]: {
    requestType: `POST`,
    endpoint: `/api/exam`,
  },
  [UPDATE_EXAM]: {
    requestType: `PUT`,
    endpoint: `/api/exam/[id]`,
  },
  [GET_EXAM_BY_CLASS_SECTION]: {
    requestType: `PUT`,
    endpoint: `/api/exam/mark-entry`,
  },
  [GET_EXAM_BY_SECTION_ID]: {
    //new
    requestType: `PUT`,
    endpoint: `/api/exam/list`,
  },
  [GET_SUBJECTS_WITH_FORMATS_BY_EXAM]: {
    requestType: `PUT`,
    endpoint: `/api/mark-entry/subjects`,
  },
  [GET_MARK_ENTRY_FORM_STRUCTURE]: {
    requestType: `PUT`,
    endpoint: `/api/mark-entry/formData`,
  },
  [GET_MARK_WITH_MARK_ENTRY_CONFIGS]: {
    requestType: `PUT`,
    endpoint: `/api/exam/[id]/mark-entry`,
  },
  [ADD_MARK_ENTRY]: {
    requestType: `POST`,
    endpoint: `/api/mark-entry`,
  },
  [GET_STAFFS_BY_SECTION]: {
    requestType: `PUT`,
    endpoint: `/api/staff`,
  },
  [GET_MARKS_WITH_FORMAT_BY_EXAM]: {
    requestType: `PUT`,
    endpoint: `/api/mark-entry`,
  },
  [ADD_TERM]: {
    requestType: 'POST',
    endpoint: '/api/exam/term',
  },
  [GET_SUBJECT_MASTER_LIST]: {
    requestType: `PUT`,
    endpoint: `/api/subject-master`,
  },
  [ADD_SUBJECT_MASTER]: {
    requestType: `POST`,
    endpoint: `/api/subject-master`,
  },
  [GET_SUBJECT_MASTER_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/subject-master/[id]`,
  },
  [UPDATE_SUBJECT_MASTER_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/subject-master/[id]`,
  },
  [DELETE_SUBJECT_MASTER_BY_ID]: {
    requestType: `DELETE`,
    endpoint: `/api/subject-master/[id]`,
  },
  [ADD_EXAM_TYPE]: {
    requestType: `POST`,
    endpoint: `/api/exam/exam-type`,
  },
  [GET_STUDENT_LIST_BY_FILTER_WITH_PAGINATION]: {
    requestType: `PUT`,
    endpoint: `/api/analytics/students`,
  },
  [GET_TERM_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/exam/term/[id]`,
  },
  [GET_EXAM_TYPE_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/exam/exam-type/[id]`,
  },
  [UPDATE_EXAM_TYPE_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/exam/exam-type/[id]`,
  },
  [DELETE_EXAM_TYPE_BY_ID]: {
    requestType: `DELETE`,
    endpoint: `/api/exam/exam-type/[id]`,
  },
  [GET_STUDENT_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/student/[id]`,
  },
  [UPDATE_TERM_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/exam/term/[id]`,
  },
  [DELETE_TERM_BY_ID]: {
    requestType: `DELETE`,
    endpoint: `/api/exam/term/[id]`,
  },
  [GET_STUDENTS_MARKS_BY_CLASS_ID_AND_EXAM_ID]: {
    requestType: `PUT`,
    endpoint: `/api/analytics/marks`,
  },
  [GET_STAFF_SUBJECT_LIST_BY_CLASS_ID]: {
    requestType: `GET`,
    endpoint: `/api/class/[id]/staffs/[staffId]/subjects`,
  },
  [UPDATE_STUDENT_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/student/[id]`,
  },
  [GET_STUDENTS_LIST_FOR_ASSIGN]: {
    requestType: `PUT`,
    endpoint: `/api/class/[id]/students`,
  },

  [GET_EXAM_CONFIG_SUBJECT_DETAIL]: {
    requestType: `GET`,
    endpoint: `/api/exam/[id]/config/subject/[subjectId]`,
  },
  [GET_EXAM_CONFIG_SUBJECT_DETAIL_BY_SECTION_IDS]: {
    requestType: `PUT`,
    endpoint: `/api/exam/[id]/config/subject/[subjectId]`,
  },
  [GET_EXAM_SUBJECT_CONFIG_DETAIL_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/exam/exam-subject/[examSubjectId]`,
  },
  [EDIT_EXAM_SUBJECT_CONFIG_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/exam/exam-subject/[examSubjectId]`,
  },
  [DELETE_EXAM_CONFIG_BY_ID]: {
    requestType: `DELETE`,
    endpoint: `/api/exam/[id]/config/[configId]`,
  },
  [GET_EXAM_CONFIG_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/exam/[id]/config/[configId]`,
  },
  [EDIT_EXAM_CONFIG_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/exam/[id]/config/[configId]`,
  },
  [ADD_EXAM_CONFIG]: {
    requestType: `POST`,
    endpoint: `/api/exam/[id]/config`,
  },
  [EXAM_MARK_ENTRY]: {
    requestType: `POST`,
    endpoint: `/api/exam/mark-entry`,
  },
  [UPDATE_STAFF_BY_ID]: {
    requestType: `PUT`,
    endpoint: `/api/staff/[id]`,
  },
  [GET_SUBJECT_LIST_BY_STAFF_ID]: {
    requestType: `GET`,
    endpoint: `/api/staff/[id]/subjects`,
  },
  [UNASSIGN_STAFF_SECTION_BY_ID]: {
    requestType: `DELETE`,
    endpoint: `/api/class/[id]/staffs/[staffId]/subjects`,
  },
  [ADD_COMMUNITY]: {
    requestType: 'POST',
    endpoint: '/api/community',
  },
  [ADD_LANGUAGE]: {
    requestType: 'POST',
    endpoint: '/api/language',
  },
  [ADD_EMPLOYMENT_TYPE]: {
    requestType: 'POST',
    endpoint: '/api/staff/employment-type',
  },
  [ADD_NATURE_OF_POSTING]: {
    requestType: 'POST',
    endpoint: '/api/staff/nature-of-posting',
  },
  [ADD_DESIGNATION]: {
    requestType: 'POST',
    endpoint: '/api/staff/designation',
  },
  [ADD_STAFF_CATEGORY]: {
    requestType: 'POST',
    endpoint: '/api/staff/staff-category',
  },
  [GET_COMMUNITY_LIST]: {
    requestType: 'GET',
    endpoint: '/api/community',
  },
  [GET_LANGUAGE_LIST]: {
    requestType: 'GET',
    endpoint: '/api/language',
  },
  [GET_EMPLOYMENT_TYPE_LIST]: {
    requestType: 'GET',
    endpoint: '/api/staff/employment-type',
  },
  [GET_NATURE_OF_POSTING_LIST]: {
    requestType: 'GET',
    endpoint: '/api/staff/nature-of-posting',
  },
  [GET_DESIGNATION_LIST]: {
    requestType: 'GET',
    endpoint: '/api/staff/designation',
  },
  [GET_STAFF_CATEGORY_LIST]: {
    requestType: 'GET',
    endpoint: '/api/staff/staff-category',
  },
  [UPDATE_COMMUNITY_BY_ID]: {
    requestType: 'PUT',
    endpoint: '/api/community/[id]',
  },
  [UPDATE_LANGUAGE_BY_ID]: {
    requestType: 'PUT',
    endpoint: '/api/language/[id]',
  },
  [UPDATE_EMPLOYMENT_TYPE_BY_ID]: {
    requestType: 'PUT',
    endpoint: '/api/staff/employment-type/[id]',
  },
  [UPDATE_NATURE_OF_POSTING_BY_ID]: {
    requestType: 'PUT',
    endpoint: '/api/staff/nature-of-posting/[id]',
  },
  [UPDATE_DESIGNATION_BY_ID]: {
    requestType: 'PUT',
    endpoint: '/api/staff/designation/[id]',
  },
  [UPDATE_STAFF_CATEGORY_BY_ID]: {
    requestType: 'PUT',
    endpoint: '/api/staff/staff-category/[id]',
  },
  [DELETE_COMMUNITY_BY_ID]: {
    requestType: 'DELETE',
    endpoint: '/api/community/[id]',
  },
  [DELETE_LANGUAGE_BY_ID]: {
    requestType: 'DELETE',
    endpoint: '/api/language/[id]',
  },
  [DELETE_EMPLOYMENT_TYPE_BY_ID]: {
    requestType: 'DELETE',
    endpoint: '/api/staff/employment-type/[id]',
  },
  [DELETE_NATURE_OF_POSTING_BY_ID]: {
    requestType: 'DELETE',
    endpoint: '/api/staff/nature-of-posting/[id]',
  },
  [DELETE_DESIGNATION_BY_ID]: {
    requestType: 'DELETE',
    endpoint: '/api/staff/designation/[id]',
  },
  [DELETE_STAFF_CATEGORY_BY_ID]: {
    requestType: 'DELETE',
    endpoint: '/api/staff/staff-category/[id]',
  },
  [GET_SUBJECTS_BY_CLASS_AND_GROUP_ID]: {
    requestType: 'GET',
    endpoint: '/api/group/[id]/subjects',
  },
  [ADD_CLASSLEVEL]: {
    requestType: 'POST',
    endpoint: '/api/classLevel',
  },
  [GET_CLASSLEVELS_LIST]: {
    requestType: 'GET',
    endpoint: '/api/classLevel',
  },
  [GET_CLASSLEVEL_BY_ID]: {
    requestType: 'GET',
    endpoint: '/api/classLevel/[id]',
  },
  [GET_CLASSES_BY_CLASSLEVEL_ID]: {
    requestType: 'GET',
    endpoint: '/api/classLevel/[id]/classes',
  },
  [GET_STUDENTS_BY_CLASSLEVEL_ID]: {
    requestType: 'GET',
    endpoint: '/api/classLevel/[id]/students',
  },
  [UPDATE_CLASSLEVEL_BY_ID]: {
    requestType: 'PUT',
    endpoint: '/api/classLevel/[id]',
  },
  [DELETE_CLASSLEVEL_BY_ID]: {
    requestType: 'DELETE',
    endpoint: '/api/classLevel/[id]',
  },
  [ADD_LEVELCONFIG]: {
    requestType: 'POST',
    endpoint: '/api/levelConfig',
  },
  [GET_LEVELCONFIG_LIST]: {
    requestType: 'GET',
    endpoint: '/api/levelConfig',
  },
  [GET_LEVELCONFIG_BY_ID]: {
    requestType: 'GET',
    endpoint: '/api/levelConfig/[id]',
  },
  [UPDATE_LEVELCONFIG_BY_ID]: {
    requestType: 'PUT',
    endpoint: '/api/levelConfig/[id]',
  },
  [DELETE_LEVELCONFIG_BY_ID]: {
    requestType: 'DELETE',
    endpoint: '/api/levelConfig/[id]',
  },
  [ADD_DAYS]: {
    requestType: 'POST',
    endpoint: '/api/days',
  },
  [GET_DAYS_LIST]: {
    requestType: 'GET',
    endpoint: '/api/days',
  },
  [GET_DAYS_BY_ID]: {
    requestType: 'GET',
    endpoint: '/api/days/[id]',
  },
  [UPDATE_DAYS_BY_ID]: {
    requestType: 'PUT',
    endpoint: '/api/days/[id]',
  },
  [DELETE_DAYS_BY_ID]: {
    requestType: 'DELETE',
    endpoint: '/api/days/[id]',
  },
  [ADD_PERIOD_TYPE]: {
    requestType: 'POST',
    endpoint: '/api/periodType',
  },
  [GET_PERIOD_TYPES_LIST]: {
    requestType: 'GET',
    endpoint: '/api/periodType',
  },
  [GET_PERIOD_TYPE_BY_ID]: {
    requestType: 'GET',
    endpoint: '/api/periodType/[id]',
  },
  [UPDATE_PERIOD_TYPE_BY_ID]: {
    requestType: 'PUT',
    endpoint: '/api/periodType/[id]',
  },
  [DELETE_PERIOD_TYPE_BY_ID]: {
    requestType: 'DELETE',
    endpoint: '/api/periodType/[id]',
  },
  [ADD_PERIOD_MASTER]: {
    requestType: 'POST',
    endpoint: '/api/periodMaster',
  },
  [GET_PERIOD_MASTERS_LIST]: {
    requestType: 'GET',
    endpoint: '/api/periodMaster',
  },
  [GET_PERIOD_MASTER_BY_ID]: {
    requestType: 'GET',
    endpoint: '/api/periodMaster/[id]',
  },
  [UPDATE_PERIOD_MASTER_BY_ID]: {
    requestType: 'PUT',
    endpoint: '/api/periodMaster/[id]',
  },
  [DELETE_PERIOD_MASTER_BY_ID]: {
    requestType: 'DELETE',
    endpoint: '/api/periodMaster/[id]',
  },
  [ADD_PERIOD]: {
    requestType: 'POST',
    endpoint: '/api/period',
  },
  [GET_PERIODS_LIST]: {
    requestType: 'GET',
    endpoint: '/api/period',
  },
  [GET_PERIOD_BY_ID]: {
    requestType: 'GET',
    endpoint: '/api/period/[id]',
  },
  [UPDATE_PERIOD_BY_ID]: {
    requestType: 'PUT',
    endpoint: '/api/period/[id]',
  },
  [DELETE_PERIOD_BY_ID]: {
    requestType: 'DELETE',
    endpoint: '/api/period/[id]',
  },
  [ADD_PERIOD_MODE]: {
    requestType: 'POST',
    endpoint: '/api/periodMode',
  },
  [GET_PERIOD_MODE_LIST]: {
    requestType: 'GET',
    endpoint: '/api/periodMode',
  },
  [GET_PERIOD_MODE_BY_ID]: {
    requestType: 'GET',
    endpoint: '/api/periodMode/[id]',
  },
  [UPDATE_PERIOD_MODE_BY_ID]: {
    requestType: 'PUT',
    endpoint: '/api/periodMode/[id]',
  },
  [DELETE_PERIOD_MODE_BY_ID]: {
    requestType: 'DELETE',
    endpoint: '/api/periodMode/[id]',
  },
  [UPDATE_ROLLNUMBERS]: {
    requestType: 'PUT',
    endpoint: '/api/class/[id]/sections/[sectionId]/roll-number',
  },
};
