import React, { useState, useContext } from 'react';
import { timeFromXmlTimeString, dateFromXmlDateString, dateTimeFromXmlDateTimeString } from '../../helpers';
import { useGlobalStore } from '../../stores';
import { Tooltip } from 'react-tooltip';
import SearchLoader from '../Loader/SearchLoader';
import { cardPageContext } from '../../context/globalContext';

const AddRecordFieldCore = ({ useCardPageStore, field, updateFieldValidity, fieldsProp }) => {
    const [fieldValue, setFieldValue] = useState('');
    const [fieldName, setFieldName] = useState('');
    const [searching, setSearching] = useState(false);
    const { setUpdateDisabled, updateDisabled, record, setRecord, setShowRelatedTable, searchError, setSearchError } = useCardPageStore();
    const { setRelatedTableLoading, quickAdd, entities } = useGlobalStore();
    const { fields } = useContext(cardPageContext);
    const fieldsList = fields ? fields : fieldsProp;

    const handleInputChange = (e) => {
        let newValue;

        if (e.target.type === 'checkbox') {
            newValue = e.target.checked;
        } else {
            switch (field.type) {
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
        const idx = fieldsList.map(f => f.name).indexOf(e.target.name);
        updateDisabled && setUpdateDisabled(false);

        if (idx !== -1) {
            const updatedRecord = [...record];
            updatedRecord[idx] = newValue;
            setRecord(updatedRecord);
        }

        const isValid = !e.target.required || !!newValue;
        updateFieldValidity(field.name, isValid);
    }

    const handleRelatedTableAction = (entityCode) => {
        const idx = fieldsList.map(f => f.name).indexOf(field.name);
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
                        const idx = fieldsList.map(f => f.name).indexOf(field.name);
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

    switch (field.type) {
        case 'Integer':
        case 'Decimal':
            return <input type="number" name={field.name} value={fieldValue ? fieldValue : ''} onChange={handleInputChange} {...(field.readOnly || field.class === 'FlowField' ? { readOnly: true } : {})} />;
        case 'Text':
            return <input type="text" name={field.name} value={fieldValue ? fieldValue : ''} onChange={handleInputChange} {...(field.readOnly || field.class === 'FlowField' ? { readOnly: true } : {})} />
        case 'Code':
            if (field.relationTableNo) {
                return (
                    <>
                        <Tooltip id="error-tooltip" variant='error' place="bottom" />
                        <div className='relative overflow-hidden w-1/2 flex'>
                            {searchError && field.name === fieldName && <i data-tooltip-id="error-tooltip" data-tooltip-content={`${searchError}`} className="fa-solid fa-circle-xmark text-red-700 pr-1 text-lg"></i>}
                            <input value={fieldValue ? fieldValue : ''} type="text" name={field.name} onChange={handleInputChange} onBlur={() => searchRelatedTableRecordKey(field.relationTableNo)} {...(field.readOnly || field.class === 'FlowField' ? { readOnly: true } : {})} className={`!w-full ${searchError && field.name === fieldName ? '!border !border-red-400' : ''}`} />
                            {!field.readOnly && !field.partOfPrimaryKey &&
                                <div className={`flex items-center justify-center absolute right-0 -top-[2px] ${quickAdd ? 'hover:bg-indigo-100' : 'hover:bg-teal-100'} px-2 pb-1 cursor-pointer`} onClick={() => handleRelatedTableAction(field.relationTableNo)}>
                                    <span className='text-xl font-medium' title={`Choose a value for ${field.name}`}>...</span>
                                </div>
                            }
                            {searching && <SearchLoader />}
                        </div>
                    </>
                )
            } else {
                return <input value={fieldValue ? fieldValue : ''} type="text" name={field.name} onChange={handleInputChange} {...(field.readOnly || field.class === 'FlowField' ? { readOnly: true } : {})} />
            }
        case 'Option':
            return (
                <select value={fieldValue ? fieldValue : ''} name={field.name} onChange={handleInputChange}>
                    {field.optionMembers.split(',').map(o => <option key={o} value={o} {...(field.readOnly || field.class === 'FlowField' ? { disabled: true } : {})}>{o}</option>)}
                </select>
            )
        case 'Time':
            return <input className={`${quickAdd ? '!border-red-500 border' : ''}`} type="time" name={field.name} value={timeFromXmlTimeString(fieldValue ? fieldValue : '')} onChange={handleInputChange} required {...(field.readOnly || field.class === 'FlowField' ? { readOnly: true } : {})} />
        case 'Date':
            return <input className={`${quickAdd ? '!border-red-500 border' : ''}`} type="date" name={field.name} value={dateFromXmlDateString(fieldValue ? fieldValue : '')} onChange={handleInputChange} required {...(field.readOnly || field.class === 'FlowField' ? { readOnly: true } : {})} />
        case 'DateTime':
            return <input className={`${quickAdd ? '!border-red-500 border' : ''}`} type="datetime-local" name={field.name} value={dateTimeFromXmlDateTimeString(fieldValue ? fieldValue : '')?.replace('Z', '')} onChange={handleInputChange} required {...(field.readOnly || field.class === 'FlowField' ? { readOnly: true } : {})} />
        case 'Boolean':
            return <input type="checkbox" name={field.name} value={fieldValue} checked={fieldValue} onChange={handleInputChange} {...(field.readOnly || field.class === 'FlowField' ? { readOnly: true } : {})} />
        case 'GUID':
            return <input type="text" name={field.name} value={fieldValue ? fieldValue : ''} onChange={handleInputChange} disabled readOnly />
        default:
            return <input type="text" name={field.name} value={fieldValue ? fieldValue : ''} onChange={handleInputChange} disabled {...(field.readOnly || field.class === 'FlowField' ? { readOnly: true } : {})} />
    }
}

export default AddRecordFieldCore;