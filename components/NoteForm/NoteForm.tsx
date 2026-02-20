"use client";

import css from "./NoteForm.module.css";
import { createNote } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";

const tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

interface NoteFormValues {
    title: string;
    content: string;
    tag: string;
}

const initialValues: NoteFormValues = {
    title: "",
    content: "",
    tag: "Todo",
};

const noteFormSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, "Minimum 3 letters")
        .max(50, "Maximum 50 letters")
        .required("Title is required"),
    content: Yup.string().max(500, "500 letters is maximum"),
    tag: Yup.string().oneOf(tags).required("Tag is required"),
});

export default function NoteForm() {
    const router = useRouter();

    const queryClient = useQueryClient();

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [values, setValues] = useState({
        title: "",
        content: "",
        tag: "Todo",
    });

    const { mutate: createMutate, isPending } = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            setValues(initialValues);
            setErrors({});
        },
    });

    const handleCancel = () => {
        router.push("/notes/filter/all");
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await noteFormSchema.validate(values, { abortEarly: false });

            createMutate(values);
        } catch (err: any) {
            const validationErrors: Record<string, string> = {};
            err.inner.forEach((error: any) => {
                validationErrors[error.path] = error.message;
            });
            setErrors(validationErrors);
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
                    value={values.title}
                    onChange={handleChange}
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
                    value={values.content}
                    onChange={handleChange}
                ></textarea>
                {errors.content && <span className={css.error}>{errors.content}</span>}
            </div>

            <div className={css.formGroup}>
                <label htmlFor="tag">Tag</label>
                <select
                    id="tag"
                    name="tag"
                    className={css.select}
                    defaultValue="Todo"
                    onChange={handleChange}
                    value={values.tag}
                >
                    {tags.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
                {errors.tag && <span className={css.error}>{errors.tag}</span>}
            </div>

            <div className={css.actions}>
                <button
                    type="button"
                    className={css.cancelButton}
                    onClick={handleCancel}
                >
                    Cancel
                </button>
                <button type="submit" className={css.submitButton} disabled={isPending}>
                    {isPending ? "Creating..." : "Create note"}
                </button>
            </div>
        </form>
    );
}
