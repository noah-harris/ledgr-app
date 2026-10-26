export interface OrganizationView {
  idUsers: string;
  idOrganization: string;
  OrganizationName: string;
  Mcc: string | null;
  RangeStart: string | null;
  RangeEnd: string | null;
  RangeDescription: string | null;
  IsReserved: boolean | null;
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
