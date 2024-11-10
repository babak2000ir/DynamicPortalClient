
import { useState, useEffect } from 'react';
import { selectFields, useGlobalStore, usePageStore, selectEntity, selectRelations, selectRelatedEntityCode } from '../../stores';
import { useCancelRecordAction } from '../../hooks/cancelRecordActionHook';
import { useUpdateRecord } from '../../hooks/updateRecordHook';
import { cardPageContext } from '../../context/globalContext';
import CardGrid from './CardGrid';
import AddRecordCardGrid from './AddRecordCardGrid';
import RecordRelationsList from '../List/RecordRelationsList';
import { mapPrimaryKeyFieldstoRecord } from '../../helpers';

export const Card = ({ selectedEntityCode }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const { showCard, record, updateDisabled, searchError, cardParams } = usePageStore();
    const { setRecordRelationsLoading } = useGlobalStore();
    const entity = useGlobalStore(selectEntity(selectedEntityCode));
    const fields = useGlobalStore(selectFields(selectedEntityCode));
    const relations = useGlobalStore(selectRelations(selectedEntityCode));
    const relatedEntityCode = useGlobalStore(selectRelatedEntityCode(selectedEntityCode));

    const numberOfColumns = 2;
    const fieldsInFullColumns = Math.floor(fields?.length / numberOfColumns) + 1;
    const colSpan = Math.floor(12 / numberOfColumns).toString();
    const recordKey = record ? fields?.filter(f => f.partOfPrimaryKey).map(f => record[fields.indexOf(f)]).join(' - ') : null;

    const handleCloseCard = useCancelRecordAction(selectedEntityCode);

    const handleUpdateRecord = useUpdateRecord(selectedEntityCode);

    useEffect(() => {
        if (!showCard) {
            setTabIndex(0);
        }
    }, [showCard]);

    const handleRelationsTabClick = (idx) => {
        const lIdx = idx + 1;

        if (lIdx !== tabIndex) {
            setTabIndex(lIdx);
            setRecordRelationsLoading(true);
        }
    }

    return (
        showCard && fieldsInFullColumns &&
        <>
            <div id="id01" className="w3-modal font-jost z-20" style={{ display: 'block' }}>
                <div className="w3-modal-content w3-card-4 w3-animate-zoom">
                    <header className="w3-container bg-indigo-700 text-white text-base">
                        <span onClick={() => handleCloseCard()}
                            className="w3-button bg-indigo-700 text-white w3-xlarge w3-display-topright hover:!bg-indigo-300 hover:!text-white">&times;</span>
                        <h2>{cardParams.isInsert ? 'Add New Record: ' : 'Edit Record: '} {`${entity.entityCode ? `Entity` : `Table`} "${entity.caption}" (${entity.id})`}</h2>
                    </header>

                    {searchError &&
                        <div className='py-1 px-4 bg-red-100 border-b border-red-400 flex items-center text-md'>
                            <p><i className="fa-solid fa-circle-exclamation text-red-700"></i> The page has an error.</p>
                        </div>
                    }

                    <div className="w3-bar w3-border-bottom mb-6">
                        <button className={`tablink w3-bar-item w3-button ${tabIndex === 0 ? 'w3-light-grey' : ''}`} onClick={() => setTabIndex(0)}>Header</button>
                        {relations && relations.length > 0 &&
                            relations.map((relation, idx) => {
                                return (
                                    <div key={idx}>
                                        <button className={`tablink w3-bar-item w3-button ${tabIndex === (idx + 1) ? 'w3-light-grey' : ''}`} onClick={() => handleRelationsTabClick(idx)}>{relation.caption}</button>
                                    </div>
                                )
                            })
                        }
                    </div>

                    {tabIndex === 0 && <div id="London" className={`${!cardParams.isInsert && 'w3-container'} city`}>
                        <cardPageContext.Provider value={{ fieldsInFullColumns, numberOfColumns, record, fields, colSpan, selectedEntityCode }}>
                            <h1 className={`${cardParams.isInsert && 'w3-container'}`}>{`( ${recordKey} )`}</h1>
                            {cardParams.isInsert ? (
                                <AddRecordCardGrid />
                            ) : (
                                <CardGrid />
                            )}
                        </cardPageContext.Provider>
                    </div>}

                    {relations && relations.length > 0 &&
                        relations.map((relation, idx) => {
                            return (
                                <div key={idx}>
                                    {tabIndex === (idx + 1) && <div id="Paris" className="w3-container city">
                                        <div className="w3-padding flex gap-4 items-center">
                                            <h1 className='font-medium'>{relation.caption}:</h1>
                                            <div className='flex gap-4 prose-p:cursor-pointer prose-p:py-1 prose-p:px-2'>
                                                <p className='hover:bg-teal-100 hover:shadow hover:ring-1 hover:ring-offset-2 hover:ring-indigo-100 transition-colors duration-200 rounded' title="Edit the selected row in card">Edit <i className="bi bi-pencil-square"></i></p>
                                                <p className='hover:bg-teal-100 hover:shadow hover:ring-1 hover:ring-offset-2 hover:ring-indigo-100 transition-colors duration-200 rounded' title="Delete the selected row">Delete <i className="fa-solid fa-trash"></i></p>
                                                <p className='hover:bg-teal-100 hover:shadow hover:ring-1 hover:ring-offset-2 hover:ring-indigo-100 transition-colors duration-200 rounded' title="Quick edit the selected row in place">New <i className="fa-solid fa-plus"></i></p>
                                            </div>
                                        </div>
                                        <RecordRelationsList selectedEntityCode={relation.entityCode ? relation.entityCode : relation.id} relatedEntityCode={relatedEntityCode} filterParams={mapPrimaryKeyFieldstoRecord(fields, record)} />
                                    </div>}
                                </div>
                            )
                        })
                    }

                    {!cardParams.isInsert &&
                        <div className="w3-container w3-light-grey w3-padding mt-6 flex gap-4 justify-end">
                            <button className="w3-button w3-right bg-teal-600 hover:!bg-teal-400 hover:!text-white text-white rounded hover:ring-2 hover:ring-offset-2 hover:ring-teal-300 transition-colors duration-200" disabled={updateDisabled} onClick={() => handleUpdateRecord()} >Update</button>
                            <button className="w3-button w3-right bg-indigo-700 hover:!bg-indigo-400 hover:!text-white text-white rounded hover:ring-2 hover:ring-offset-2 hover:ring-indigo-300 transition-colors duration-200" onClick={() => handleCloseCard()} >Close</button>
                        </div>
                    }
                </div>
            </div>
        </>
    );
}

//TODO: debounce the update button

