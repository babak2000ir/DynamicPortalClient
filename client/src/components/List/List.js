import { useEffect, useState } from 'react';
import { useGlobalStore } from '../../stores';
import CoreList from './CoreList';

export const List = ({ useListPageStore }) => {
    const { pages, selectedPage } = useGlobalStore();
    const {
        records,
        loadRecords,
        rowIndex,
        setRowIndex,
        pageIndex,
        setPageIndex,
        quickEdit,
        setQuickEdit,
        quickAdd,
        setQuickAdd
    } = useListPageStore();
    const [view , setView] = useState('');
    const pageMetadata = pages.find(page => page.id === selectedPage);

    useEffect(() => {
        loadRecords(pageMetadata.entity, view);
        window.scrollTo(0, 0);
    }, [pageIndex, selectedPage, view]);

    return (
        <CoreList useListPageStore={useListPageStore} />
    );
}

export default List;