export type CreateShare = {
  formId: string;
  isActive: boolean;
  actualAmount: number;
  activeToDate: string;
  activeFromDate: string;
  acceptPayment: boolean;
  discountAmount: number;
};

export type UpdateShare = {
  isActive: boolean;
  activeFromDate: string;
  activeToDate: string;
  acceptPayment: boolean;
  actualAmount: number;
  discountAmount: number;
};
