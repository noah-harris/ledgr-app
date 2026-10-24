export interface Transaction {
  idUsers: string;
  idAccount: string;
  idStatement: string;
  idTransaction: string;
  idTransactionGroup: string | null;
  idTransactionParent: string | null;
  idTransactionType: string;
  idPayee: string;
  idImageInvoice: string | null;
  idImageReceipt: string | null;
  TransactionDate: string;
  PostDate: string;
  InvoiceDate: string | null;
  DueDate: string | null;
  StartDate: string | null;
  EndDate: string | null;
  ReferenceNumber: string | null;
  Amount: number;
  StatementText: string | null;
  isValidated: boolean | null;
  isTransactionSplitChild: unknown;
  hasInvoiceImage: unknown;
  hasReceiptImage: unknown;
  Created: string;
  Updated: string;
}
