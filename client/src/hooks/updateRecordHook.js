
import { selectFields, useGlobalStore } from "../stores";
import { getUpdatedRecordAndFields } from "../helpers";
import { amendEntity } from "../services/entitySvc";
import { v4 as uuidv4 } from 'uuid';

export const useUpdateRecord = (selectedEntityCode) => {
    const { setShowCard, record, setUpdateDisabled, cardParams, updateDisabled, setSearchError } = '';
    const { rowIndex, setAlert } = useGlobalStore();
    const fields = useGlobalStore(selectFields(selectedEntityCode));

    const handleUpdateRecord = async () => {
        if (updateDisabled === false) {
            if (rowIndex !== -1) {
                try {
                    const { idFilterString, changedObjects } = getUpdatedRecordAndFields(record, cardParams.initialRecord, fields);
                    const response = await amendEntity(selectedEntityCode, changedObjects, 'Modify', idFilterString);
                    if (response) {
                        const updatedRecords = [...cardParams.records];
                        updatedRecords[rowIndex] = record;
                        cardParams.setRecord(record);
                        cardParams.setRecords(updatedRecords);
                        setAlert({ id: uuidv4(), message: response.message, type: 'success' });
                    } else {
                        throw new Error('Edit failed');
                    }
                } catch (error) {
                    setAlert({ id: uuidv4(), message: error.message, type: 'error' });
                }
                setShowCard(false);
                setUpdateDisabled(true);
                setSearchError('');
            } else {
                setShowCard(false);
                setUpdateDisabled(true);
                setAlert({ id: uuidv4(), message: 'record failed to updated', type: 'error' });
            }
        }
    }

    return handleUpdateRecord;
}
