import css from "./NoteForm.module.css";
import { Formik, type FormikHelpers, Field, ErrorMessage, Form } from "formik";
import { createNote } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateNoteInForm } from "@/types/note";
import * as Yup from "yup";

interface NoteFormProps {
    onClose: () => void;
}

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

const tags = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

const noteFormSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, "Minimum 3 letters")
        .max(50, 'Maximum 50 letters')
        .required("Title is required"),
    content: Yup.string().max(500, "500 letters is maximum"),
    tag: Yup.string()
        .oneOf(tags)
        .required('Tag is required')
});

export default function NoteForm({ onClose }: NoteFormProps) {
    const queryClient = useQueryClient();

    const { mutate: createMutate } = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });
    const handleSubmit = (
        values: CreateNoteInForm,
        actions: FormikHelpers<NoteFormValues>,
    ) => {
        createMutate(values, {
            onSuccess: () => {
                actions.resetForm();
                onClose();
            },
        });
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={noteFormSchema}
        >
            <Form className={css.form}>
                <div className={css.formGroup}>
                    <label htmlFor="title">Title</label>
                    <Field id="title" type="text" name="title" className={css.input} />
                    <ErrorMessage component="span" name="title" className={css.error} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="content">Content</label>
                    <Field
                        as="textarea"
                        id="content"
                        name="content"
                        rows={8}
                        className={css.textarea}
                    />
                    <ErrorMessage component="span" name="content" className={css.error} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="tag">Tag</label>
                    <Field as="select" id="tag" name="tag" className={css.select}>
                        <option value="Todo">Todo</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Shopping">Shopping</option>
                    </Field>
                    <ErrorMessage component="span" name="tag" className={css.error} />
                </div>

                <div className={css.actions}>
                    <button type="button" className={css.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className={css.submitButton} disabled={false}>
                        Create note
                    </button>
                </div>
            </Form>
        </Formik>
    );
}