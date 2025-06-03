import { EndpointDetails } from '../types';

export const CREATE_INSTITUTE_COURSE = `CREATE_INSTITUTE_COURSE`;
export const UPDATE_INSTITUTE_COURSE = `UPDATE_INSTITUTE_COURSE`;
export const GET_INSTITUTE_COURSE_LIST = `GET_INSTITUTE_COURSE_LIST`;
export const GET_INSTITUTE_COURSE_LIST_BY_FILTER = `GET_INSTITUTE_COURSE_LIST_BY_FILTER`;
export const GET_INSTITUTE_COURSE_LIST_BY_LEARNER_ID =
  'GET_INSTITUTE_COURSE_LIST_BY_LEARNER_ID';
export const GET_PAYMENT_HISTORY_BY_LEARNER_ID =
  'GET_PAYMENT_HISTORY_BY_LEARNER_ID';
export const GET_INSTITUTE_COURSE_BY_ID = `GET_INSTITUTE_COURSE_BY_ID`;
export const GET_INSTITUTE_COURSE_CONTENT_STRUCTURE = `GET_INSTITUTE_COURSE_CONTENT_STRUCTURE`;
export const CREATE_INSTITUTE_COURSE_MODULE = `CREATE_INSTITUTE_COURSE_MODULE`;
export const GET_INSTITUTE_COURSE_MODULE_LIST = `GET_INSTITUTE_COURSE_MODULE_LIST`;
export const UPDATE_INSTITUTE_COURSE_MODULE = `UPDATE_INSTITUTE_COURSE_MODULE`;
export const GET_INSTITUTE_COURSE_MODULE_BY_ID = `GET_INSTITUTE_COURSE_MODULE_BY_ID`;
export const DELETE_INSTITUTE_COURSE_MODULE_BY_ID = `DELETE_INSTITUTE_COURSE_MODULE_BY_ID`;
export const CREATE_INSTITUTE_COURSE_CHAPTER = `CREATE_INSTITUTE_COURSE_CHAPTER`;
export const GET_INSTITUTE_COURSE_CHAPTER_LIST = `GET_INSTITUTE_COURSE_CHAPTER_LIST`;
export const GET_INSTITUTE_COURSE_CHAPTER_BY_ID = `GET_INSTITUTE_COURSE_CHAPTER_BY_ID`;
export const UPDATE_INSTITUTE_COURSE_CHAPTER = `UPDATE_INSTITUTE_COURSE_CHAPTER`;
export const CREATE_INSTITUTE_COURSE_CHAPTER_ITEM = `CREATE_INSTITUTE_COURSE_CHAPTER_ITEM`;
export const GET_INSTITUTE_COURSE_CHAPTER_ITEM_LIST = `GET_INSTITUTE_COURSE_CHAPTER_ITEM_LIST`;
export const GET_INSTITUTE_COURSE_CHAPTER_ITEM_BY_ID = `GET_INSTITUTE_COURSE_CHAPTER_ITEM_BY_ID`;
export const UPDATE_INSTITUTE_COURSE_CHAPTER_ITEM = `UPDATE_INSTITUTE_COURSE_CHAPTER_ITEM`;
export const GET_INSTITUTE_COURSE_FAQ = `GET_INSTITUTE_COURSE_FAQ`;
export const CREATE_INSTITUTE_COURSE_FAQ = `CREATE_INSTITUTE_COURSE_FAQ`;
export const UPDATE_INSTITUTE_COURSE_FAQ = `UPDATE_INSTITUTE_COURSE_FAQ`;
export const DELETE_INSTITUTE_COURSE_FAQ = `DELETE_INSTITUTE_COURSE_FAQ`;
export default <EndpointDetails>{
  [CREATE_INSTITUTE_COURSE]: {
    requestType: `POST`,
    endpoint: `/api/institute/course`,
  },
  [UPDATE_INSTITUTE_COURSE]: {
    requestType: `PUT`,
    endpoint: `/api/institute/course/[courseId]`,
  },
  [GET_INSTITUTE_COURSE_LIST]: {
    requestType: `GET`,
    endpoint: `/api/institute/course`,
  },
  [GET_INSTITUTE_COURSE_LIST_BY_FILTER]: {
    requestType: `PUT`,
    endpoint: `/api/institute/course`,
  },
  [GET_INSTITUTE_COURSE_LIST_BY_LEARNER_ID]: {
    requestType: `GET`,
    endpoint: `/api/institute/learner/courses`,
  },
  [GET_PAYMENT_HISTORY_BY_LEARNER_ID]: {
    requestType: `GET`,
    endpoint: `/api/institute/learner/payments`,
  },
  [GET_INSTITUTE_COURSE_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/institute/course/[courseId]`,
  },
  [GET_INSTITUTE_COURSE_CONTENT_STRUCTURE]: {
    requestType: `PUT`,
    endpoint: `/api/institute/course/[courseId]/content-structure`,
  },
  [GET_INSTITUTE_COURSE_FAQ]: {
    requestType: `GET`,
    endpoint: `/api/institute/course/[courseId]/faq`,
  },
  [CREATE_INSTITUTE_COURSE_FAQ]: {
    requestType: `POST`,
    endpoint: `/api/institute/course/[courseId]/faq`,
  },
  [UPDATE_INSTITUTE_COURSE_FAQ]: {
    requestType: `PUT`,
    endpoint: `/api/institute/course/[courseId]/faq/[faqId]`,
  },
  [DELETE_INSTITUTE_COURSE_FAQ]: {
    requestType: `DELETE`,
    endpoint: `/api/institute/course/[courseId]/faq/[faqId]`,
  },
  [CREATE_INSTITUTE_COURSE_MODULE]: {
    requestType: `POST`,
    endpoint: `/api/institute/course/[courseId]/module`,
  },
  [GET_INSTITUTE_COURSE_MODULE_LIST]: {
    requestType: `GET`,
    endpoint: `/api/institute/course/[courseId]/module`,
  },
  [UPDATE_INSTITUTE_COURSE_MODULE]: {
    requestType: `PUT`,
    endpoint: `/api/institute/course/[courseId]/module/[moduleId]`,
  },
  [GET_INSTITUTE_COURSE_MODULE_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/institute/course/[courseId]/module/[moduleId]`,
  },
  [DELETE_INSTITUTE_COURSE_MODULE_BY_ID]: {
    requestType: `DELETE`,
    endpoint: `/api/institute/course/[courseId]/module/[moduleId]`,
  },
  [CREATE_INSTITUTE_COURSE_CHAPTER]: {
    requestType: `POST`,
    endpoint: `/api/institute/course/[courseId]/module/[moduleId]/chapter`,
  },
  [GET_INSTITUTE_COURSE_CHAPTER_LIST]: {
    requestType: `GET`,
    endpoint: `/api/institute/course/[courseId]/module/[moduleId]/chapter`,
  },
  [GET_INSTITUTE_COURSE_CHAPTER_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/institute/course/[courseId]/module/[moduleId]/chapter/[chapterId]`,
  },
  [UPDATE_INSTITUTE_COURSE_CHAPTER]: {
    requestType: `PUT`,
    endpoint: `/api/institute/course/[courseId]/module/moduleId/chapter/[chapterId]`,
  },
  [CREATE_INSTITUTE_COURSE_CHAPTER_ITEM]: {
    requestType: `POST`,
    endpoint: `/api/institute/course/[courseId]/module/[moduleId]/chapter/[chapterId]/chapter-item`,
  },
  [GET_INSTITUTE_COURSE_CHAPTER_ITEM_LIST]: {
    requestType: `GET`,
    endpoint: `/api/institute/course/[courseId]/module/[moduleId]/chapter/[chapterId]/chapter-item`,
  },
  [GET_INSTITUTE_COURSE_CHAPTER_ITEM_BY_ID]: {
    requestType: `GET`,
    endpoint: `/api/institute/course/[courseId]/module/[moduleId]/chapter/[chapterId]/chapter-item/[itemId]`,
  },
  [UPDATE_INSTITUTE_COURSE_CHAPTER_ITEM]: {
    requestType: `PUT`,
    endpoint: `/api/institute/course/[courseId]/module/[moduleId]/chapter/[chapterId]/chapter-item/[itemId]`,
  },
};
