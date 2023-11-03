export type CreateShare = {
  isActive: boolean;
  activeFromDate: string;
  activeToDate: string;
  acceptPayment: boolean;
  actualAmount: number;
  discountAmount: number;
  formId: string;
};

export type UpdateShare = {
  isActive: boolean;
  activeFromDate: string;
  activeToDate: string;
  acceptPayment: boolean;
  actualAmount: number;
  discountAmount: number;
};
