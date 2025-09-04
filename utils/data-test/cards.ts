import type { PaymentDetailsSplit } from "../../pages/PaymentPage";
import { userData } from "./users";

export const card: PaymentDetailsSplit = {
  nameOnCard: userData.accountInfo.name,
  cardNumber: "45801234",
  cvc: "123",
  expiryMonth: "10",
  expiryYear: "2030",
};