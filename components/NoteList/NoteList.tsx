'use client'

import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

interface NoteListProps {
    notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
    const queryClient = useQueryClient();

    const { mutate: deleteMutate } = useMutation({
        mutationFn: deleteNote,
        onSuccess() {
            toast.success('You successfully deleted a note!');
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });

    return (
        <ul className={css.list}>
            {notes && notes.length > 0 && notes.map((note) => (
                <li key={note.id} className={css.listItem}>
                    <h2 className={css.title}>{note.title}</h2>
                    <p className={css.content}>{note.content}</p>
                    <div className={css.footer}>
                        <span className={css.tag}>{note.tag}</span>
                        <Link href={`/notes/${note.id}`}>View details</Link>
                        <button
                            type="button"
                            className={css.button}
                            onClick={() => deleteMutate(note.id)}
                        >
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}