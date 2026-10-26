import type { DocumentTagLinkView } from './DocumentTagLinkView';

export interface Document {
  idUsers: string;
  idDocument: string;
  idFile: string;
  Description: string | null;
  hasFile: boolean | null;
  Created: string;
  Updated: string;
  Tags: DocumentTagLinkView[];
}
