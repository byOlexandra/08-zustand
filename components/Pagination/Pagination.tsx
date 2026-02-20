import css from './Pagination.module.css'
import ReactPaginate from 'react-paginate'

interface PaginationProps {
    totalPg: number;
    changePage: (page: number) => void;
    page: number;
}

export default function Pagination({ changePage, page, totalPg }: PaginationProps) {
    return (
        <ReactPaginate
            pageCount={totalPg}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => changePage(selected + 1)}
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"

        />
    )
}