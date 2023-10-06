import { db } from '../../../lib/db';
import { addPaymentAssociationModel, AddPaymentModel } from './models';

export async function AddPayment(payment: AddPaymentModel) {
  return await db.payment.create({
    data: {
      ...payment,
      transactionId: payment.transactionId,
      receipt: payment.receipt,
      paymentDate: payment.paymentDate,
    },
  });
}

export async function addPaymentAssociation(
  paymentAssociation: addPaymentAssociationModel
) {
  return await db.paymentAssociations.create({
    data: {
      ...paymentAssociation,
      associationType: paymentAssociation.associationType,
      associationEntityId: paymentAssociation.associationEntityId,
      paymentId: paymentAssociation.paymentId,
    },
  });
}
