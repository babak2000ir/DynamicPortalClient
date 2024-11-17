import React, { useState } from 'react';
import { timeFromXmlTimeString, dateFromXmlDateString, dateTimeFromXmlDateTimeString } from '../../helpers';
import { useGlobalStore, selectFields, PageMode } from '../../stores';
import { Tooltip } from 'react-tooltip';
import SearchLoader from '../Loader/SearchLoader';

const AddRecordFieldCore = ({ useListPageStore, field }) => {
    const { record, setRecord, pageMode } = useListPageStore();
    const { entities, selectedPage, pages } = useGlobalStore();

    const pageMetadata = pages.find(page => page.id === selectedPage);
    const fields = useGlobalStore(selectFields(pageMetadata.entity));
    
    const [fieldValue, setFieldValue] = useState('');
    const [fieldName, setFieldName] = useState('');

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
        const idx = fields.map(f => f.name).indexOf(e.target.name);

        if (idx !== -1) {
            const updatedRecord = [...record];
            updatedRecord[idx] = newValue;
            setRecord(updatedRecord);
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
                            {field.name === fieldName && <i data-tooltip-id="error-tooltip" className="fa-solid fa-circle-xmark text-red-700 pr-1 text-lg"></i>}
                            <input value={fieldValue ? fieldValue : ''} type="text" name={field.name} onChange={handleInputChange} {...(field.readOnly || field.class === 'FlowField' ? { readOnly: true } : {})} className={`!w-full ${field.name === fieldName ? '!border !border-red-400' : ''}`} />
                            {!field.readOnly && !field.partOfPrimaryKey &&
                                <div className={`flex items-center justify-center absolute right-0 -top-[2px] hover:bg-indigo-100 px-2 pb-1 cursor-pointer`}>
                                    <span className='text-xl font-medium' title={`Choose a value for ${field.name}`}>...</span>
                                </div>
                            }
                            {<SearchLoader />}
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
            return <input className={`!border-red-500 border`} type="time" name={field.name} value={timeFromXmlTimeString(fieldValue ? fieldValue : '')} onChange={handleInputChange} required {...(field.readOnly || field.class === 'FlowField' ? { readOnly: true } : {})} />
        case 'Date':
            return <input className={`!border-red-500 border`} type="date" name={field.name} value={dateFromXmlDateString(fieldValue ? fieldValue : '')} onChange={handleInputChange} required {...(field.readOnly || field.class === 'FlowField' ? { readOnly: true } : {})} />
        case 'DateTime':
            return <input className={`!border-red-500 border`} type="datetime-local" name={field.name} value={dateTimeFromXmlDateTimeString(fieldValue ? fieldValue : '')?.replace('Z', '')} onChange={handleInputChange} required {...(field.readOnly || field.class === 'FlowField' ? { readOnly: true } : {})} />
        case 'Boolean':
            return <input type="checkbox" name={field.name} value={fieldValue} checked={fieldValue} onChange={handleInputChange} {...(field.readOnly || field.class === 'FlowField' ? { readOnly: true } : {})} />
        case 'GUID':
            return <input type="text" name={field.name} value={fieldValue ? fieldValue : ''} onChange={handleInputChange} disabled readOnly />
        default:
            return <input type="text" name={field.name} value={fieldValue ? fieldValue : ''} onChange={handleInputChange} disabled {...(field.readOnly || field.class === 'FlowField' ? { readOnly: true } : {})} />
    }
}

export default AddRecordFieldCore;