export interface FileView {
  idUsers: string;
  idFile: string;
  FileName: string;
  FileExtension: string;
  FullFileName: string | null;
  MimeType: string;
  ServerFilePath: string | null;
  ContainerFilePath: string | null;
  DownloadEndpoint: string | null;
  FileSizeBytes: number | null;
  isSupportedImageExtension: boolean | null;
  isJunk: boolean;
  AllowStatementImage: boolean;
  AllowAccountImage: boolean;
  AllowTransactionInvoiceImage: boolean;
  AllowTransactionReceiptImage: boolean;
  AllowDocument: boolean;
  isAllowedAll: boolean | null;
  isAllowedAny: boolean | null;
  Created: string;
  Updated: string;
}
