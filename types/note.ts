export interface Note {
    id: string,
    title: string,
    content: string,
    createdAt: string,
    updatedAt: string,
    tag: string
}

export interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

export type CreateNoteInForm = Omit<Note, "id" | "createdAt" | "updatedAt">;
