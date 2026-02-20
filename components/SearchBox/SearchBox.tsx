import css from './SearchBox.module.css'

interface SearchBoxProps {
    onSearch: (newSearchQuery: string) => void;
    text: string
}

export default function SearchBox({ onSearch, text }: SearchBoxProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(e.target.value);
    }

    return (
        <input
            className={css.input}
            type="text"
            placeholder="Search notes"
            defaultValue={text}
            onChange={handleChange}
        />
    )
}