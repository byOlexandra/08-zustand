"use client";

import SearchBox from "@/components/SearchBox/SearchBox";
import css from "./Notes.client.module.css";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "@/components/Pagination/Pagination";
import { Toaster } from "react-hot-toast";
import NoteList from "@/components/NoteList/NoteList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import Link from "next/link";

interface NotesClientProps {
    activeTag: string | undefined;
}

export default function NotesClient({ activeTag }: NotesClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const debouncedSetSearchQuery = useDebouncedCallback((value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    }, 300);

    const { data, error, isError } = useQuery({
        queryKey: ["notes", searchQuery, currentPage, activeTag],
        queryFn: () => fetchNotes(searchQuery, currentPage, activeTag),
        refetchOnMount: false,
        placeholderData: keepPreviousData,
        retry: false,
    });

    if (isError) {
        throw error;
    }

    const displayNotes = data?.notes || [];
    const totalPages = data?.totalPages || 0;

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox text={searchQuery} onSearch={debouncedSetSearchQuery} />
                {totalPages > 0 && (
                    <Pagination
                        changePage={setCurrentPage}
                        page={currentPage}
                        totalPg={totalPages}
                    />
                )}

                <Link href="/notes/action/create">
                    <button className={css.button}>Create note +</button>
                </Link>
            </header>
            <Toaster />
            {displayNotes.length > 0 && <NoteList notes={displayNotes} />}
        </div>
    );
}
