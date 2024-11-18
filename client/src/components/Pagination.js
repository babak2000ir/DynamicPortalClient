import React from 'react';

const Pagination = ({ useListPageStore }) => {
    const { paging, pageIndex, setPageIndex } = useListPageStore();

    return (
        <div className="pagination w3-bar w3-border w3-round mt-7">
            {paging.pageCount > 1 &&
                <>
                    <PaginationButton paginationAction={() => setPageIndex(1)} disabled={pageIndex === 1}>&laquo;</PaginationButton>
                    <PaginationButton paginationAction={() => setPageIndex(pageIndex - 1 || 1)} disabled={pageIndex === 1}>&lsaquo;</PaginationButton>
                </>
            }
            {paging.pageCount <= 10 &&
                [...Array(paging.pageCount).keys()].map((n, i) =>
                    <PaginationButton key={n} paginationAction={() => setPageIndex(n + 1)} disabled={n + 1 === pageIndex}>{n + 1}</PaginationButton>
                )
            }
            {paging.pageCount > 10 &&
                <>
                    {pageIndex > 2 &&
                        <PaginationButton disabled>...</PaginationButton>
                    }
                    {pageIndex - 1 !== 0 &&
                        <PaginationButton paginationAction={() => setPageIndex(pageIndex - 1)} >{pageIndex - 1}</PaginationButton>
                    }
                    <PaginationButton>{pageIndex}</PaginationButton>
                    {pageIndex + 1 <= paging.pageCount &&
                        <PaginationButton paginationAction={() => setPageIndex(pageIndex + 1)}>{pageIndex + 1}</PaginationButton>
                    }
                    {pageIndex < paging.pageCount - 1 &&
                        <PaginationButton disabled>...</PaginationButton>
                    }
                </>
            }
            {paging.pageCount > 1 &&
                <>
                    <PaginationButton paginationAction={() => setPageIndex(pageIndex + 1 > paging.pageCount ? pageIndex : pageIndex + 1)} disabled={pageIndex === paging.pageCount}>&rsaquo;</PaginationButton>
                    <PaginationButton paginationAction={() => setPageIndex(paging.pageCount)} disabled={pageIndex === paging.pageCount}>&raquo;</PaginationButton>
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