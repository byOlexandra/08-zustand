import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const filterTag = slug[0] === 'all' ? "All notes" : slug[0];
    return {
        title: filterTag === "All notes" ? filterTag : `Notes by category: ${filterTag}`,
        description: `Your notes in category : ${filterTag}`
    }
}



export default async function Notes({ params }: Props) {
    const { slug } = await params;
    const tag = slug[0] === 'all' ? undefined : slug[0];
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["notes", '', 1, tag],
        queryFn: () => fetchNotes('', 1, tag),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotesClient activeTag={tag} />
        </HydrationBoundary>
    );
}
