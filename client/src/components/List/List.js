import { useEffect } from 'react';
import { useGlobalStore } from '../../stores';
import CoreList from './CoreList';
import Alert, { useAlert } from '../Alert/Alert';

export const List = () => {
    const { 
        pages, 
        selectedPage, 
        view,
        //Page
        loadRecords,
        paging: { pageIndex },
        records,
        selectedRecord,
        setSelectedRecord
     } = useGlobalStore();

    const pageMetadata = pages.find(page => page.id === selectedPage);

    const alertProps = useAlert();

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
            <CoreList setAlert={alertProps.setAlert} />
        </>
    );
}

export default List;