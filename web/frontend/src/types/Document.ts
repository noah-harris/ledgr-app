import type { DocumentTagLink } from "./DocumentTagLink";

export type Document = {
    id: string;
    idFile: string;
    name: string;
    extension: string;
    size: number;
    download: string;
    isJunk: boolean;
    description: string;
    created: string;
    updated: string;
    tags: DocumentTagLink[];
};
