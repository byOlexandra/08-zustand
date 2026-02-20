import type { Note, FetchNotesResponse, CreateNoteInForm } from "../types/note";
import axios from "axios";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

export async function fetchNotes(
    query: string,
    page: number,
    tag?: string
): Promise<FetchNotesResponse> {
    try {
        const { data } = await axios.get<FetchNotesResponse>("/notes", {
            params: {
                search: query,
                page: page,
                tag: tag === 'all' ? undefined : tag
            },
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
            },
        });
        console.log(data);
        return {
            notes: data.notes || [],
            totalPages: data.totalPages || 1,
        };
    } catch (error) {
        console.error("Error while loading page:", error);
        throw error;
    }
}

export async function fetchNoteById(id: string): Promise<Note> {
    const { data } = await axios.get<Note>(`/notes/${id}`, {
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
        },
    });
    return data;
}

export async function createNote(noteData: CreateNoteInForm): Promise<Note> {
    try {
        const { data } = await axios.post<Note>("/notes", noteData, {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
            },
        });
        return data;
    } catch (error) {
        console.error("Error creating note:", error);
        throw error;
    }
}

export async function deleteNote(id: string): Promise<Note> {
    try {
        const { data } = await axios.delete<Note>(`/notes/${id}`, {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
            },
        });
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

