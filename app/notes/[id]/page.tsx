import NotePreview from "@/app/@modal/(.)notes/[id]/NotePreview.client";
import { fetchNoteById } from "@/lib/api";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

interface NoteDetailsProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NoteDetailsProps): Promise<Metadata> {
    const { id } = await params;
    const note = await fetchNoteById(id);
    return {
        title: `${note.title}`,
        description: `${note.content.slice(0, 30)}`,
        openGraph: {
            title: `${note.title}`,
            description: `${note.content.slice(0, 30)}`,
            url: `/notes/${id}`,
            images: [
                {
                    url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
                    width: 1200,
                    height: 630,
                    alt: `Note: ${note.title}`
                }
            ]
        }
    }
}

export default async function NoteDetails({ params }: NoteDetailsProps) {
    const { id } = await params;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNoteById(id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotePreview id={id} />
        </HydrationBoundary>
    );
}
