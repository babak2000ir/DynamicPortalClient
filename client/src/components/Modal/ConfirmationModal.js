import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useGlobalStore, selectFields } from '../../stores';
import { amendEntity } from '../../services/entitySvc';
import { mapPrimaryKeyFieldstoRecord } from '../../helpers';

const ConfirmationModal = ({ useCardPageStore }) => {
    const { setShowModal, showModal, modalParams, setRowIndex, setAlert } = useGlobalStore();
    const { setShowCard, setUpdateDisabled, setSearchError } = useCardPageStore();
    const fields = useGlobalStore(selectFields(modalParams?.selectedEntityCode));

    const handleCancel = () => {
        setShowModal(false, {});
        setShowCard(false);
        setUpdateDisabled(true);
        setSearchError('');
    }

    const handleAction = async (actionType) => {
        switch (actionType) {
            case 'delete':
                try {
                    const response = await amendEntity(modalParams.selectedEntityCode, mapPrimaryKeyFieldstoRecord(fields, modalParams.recordData), 'Delete');
                    if (response) {
                        const updatedRecords = [...modalParams.records.slice(0, modalParams.rowIndex), ...modalParams.records.slice(modalParams.rowIndex + 1)];
                        modalParams.setRecords(updatedRecords);
                        setAlert({ id: uuidv4(), message: response.message, type: 'success' });
                    } else {
                        throw new Error('Delete failed');
                    }
                } catch (error) {
                    setAlert({ id: uuidv4(), message: error.message, type: 'error' });
                }
                setShowModal(false);
                setRowIndex(0);
                break;
            case 'update':
                modalParams.handleAction();
                setShowModal(false);
                setShowCard(false);
                setUpdateDisabled(true);
                setSearchError('');
                break;
            case 'add':
                modalParams.handleAction();
                setShowModal(false);
                setSearchError('');
                break;
            default:
        }
    }

    return (
        showModal && <div id="delete-modal" className="w3-modal z-20" style={{ display: 'block' }}>
            <div className="w3-modal-content !w-1/4 w3-animate-zoom shadow">
                <header className="w3-container bg-indigo-700 text-white">
                    <h2 className='font-jost py-2'>{modalParams.title}</h2>
                </header>

                <div className="w3-container p-6 flex items-center gap-3">
                    <span className='border-2 border-indigo-900 rounded-[50%] py-2 px-3 flex items-center justify-center'><i className="fa-solid fa-question"></i></span>
                    <p>{modalParams.content}{modalParams.rowIndex && modalParams.pageIndex && `${(modalParams.pageIndex - 1) * 10 + modalParams.rowIndex}`}</p>
                </div>

                <footer className="pb-4 pr-3 flex gap-4 justify-end">
                    <button className={`px-4 py-1 bg-${modalParams.actionBtnColor}-600 hover:bg-${modalParams.actionBtnColor}-800 rounded text-white w3-border hover:shadow hover:ring-2 hover:ring-offset-2 hover:ring-${modalParams.actionBtnColor}-300 transition-colors duration-200`} onClick={() => handleAction(modalParams.actionType)}>{modalParams.actionBtn}</button>
                    <button className="px-4 py-1 rounded bg-indigo-700 hover:bg-indigo-400 text-white hover:shadow hover:ring-2 hover:ring-offset-2 hover:ring-indigo-300 transition-colors duration-200" onClick={() => handleCancel()}>{modalParams.closeBtn}</button>
                </footer>

            </div>
        </div>
    );
}

export default ConfirmationModal;