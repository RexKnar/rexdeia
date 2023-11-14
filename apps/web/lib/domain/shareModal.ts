import { FormModal } from './form';

export type ShareModal = {
  id: string;
  formId: string;
  form: FormModal;
  isActive: boolean;
  acceptPayment: boolean;
  activeToDate?: Date | null;
  actualAmount?: number | null;
  activeFromDate?: Date | null;
  discountAmount?: number | null;
};

export type CreateShareModal = Pick<
  ShareModal,
  | 'formId'
  | 'actualAmount'
  | 'activeToDate'
  | 'acceptPayment'
  | 'activeFromDate'
  | 'discountAmount'
>;

export type UpdateShareModal = Pick<
  ShareModal,
  | 'formId'
  | 'actualAmount'
  | 'activeToDate'
  | 'acceptPayment'
  | 'activeFromDate'
  | 'discountAmount'
>;
