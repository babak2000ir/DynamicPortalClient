import { useState, useContext } from "react";
import { useGlobalStore } from "../stores";
import { cardPageContext } from "../context/globalContext";

export const useFieldCore = ({ fieldValue, setFieldValue, fieldName, setFieldName, setUpdateDisabled, updateDisabled, record, setRecord, setShowRelatedTable, setSearchError, fieldInfo }) => {
    const [searching, setSearching] = useState(false);
    const { setRelatedTableLoading, entities } = useGlobalStore();
    const { fields } = useContext(cardPageContext);

    const handleInputChange = (e) => {
        let newValue;

        if (e.target.type === 'checkbox') {
            newValue = e.target.checked;
        } else {
            switch (fieldInfo.type) {
                case 'Date':
                    newValue = new Date(e.target.value).toISOString().substring(0, 10);
                    break;
                case 'DateTime':
                    newValue = new Date(e.target.value).toISOString();
                    break;
                default:
                    newValue = e.target.value;
            }
        }
        setFieldValue(newValue);
        setFieldName(e.target.getAttribute('name'));
        const idx = fields.map(f => f.name).indexOf(e.target.name);
        setUpdateDisabled(false);

        if (idx !== -1) {
            const updatedRecord = [...record];
            updatedRecord[idx] = newValue;
            setRecord(updatedRecord);
        }
    };

    const handleRelatedTableAction = (entityCode) => {
        const idx = fields.map(f => f.name).indexOf(fieldName);
        setRelatedTableLoading(true);
        setShowRelatedTable(true, { entityCode, idx, afterSelectRecord: handleSelectRecordCallback });
    };

    const handleSelectRecordCallback = (selectedValue) => {
        setFieldValue(selectedValue);
    };

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
                        const idx = fields.map(f => f.name).indexOf(fieldName);
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
    };

    return {
        handleInputChange,
        handleRelatedTableAction,
        handleSelectRecordCallback,
        searchRelatedTableRecordKey,
        searching,
    };
};