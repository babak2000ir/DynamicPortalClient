import { useEffect, useState } from 'react';
import { useGlobalStore } from '../../stores';
import CoreList from './CoreList';

export const List = ({ useListPageStore }) => {
    const { pages, selectedPage, view } = useGlobalStore();
    const {
        loadRecords,
        pageIndex
    } = useListPageStore();

    const pageMetadata = pages.find(page => page.id === selectedPage);

    useEffect(() => {
        loadRecords(pageMetadata.entity, view);
        window.scrollTo(0, 0);
    }, [pageIndex, pageMetadata, view]);

    return (
        <CoreList useListPageStore={useListPageStore} />
    );
}

export default List;