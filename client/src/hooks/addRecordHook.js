import { usePageStore, useGlobalStore, selectFields } from "../stores";
import { mapFieldstoRecord } from "../helpers";
import { amendEntity } from "../services/entitySvc";
import { v4 as uuidv4 } from 'uuid';

export const useAddRecord = (selectedEntityCode) => {
    const { record, updateDisabled, setShowCard, setUpdateDisabled, insertFormValid } = usePageStore();
    const { setError, setRowIndex, setLoading, setPageIndex, setAlert, setReload, quickAdd, setQuickAdd } = useGlobalStore();
    const fields = useGlobalStore(selectFields(selectedEntityCode));

    const handleAddRecord = async () => {
        if (updateDisabled === false && insertFormValid) {
            const newRecord = mapFieldstoRecord(fields, record);
            const response = await amendEntity(selectedEntityCode, newRecord, 'Insert');
            if (response) {
                setRowIndex(0);
                setPageIndex(1);
                quickAdd && setQuickAdd(false);
                setReload(true);
                setLoading(true);
                setAlert({ id: uuidv4(), message: response.message, type: 'success' });
            } else {
                throw new Error('Add New Record failed');
            }
            setShowCard(false);
            setUpdateDisabled(true);
        } else {
            setError('Please provide a value for all fields marked required (*) before proceeding');
        }
    }

    return handleAddRecord;
}