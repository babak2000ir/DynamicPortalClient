import React from 'react';
import { useGlobalStore, usePageStore } from '../stores';

const Pagination = ({ pageCount, pageIndex, setPageIndex }) => {
    const { showRelatedTable } = usePageStore();
    const { setLoading, quickEdit, quickAdd, setRelatedTableLoading } = useGlobalStore();
    const setLoadingFunction = showRelatedTable ? setRelatedTableLoading : setLoading;

    return (
        <div className="pagination w3-bar w3-border w3-round mt-7">
            {pageCount > 1 &&
                <>
                    <PaginationButton paginationAction={() => { setPageIndex(1); setLoadingFunction(true) }} disabled={pageIndex === 1 || ((quickEdit || quickAdd) && !showRelatedTable)}>&laquo;</PaginationButton>
                    <PaginationButton paginationAction={() => { setPageIndex(pageIndex - 1 || 1); setLoadingFunction(true) }} disabled={pageIndex === 1 || ((quickEdit || quickAdd) && !showRelatedTable)}>&lsaquo;</PaginationButton>
                </>
            }
            {pageCount <= 10 &&
                [...Array(pageCount).keys()].map((n, i) =>
                    <PaginationButton key={n} paginationAction={() => { setPageIndex(n + 1); setLoadingFunction(true) }} disabled={n + 1 === pageIndex || ((quickEdit || quickAdd) && !showRelatedTable)}>{n + 1}</PaginationButton>
                )
            }
            {pageCount > 10 &&
                <>
                    {pageIndex > 2 &&
                        <PaginationButton disabled>...</PaginationButton>
                    }
                    {pageIndex - 1 !== 0 &&
                        <PaginationButton paginationAction={() => { setPageIndex(pageIndex - 1); setLoadingFunction(true) }} disabled={(quickEdit || quickAdd) && !showRelatedTable}>{pageIndex - 1}</PaginationButton>
                    }
                    <PaginationButton disabled={(quickEdit || quickAdd) && !showRelatedTable}>{pageIndex}</PaginationButton>
                    {pageIndex + 1 <= pageCount &&
                        <PaginationButton paginationAction={() => { setPageIndex(pageIndex + 1); setLoadingFunction(true) }} disabled={(quickEdit || quickAdd) && !showRelatedTable}>{pageIndex + 1}</PaginationButton>
                    }
                    {pageIndex < pageCount - 1 &&
                        <PaginationButton disabled>...</PaginationButton>
                    }
                </>
            }
            {pageCount > 1 &&
                <>
                    <PaginationButton paginationAction={() => { setPageIndex(pageIndex + 1 > pageCount ? pageIndex : pageIndex + 1); setLoadingFunction(true) }} disabled={pageIndex === pageCount || ((quickEdit || quickAdd) && !showRelatedTable)}>&rsaquo;</PaginationButton>
                    <PaginationButton paginationAction={() => { setPageIndex(pageCount); setLoadingFunction(true) }} disabled={pageIndex === pageCount || ((quickEdit || quickAdd) && !showRelatedTable)}>&raquo;</PaginationButton>
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