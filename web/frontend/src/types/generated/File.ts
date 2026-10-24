export interface File {
  idUsers: string;
  idFile: string;
  FileName: string;
  FileExtension: string;
  FullFileName: unknown | null;
  ServerFilePath: unknown | null;
  ContainerFilePath: unknown | null;
  DownloadEndpoint: unknown | null;
  FileSizeBytes: number | null;
  isSupportedImageExtension: unknown | null;
  isJunk: boolean;
  AllowStatementImage: boolean;
  AllowAccountImage: boolean;
  AllowTransactionInvoiceImage: boolean;
  AllowTransactionReceiptImage: boolean;
  AllowDocument: boolean;
  isAllowedAll: unknown | null;
  isAllowedAny: unknown | null;
  Created: string;
  Updated: string;
}
