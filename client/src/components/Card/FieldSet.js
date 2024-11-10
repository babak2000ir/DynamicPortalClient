import React, { useContext } from 'react';
import FieldControl from './FieldControl';
import { cardPageContext } from '../../context/globalContext';

const FieldSet = ({ rowIdx }) => {
    let fieldSet = [];
    const { numberOfColumns, record, fields, colSpan } = useContext(cardPageContext);

    for (let colIdx = 0; colIdx < numberOfColumns; colIdx++) {
        const fieldIdx = (rowIdx * numberOfColumns) + colIdx;

        if (fields[fieldIdx])
            fieldSet.push(<div key={fieldIdx} className={`w3-col m${colSpan}`}>
                <FieldControl key={fieldIdx} f={record[fieldIdx]} fInfo={fields[fieldIdx]} fields={fields} />
            </div>)
    }

    return fieldSet;
}

export default FieldSet;