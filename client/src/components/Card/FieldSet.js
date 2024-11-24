import React from 'react';
import FieldControl from './FieldControl';
import { useGlobalStore, getEntity } from '../../stores';

const FieldSet = ({ rowIdx }) => {
    const fields = useGlobalStore().fields;

    const { numberOfColumns } = ''; //();

    const colSpan = Math.floor(12 / numberOfColumns).toString();

    let fieldSet = [];

    for (let colIdx = 0; colIdx < numberOfColumns; colIdx++) {
        const fieldIdx = (rowIdx * numberOfColumns) + colIdx;

        if (fields[fieldIdx])
            fieldSet.push(
                <div key={fieldIdx} className={`w3-col m${colSpan}`}>
                    <FieldControl key={fieldIdx} fieldIdx={fieldIdx} />
                </div>
            )
    }

    return fieldSet;
}

export default FieldSet;