export interface AccountView {
  idUsers: string;
  idAccount: string;
  idAccountType: string;
  idAccountSubType: string;
  idCurrency: string;
  idImage: string | null;
  AccountName: string;
  StartDate: string;
  EndDate: string;
  LoginPage: string | null;
  OrganizationName: string;
  Mcc: string | null;
  AccountTypeName: string;
  AccountSubTypeName: string;
  Description: string;
  isCredit: boolean;
  isSpendable: boolean;
  Symbol: string;
  CurrencyName: string;
  CurrencyNamePlural: string;
  FullFileName: string | null;
  DownloadEndpoint: string | null;
  FileSizeBytes: number | null;
  Created: string;
  Updated: string;
}
