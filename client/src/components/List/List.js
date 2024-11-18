import { useEffect } from 'react';
import { useGlobalStore } from '../../stores';
import CoreList from './CoreList';
import Alert, { useAlert } from '../Alert/Alert';


export const List = ({ useListPageStore }) => {
    const { pages, selectedPage, view } = useGlobalStore();
    const {
        loadRecords,
        pageIndex,
        records,
        selectedRecord,
        setSelectedRecord
    } = useListPageStore();

    const alertProps = useAlert();

    const pageMetadata = pages.find(page => page.id === selectedPage);

    useEffect(() => {
        loadRecords(pageMetadata.entity, view);
        window.scrollTo(0, 0);

        if (!records.includes(selectedRecord)) {
            setSelectedRecord('');
        }

    }, [pageIndex, pageMetadata, view]);

    return (
        <>
            <Alert {...alertProps} />
            <CoreList useListPageStore={useListPageStore} setAlert={alertProps.setAlert} />
        </>
    );
}

export default List;