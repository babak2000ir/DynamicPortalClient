import { useGlobalStore } from "../stores";

export const useDeleteRecord = (pageIndex, records, setRecords, selectedEntityCode, recordData) => {
    const { rowIndex, setShowModal } = useGlobalStore();

    const handleDeleteRecord = () => {
        setShowModal(
            true,
            {
                title: 'Delete Record',
                content: 'Are you sure you want to delete row #',
                closeBtn: 'Cancel',
                actionBtn: 'Delete',
                actionBtnColor: 'red',
                rowIndex,
                pageIndex,
                actionType: 'delete',
                records,
                setRecords,
                selectedEntityCode,
                recordData
            },
        );
    }
    return handleDeleteRecord;
}
