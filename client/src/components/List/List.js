import { useEffect, useState } from 'react';
import { useGlobalStore } from '../../stores';
import CoreList from './CoreList';

export const List = ({ useListPageStore, selectedEntityCode }) => {
    const [records, setRecords] = useState([]);
    const { loadEntity, showRelatedTable } = useListPageStore();
    const { setRowIndex, setLoading, setPageIndex, loading, pageIndex, reload } = useGlobalStore();
    const entityData = useListPageStore(state => state.entityCollection[selectedEntityCode]);

    useEffect(() => {
        const load = async () => {
            const res = await loadEntity(selectedEntityCode, pageIndex);
            setLoading(false);
            setRowIndex(0);
            setRecords(res?.records);
        }
        if (selectedEntityCode && selectedEntityCode !== '0' && loading && !showRelatedTable) {
            load();
        }
        window.scrollTo(0, 0);
    }, [pageIndex, selectedEntityCode, records, reload]);

    return (
        <CoreList records={records} setRecords={setRecords} pageCount={entityData?.paging?.pageCount} pageIndex={pageIndex} setPageIndex={setPageIndex} selectedEntityCode={selectedEntityCode} />
    );
}

export default List;