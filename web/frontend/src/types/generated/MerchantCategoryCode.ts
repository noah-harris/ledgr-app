export interface MerchantCategoryCode {
  Mcc: string;
  idBudgetCategory: string | null;
  RangeStart: string;
  RangeEnd: string;
  RangeDescription: string | null;
  IsReserved: boolean;
  IsoDescription: string | null;
  UsdaDescription: string | null;
  StripeDescription: string | null;
  StripeCode: string | null;
  VisaDescription: string | null;
  VisaReqClearingName: string | null;
  AlipayDescription: string | null;
  MastercardDescription: string | null;
  MastercardAbbrAirlineName: string | null;
  AmexDescription: string | null;
}
