
import { useState, useEffect } from 'react';
import { selectFields, useGlobalStore, selectEntity, selectRelations, selectRelatedEntityCode } from '../../stores';
import CardGrid from './CardGrid';
import RecordRelationsList from '../List/RecordRelationsList';
import { mapPrimaryKeyFieldstoRecord } from '../../helpers';

export const Card = ({ useCardPageStore }) => {
    const { pages, selectedPage, keyFieldsValue } = useGlobalStore();
    const { record, loadRecord } = useCardPageStore();

    const pageMetadata = pages.find(page => page.id === selectedPage);

    useEffect(() => {
        loadRecord(pageMetadata.entity, keyFieldsValue);
        window.scrollTo(0, 0);
    }, [pageMetadata, keyFieldsValue]);


    const [tabIndex, setTabIndex] = useState(0);
    const { setRecordRelationsLoading } = useGlobalStore();

    const entity = useGlobalStore(selectEntity(pageMetadata.entity));
    const fields = useGlobalStore(selectFields(pageMetadata.entity));

    const relations = useGlobalStore(selectRelations(pageMetadata.entity));
    const relatedEntityCode = useGlobalStore(selectRelatedEntityCode(pageMetadata.entity));

    const recordKey = record ? fields?.filter(f => f.partOfPrimaryKey).map(f => record[fields.indexOf(f)]).join(' - ') : null;

    const handleRelationsTabClick = (idx) => {
        const lIdx = idx + 1;

        if (lIdx !== tabIndex) {
            setTabIndex(lIdx);
            setRecordRelationsLoading(true);
        }
    }

    return (
        <>
            <div id="id01" className="font-jost z-20">
                <div className="w3-card-4">
                    <header className="w3-container bg-indigo-700 text-white text-base">
                        <span onClick={() => { }}
                            className="w3-button bg-indigo-700 text-white w3-xlarge w3-display-topright hover:!bg-indigo-300 hover:!text-white">&times;</span>
                        <h2>{true ? 'Add New Record: ' : 'Edit Record: '} {`${entity.entityCode ? `Entity` : `Table`} "${entity.caption}" (${entity.id})`}</h2>
                    </header>

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

                    <div id="London" className={`${'w3-container'} city`}>
                        <h1 className={`${'w3-container'}`}>{`( ${recordKey} )`}</h1>
                        <CardGrid useCardPageStore={useCardPageStore} />
                    </div>

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

                    {
                        <div className="w3-container w3-light-grey w3-padding mt-6 flex gap-4 justify-end">
                            <button className="w3-button w3-right bg-teal-600 hover:!bg-teal-400 hover:!text-white text-white rounded hover:ring-2 hover:ring-offset-2 hover:ring-teal-300 transition-colors duration-200" onClick={() => { }} >Update</button>
                            <button className="w3-button w3-right bg-indigo-700 hover:!bg-indigo-400 hover:!text-white text-white rounded hover:ring-2 hover:ring-offset-2 hover:ring-indigo-300 transition-colors duration-200" onClick={() => { }} >Close</button>
                        </div>
                    }
                </div>
            </div>
        </>
    );
}

//TODO: debounce the update button

