import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Page not found - Note Hub",
    description: "Something wrong happened",
    openGraph: {
        title: "Page 404 - Note Hub",
        description: "Something wrong happened",
        url: '/',
        images: [
            {
                url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
                width: 1200,
                height: 630,
                alt: '404 - Note Hub'
            }
        ]
    }
}

export default function NotFound() {
    return (
        <>
            <h1>404 - Page not found</h1>
            <p>
                Sorry, the page you are looking for does not exist.
            </p>
        </>
    );
}
