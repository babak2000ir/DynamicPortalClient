import React, { useState } from 'react';
import { timeFromXmlTimeString, dateFromXmlDateString, dateTimeFromXmlDateTimeString } from '../../helpers';
import { useGlobalStore } from '../../stores';
import { Tooltip } from 'react-tooltip';
import SearchLoader from '../Loader/SearchLoader';

const FieldCore = ({ useCardPageStore, f, fInfo, fields }) => {
    const [fieldValue, setFieldValue] = useState(f);
    const [fieldName, setFieldName] = useState('');
    const [searching, setSearching] = useState(false);
    const { setUpdateDisabled, updateDisabled, record, setRecord, setShowRelatedTable, searchError, setSearchError } = useCardPageStore();
    const { setRelatedTableLoading, quickEdit, entities } = useGlobalStore();

    const handleInputChange = (e) => {
        let newValue;

        if (e.target.type === 'checkbox') {
            newValue = e.target.checked;
        } else {
            switch (fInfo.type) {
                case 'Date':
                    newValue = e.target.value !== '' ? new Date(e.target.value).toISOString().substring(0, 10) : '';
                    break;
                case 'DateTime':
                    newValue = e.target.value !== '' ? new Date(e.target.value).toISOString() : '';
                    break;
                default:
                    newValue = e.target.value;
            }
        }
        setFieldValue(newValue);
        setFieldName(e.target.name);
        const idx = fields.map(f => f.name).indexOf(e.target.name);
        setUpdateDisabled(false);

        if (idx !== -1) {
            const updatedRecord = [...record];
            updatedRecord[idx] = newValue;
            setRecord(updatedRecord);
        }
    }

    const handleRelatedTableAction = (entityCode) => {
        const idx = fields.map(f => f.name).indexOf(fInfo.name);
        setRelatedTableLoading(true);
        setShowRelatedTable(true, { entityCode, idx, afterSelectRecord: handleSelectRecordCallback });
    }

    const handleSelectRecordCallback = (selectedValue) => {
        setFieldValue(selectedValue);
    }

    const searchRelatedTableRecordKey = async (entityCode) => {
        const entity = entities?.filter(t => t.id == entityCode && t.entityCode === '')?.[0];
        setSearchError('');
        if (!updateDisabled && fieldValue.trim() !== '') {
            try {
                setSearching(true);
                const response = ''; //await searchRelatedTableRecord(entityCode, fieldValue);
                if (response) {
                    if (response.error) {
                        setSearchError(`The field ${fieldName} contains a value (${fieldValue}) that cannot be found in the related table (${entity.caption}).`);
                        setUpdateDisabled(true);
                    }
                    if (response.value) {
                        setFieldValue(response.value);
                        setUpdateDisabled(false);
                        setFieldName('');
                        const idx = fields.map(f => f.name).indexOf(fInfo.name);
                        if (idx !== -1) {
                            const updatedRecord = [...record];
                            updatedRecord[idx] = response.value;
                            setRecord(updatedRecord);
                        }
                    }
                } else {
                    throw new Error('related table record search failed');
                }
            } catch (error) {
                console.error('Error in searchRelatedTableRecordKey:', error);
            } finally {
                setSearching(false);
            }
        }
    }

    switch (fInfo.type) {
        case 'Integer':
        case 'Decimal':
            return <input type="number" name={fInfo.name} value={fieldValue ? fieldValue : ''} onChange={handleInputChange} {...(fInfo.readOnly || fInfo.class === 'FlowField' || fInfo.partOfPrimaryKey ? { readOnly: true } : {})} />;
        case 'Text':
            return <input type="text" name={fInfo.name} value={fieldValue ? fieldValue : ''} onChange={handleInputChange} {...(fInfo.readOnly || fInfo.class === 'FlowField' || fInfo.partOfPrimaryKey ? { readOnly: true } : {})} />
        case 'Code':
            if (fInfo.relationTableNo) {
                return (
                    <>
                        <Tooltip id="error-tooltip" variant='error' place="bottom" />
                        <div className='relative overflow-hidden'>
                            {searchError && fInfo.name === fieldName && <i data-tooltip-id="error-tooltip" data-tooltip-content={`${searchError}`} className="fa-solid fa-circle-xmark text-red-700 pr-1 text-lg"></i>}
                            <input value={fieldValue ? fieldValue : ''} type="text" name={fInfo.name} onChange={handleInputChange} onBlur={() => searchRelatedTableRecordKey(fInfo.relationTableNo)} {...(fInfo.readOnly || fInfo.class === 'FlowField' || fInfo.partOfPrimaryKey ? { readOnly: true } : {})} className={`${searchError && fInfo.name === fieldName ? '!border !border-red-400' : ''}`} />
                            {!fInfo.readOnly &&
                                <div className={`flex items-center justify-center absolute right-0 -top-[2px] ${quickEdit ? 'hover:bg-indigo-100' : 'hover:bg-teal-100'} px-2 pb-1 cursor-pointer`} onClick={() => handleRelatedTableAction(fInfo.relationTableNo)}>
                                    <span className='text-xl font-medium' title={`Choose a value for ${fInfo.name}`}>...</span>
                                </div>
                            }
                            {searching && <SearchLoader />}
                        </div>
                    </>
                )
            } else {
                return <input value={fieldValue ? fieldValue : ''} type="text" name={fInfo.name} onChange={handleInputChange} {...(fInfo.readOnly || fInfo.class === 'FlowField' || fInfo.partOfPrimaryKey ? { readOnly: true } : {})} />
            }
        case 'Option':
            return (
                <select value={fieldValue ? fieldValue : ''} name={fInfo.name} onChange={handleInputChange}>
                    {fInfo.optionMembers.split(',').map(o => <option key={o} value={o} {...(fInfo.readOnly || fInfo.class === 'FlowField' || fInfo.partOfPrimaryKey ? { disabled: true } : {})}>{o}</option>)}
                </select>
            )
        case 'Time':
            return <input type="time" name={fInfo.name} value={timeFromXmlTimeString(fieldValue ? fieldValue : '')} onChange={handleInputChange} {...(fInfo.readOnly || fInfo.class === 'FlowField' || fInfo.partOfPrimaryKey ? { readOnly: true } : {})} />
        case 'Date':
            return <input type="date" name={fInfo.name} value={dateFromXmlDateString(fieldValue ? fieldValue : '')} onChange={handleInputChange} {...(fInfo.readOnly || fInfo.class === 'FlowField' || fInfo.partOfPrimaryKey ? { readOnly: true } : {})} />
        case 'DateTime':
            return <input type="datetime-local" name={fInfo.name} value={dateTimeFromXmlDateTimeString(fieldValue ? fieldValue : '')?.replace('Z', '')} onChange={handleInputChange} {...(fInfo.readOnly || fInfo.class === 'FlowField' || fInfo.partOfPrimaryKey ? { readOnly: true } : {})} />
        case 'Boolean':
            return <input type="checkbox" name={fInfo.name} value={fieldValue} checked={fieldValue} onChange={handleInputChange} {...(fInfo.readOnly || fInfo.class === 'FlowField'  || fInfo.partOfPrimaryKey ? { readOnly: true } : {})} />
        case 'GUID':
            return <input type="text" name={fInfo.name} value={fieldValue ? fieldValue : ''} onChange={handleInputChange} disabled readOnly />
        default:
            return <input type="text" name={fInfo.name} value={fieldValue ? fieldValue : ''} onChange={handleInputChange} disabled {...(fInfo.readOnly || fInfo.class === 'FlowField'  || fInfo.partOfPrimaryKey ? { readOnly: true } : {})} />
    }
}

export default FieldCore;