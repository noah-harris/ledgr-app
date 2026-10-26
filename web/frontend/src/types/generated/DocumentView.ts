import type { DocumentTagLinkView } from './DocumentTagLinkView';

export interface DocumentView {
  idUsers: string;
  idFile: string;
  idDocument: string;
  FileName: string;
  FileExtension: string;
  FullFileName: string | null;
  ServerFilePath: string | null;
  ContainerFilePath: string | null;
  DownloadEndpoint: string | null;
  FileSizeBytes: number | null;
  isSupportedImageExtension: boolean | null;
  isJunk: boolean;
  Description: string | null;
  Created: string;
  Updated: string;
  Tags: DocumentTagLinkView[];
}
