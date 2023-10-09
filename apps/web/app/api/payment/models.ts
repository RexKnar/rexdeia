export type AddPaymentModel = {
  transactionId: string;
  receipt: string;
  amount: string;
  paymentDate: string;
};

export type addPaymentAssociationModel = {
  associationType: string;
  associationEntityId: string;
  paymentId: string;
};
