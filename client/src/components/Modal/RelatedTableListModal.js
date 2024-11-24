import React from 'react';
import { useGlobalStore, getEntity } from '../../stores';
import RelatedTableList from '../List/RelatedTableList';

const RelatedTableListModal = () => {
    const {
        showRelatedTable,
        setShowRelatedTable,
        record,
        relatedTableRecord,
        setRecord,
        setUpdateDisabled,
        relatedTableUpdateDisabled,
        setRelatedTableUpdateDisabled,
        setSearchError } = ''//();
    const { entityCode, idx, afterSelectRecord } = {};
    const entity = useGlobalStore(getEntity);

    const handleCancel = () => {
        setShowRelatedTable(false, { entityCode });
        setRelatedTableUpdateDisabled(true);
    }

    const handleSelectRecord = () => {
        if (idx !== -1) {
            const updatedRecord = [...record];
            updatedRecord[idx] = relatedTableRecord[0];
            setRecord(updatedRecord);
            setUpdateDisabled(false);
            setSearchError('');

            if (afterSelectRecord) {
                afterSelectRecord(relatedTableRecord[0]);
            }
        }
        setShowRelatedTable(false, { entityCode });
        setRelatedTableUpdateDisabled(true);
    }

    return (
        showRelatedTable && <div id="delete-modal" className="w3-modal z-20" style={{ display: 'block' }}>
            <div className="w3-modal-content !w-1/2 w3-animate-zoom shadow">
                <header className="w3-container bg-teal-700 text-white">
                    <h2 className='font-jost py-2'>{`${entity.entityCode ? `Entity` : `Table`} "${entity.caption}" (${entity.id})`}</h2>
                </header>

                <div className="w3-container p-6 items-center gap-3">
                    <RelatedTableList selectedEntityCode={entityCode ? entityCode : ''} />
                </div>

                <footer className="pb-4 pr-3 flex gap-4 justify-end">
                    <button className="w3-button w3-right bg-teal-600 hover:!bg-teal-400 hover:!text-white text-white rounded hover:ring-2 hover:ring-offset-2 hover:ring-teal-300 transition-colors duration-200" disabled={relatedTableUpdateDisabled} onClick={() => handleSelectRecord()} >Select</button>
                    <button className="px-4 py-1 rounded bg-indigo-700 hover:bg-indigo-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-300 transition-colors duration-200" onClick={() => handleCancel()}>Close</button>
                </footer>

            </div>
        </div>
    )
}

export default RelatedTableListModal;
