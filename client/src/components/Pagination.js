import React from 'react';
import { useGlobalStore } from '../stores';

const Pagination = ({ useListPageStore }) => {
    const { records, pageIndex, setPageIndex, loadRecords } = useListPageStore();

    const pageCount = records.pageCount;

    return (
        <div className="pagination w3-bar w3-border w3-round mt-7">
            {pageCount > 1 &&
                <>
                    <PaginationButton paginationAction={() => { setPageIndex(1); loadRecords() }} disabled={pageIndex === 1}>&laquo;</PaginationButton>
                    <PaginationButton paginationAction={() => { setPageIndex(pageIndex - 1 || 1); loadRecords(true) }} disabled={pageIndex === 1}>&lsaquo;</PaginationButton>
                </>
            }
            {pageCount <= 10 &&
                [...Array(pageCount).keys()].map((n, i) =>
                    <PaginationButton key={n} paginationAction={() => { setPageIndex(n + 1); loadRecords(true) }} disabled={n + 1 === pageIndex}>{n + 1}</PaginationButton>
                )
            }
            {pageCount > 10 &&
                <>
                    {pageIndex > 2 &&
                        <PaginationButton disabled>...</PaginationButton>
                    }
                    {pageIndex - 1 !== 0 &&
                        <PaginationButton paginationAction={() => { setPageIndex(pageIndex - 1); loadRecords(true) }} >{pageIndex - 1}</PaginationButton>
                    }
                    <PaginationButton>{pageIndex}</PaginationButton>
                    {pageIndex + 1 <= pageCount &&
                        <PaginationButton paginationAction={() => { setPageIndex(pageIndex + 1); loadRecords(true) }}>{pageIndex + 1}</PaginationButton>
                    }
                    {pageIndex < pageCount - 1 &&
                        <PaginationButton disabled>...</PaginationButton>
                    }
                </>
            }
            {pageCount > 1 &&
                <>
                    <PaginationButton paginationAction={() => { setPageIndex(pageIndex + 1 > pageCount ? pageIndex : pageIndex + 1); loadRecords(true) }} disabled={pageIndex === pageCount}>&rsaquo;</PaginationButton>
                    <PaginationButton paginationAction={() => { setPageIndex(pageCount); loadRecords(true) }} disabled={pageIndex === pageCount}>&raquo;</PaginationButton>
                </>
            }
        </div>
    )
}

const PaginationButton = ({ paginationAction, disabled, children }) => {
    return (
        <button className={`w3-bar-item w3-button ${disabled ? '!bg-teal-800 !text-white' : 'hover:bg-teal-600'}`} onClick={paginationAction} disabled={disabled}>{children}</button>
    );
}

export default Pagination;