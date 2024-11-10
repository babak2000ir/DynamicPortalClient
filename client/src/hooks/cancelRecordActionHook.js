import { useGlobalStore, usePageStore } from "../stores";
import { useUpdateRecord } from "./updateRecordHook";
import { useAddRecord } from "./addRecordHook";

export const useCancelRecordAction = (selectedEntityCode) => {
    const { setShowCard, updateDisabled, setUpdateDisabled, setSearchError, cardParams } = usePageStore();
    const { setShowModal } = useGlobalStore();
    const handleUpdateRecord = useUpdateRecord(selectedEntityCode);
    const handleAddRecord = useAddRecord(selectedEntityCode);

    const handleCancelRecordAction = () => {
        if (updateDisabled === false) {
            setSearchError('');
            setUpdateDisabled(true);
            setShowModal(
                true,
                {
                    title: `${cardParams.isInsert ? 'Add' : 'Edit'} Record`,
                    content: `Save your changes and ${cardParams.isInsert ? 'add' : 'update'} the record? Otherwise your changes will not apply`,
                    closeBtn: "Don't save",
                    actionBtn: `Save and ${cardParams.isInsert ? 'Add' : 'Update'} Record`,
                    actionBtnColor: 'teal',
                    actionType: `${cardParams.isInsert ? 'add' : 'update'}`,
                    handleAction: cardParams.isInsert ? handleAddRecord : handleUpdateRecord
                }
            );
        } else {
            setShowCard(false);
            setUpdateDisabled(true);
            setSearchError('');
        }
    }

    return handleCancelRecordAction;
}