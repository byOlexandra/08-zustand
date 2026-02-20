'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import css from './NoteDetails.module.css';

export default function NoteDetailsClient({ id }: { id: string }) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['note', id],
        queryFn: () => fetchNoteById(id),
    });

    if (isLoading) return <p>Loading note...</p>;
    if (isError) return <p>Error loading note data.</p>;
    if (!data) return null;

    return (
        <article className={css.content}>
            <h2 className={css.header}>{data.title}</h2>
            <span className={css.tag}>{data.tag}</span>
            <p className={css.text}>{data.content}</p>
            <p className={css.date}>{data.createdAt}</p>
        </article>
    );
}