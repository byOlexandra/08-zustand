"use client";

import css from "./NoteForm.module.css";
import { createNote } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useNoteDraftStore } from "@/lib/store/noteStore";
import { CreateNoteInForm } from "@/types/note";

const tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

// const noteFormSchema = Yup.object().shape({
//     title: Yup.string()
//         .min(3, "Minimum 3 letters")
//         .max(50, "Maximum 50 letters")
//         .required("Title is required"),
//     content: Yup.string().max(500, "500 letters is maximum"),
//     tag: Yup.string().oneOf(tags).required("Tag is required"),
// });

export default function NoteForm() {
    const router = useRouter();

    const queryClient = useQueryClient();

    const { draft, setDraft, clearDraft } = useNoteDraftStore();

    const { mutate: createMutate, isPending } = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            clearDraft();
            router.back();
        },
    });

    const handleCancel = () => {
        router.back();
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        setDraft({
            ...draft,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (formData: FormData) => {
        const values = Object.fromEntries(formData) as CreateNoteInForm;
        createMutate(values);
    };

    return (
        <form className={css.form} action={handleSubmit}>
            <div className={css.formGroup}>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    className={css.input}
                    value={draft?.title}
                    onChange={handleChange}
                />
            </div>

            <div className={css.formGroup}>
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    name="content"
                    rows={8}
                    className={css.textarea}
                    value={draft?.content}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className={css.formGroup}>
                <label htmlFor="tag">Tag</label>
                <select
                    id="tag"
                    name="tag"
                    className={css.select}
                    value={draft?.tag}
                    onChange={handleChange}
                >
                    {tags.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
            </div>

            <div className={css.actions}>
                <button
                    type="button"
                    className={css.cancelButton}
                    onClick={handleCancel}
                // suppressHydrationWarning
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className={css.submitButton}
                    disabled={isPending}
                // suppressHydrationWarning
                >
                    {isPending ? "Creating..." : "Create note"}
                </button>
            </div>
        </form>
    );
}
