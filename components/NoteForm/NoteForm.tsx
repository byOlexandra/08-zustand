'use client'

import css from "./NoteForm.module.css";
import { createNote } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateNoteInForm } from "@/types/note";
import * as Yup from "yup";
import { useState } from "react";

const tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

const noteFormSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, "Minimum 3 letters")
        .max(50, "Maximum 50 letters")
        .required("Title is required"),
    content: Yup.string().max(500, "500 letters is maximum"),
    tag: Yup.string().oneOf(tags).required("Tag is required"),
});

export default function NoteForm() {
    const queryClient = useQueryClient();

    const [errors, setErrors] = useState<Record<string, string>>({});

    const { mutate: createMutate, isPending } = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        }
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const values = {
            title: formData.get("title") as string,
            content: formData.get("content") as string,
            tag: formData.get("tag") as string,
        }
        try {
            await noteFormSchema.validate(values, { abortEarly: false });
            setErrors({});

            createMutate(values as CreateNoteInForm);
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const validationErrors: Record<string, string> = {};
                err.inner.forEach((error) => {
                    if (error.path) validationErrors[error.path] = error.message;
                });
                setErrors(validationErrors);
            }
        }
    };

    return (
        <form className={css.form} onSubmit={handleSubmit}>
            <div className={css.formGroup}>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    className={css.input}
                    placeholder="Enter title..."
                />
                {errors.title && <span className={css.error}>{errors.title}</span>}
            </div>

            <div className={css.formGroup}>
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    name="content"
                    rows={8}
                    className={css.textarea}
                    placeholder="Enter content..."
                ></textarea>
                {errors.content && <span className={css.error}>{errors.content}</span>}
            </div>

            <div className={css.formGroup}>
                <label htmlFor="tag">Tag</label>
                <select id="tag" name="tag" className={css.select} defaultValue="Todo">
                    {tags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select>
                {errors.tag && <span className={css.error}>{errors.tag}</span>}
            </div>

            <div className={css.actions}>
                {/* <button type="button" className={css.cancelButton} onClick={onClose}>
                    Cancel
                </button> */}
                <button
                    type="submit"
                    className={css.submitButton}
                    disabled={isPending}
                >
                    {isPending ? "Creating..." : "Create note"}
                </button>
            </div>
        </form>
    );
}
