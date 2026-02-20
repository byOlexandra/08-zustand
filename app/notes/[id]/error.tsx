"use client";

type Props = {
    error: Error;
};

export default function ErrorNote({ error }: Props) {
    return <p>Could not fetch note details. {error.message}</p>;
}
