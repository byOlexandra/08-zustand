'use client';

import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css'
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';

interface NotePreviewClientProps {
    id: string
}

export default function NotePreview({ id }: NotePreviewClientProps) {
    const router = useRouter();

    const handleClose = () => router.back();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['note', id],
        queryFn: () => fetchNoteById(id),
        refetchOnMount: false,
    });

    return (
        <Modal onClose={handleClose}>
            <div className={css.container}>
                <button onClick={handleClose} className={css.backBtn}>
                    Close
                </button>

                {isLoading && <p>Loading note...</p>}

                {isError && <p>Error loading note data.</p>}

                {data && (
                    <article className={css.content}>
                        <h2 className={css.header}>{data.title}</h2>
                        <span className={css.tag}>{data.tag}</span>
                        <p className={css.content}>{data.content}</p>
                        <p className={css.date}>{data.createdAt}</p>
                    </article>
                )}
            </div>
        </Modal>
    );
}