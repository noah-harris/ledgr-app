import type { DocumentTagLinkView } from './DocumentTagLinkView';

export interface DocumentView {
  idUsers: string;
  idFile: string;
  idDocument: string;
  FileName: string;
  FileExtension: string;
  FullFileName: unknown | null;
  ServerFilePath: unknown | null;
  ContainerFilePath: unknown | null;
  DownloadEndpoint: unknown | null;
  FileSizeBytes: number | null;
  isSupportedImageExtension: unknown | null;
  isJunk: boolean;
  Description: string | null;
  Created: string;
  Updated: string;
  Tags: DocumentTagLinkView[];
}
