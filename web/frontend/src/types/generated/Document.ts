import type { DocumentTagLinkView } from './DocumentTagLinkView';

export interface Document {
  idUsers: string;
  idDocument: string;
  idFile: string;
  Description: string | null;
  hasFile: unknown;
  Created: string;
  Updated: string;
  Tags: DocumentTagLinkView[];
}
