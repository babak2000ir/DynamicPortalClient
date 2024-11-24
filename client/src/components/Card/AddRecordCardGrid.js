import React, { useState, useContext, useEffect } from 'react';
import { cardPageContext } from '../../context/globalContext';
import AddRecordFieldCore from './AddRecordFieldCore';
import { useAddRecord } from '../../hooks/addRecordHook';
import { useCancelRecordAction } from '../../hooks/cancelRecordActionHook';
import { isFormValid } from '../../helpers';

const AddRecordCardGrid = () => {
    const { fields, selectedEntityCode } = useContext(cardPageContext);
    const [fieldValidity, setFieldValidity] = useState({});
    const { updateDisabled, setInsertFormValid } = ''; //();
    const handleAddRecord = useAddRecord(selectedEntityCode);
    const handleCloseCard = useCancelRecordAction(selectedEntityCode);

    useEffect(() => {
        setInsertFormValid(isFormValid(fields, fieldValidity));
    }, [fieldValidity]);

    // Function to update the validity of a field
    const updateFieldValidity = (fieldName, isValid) => {
        setFieldValidity((prevValidity) => ({
            ...prevValidity,
            [fieldName]: isValid,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddRecord();
    }

    return (
        <form className='relative' onSubmit={(e) => handleSubmit(e)}>
            <div className='grid grid-cols-2 gap-x-6 gap-y-3 px-4 py-1'>

                {fields.map((field, idx) =>
                    <div key={idx} className='flex justify-between form-wrapper items-center'>
                        <p className='text-xs'>
                            {field.name}
                            <span className='ml-1 text-red-500 text-lg'>{field.type === 'Date' || field.type === 'DateTime' || field.type === 'Time' ? '*' : ''}</span>
                        </p>
                        <AddRecordFieldCore
                            field={field}
                            updateFieldValidity={updateFieldValidity}
                        />
                    </div>
                )}
            </div>

            <div className="w3-container w3-light-grey w3-padding mt-6 flex gap-4 justify-end">
                <input type="submit" value="Add" className="w3-button w3-right !bg-teal-600 hover:!bg-teal-400 hover:!text-white !text-white rounded hover:shadow hover:ring-2 hover:ring-offset-2 hover:ring-teal-300 transition-colors duration-200" disabled={updateDisabled} />
                <input type="button" value="Close" className="w3-button w3-right !bg-indigo-700 hover:!bg-indigo-400 hover:!text-white !text-white rounded hover:shadow hover:ring-2 hover:ring-offset-2 hover:ring-indigo-300 transition-colors duration-200" onClick={() => handleCloseCard()} />
            </div>
        </form>
    );
};

export default AddRecordCardGrid;
//TODO: debounce the add button
