import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CreateNoteInForm } from "@/types/note";

const initialDraft: CreateNoteInForm = {
    title: "",
    content: "",
    tag: 'Todo',
};

interface NoteDraftStore {
    draft: CreateNoteInForm;
    setDraft: (note: CreateNoteInForm) => void;
    clearDraft: () => void;
}

export const useNoteDraftStore = create<NoteDraftStore>()(
    persist(
        (set) => ({
            draft: initialDraft,
            setDraft: (note) => set(() => ({ draft: note })),
            clearDraft: () => set(() => ({ draft: initialDraft })),
        }),
        {
            name: "note-draft",
            partialize: (state) => ({ draft: state.draft }),
        },
    ),
);
