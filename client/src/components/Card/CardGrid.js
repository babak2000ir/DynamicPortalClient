import React, { useContext } from 'react';
import FieldSet from './FieldSet';
import { cardPageContext } from '../../context/globalContext';

const CardGrid = () => {
    let cardGrid = [];
    const { fieldsInFullColumns, numberOfColumns, record, fields, colSpan } = useContext(cardPageContext);

    for (let rowIdx = 0; rowIdx < fieldsInFullColumns; rowIdx++) {
        cardGrid.push(<div key={rowIdx} className="w3-row">
            <FieldSet key={rowIdx} numberOfColumns={numberOfColumns} record={record} fields={fields} rowIdx={rowIdx} colSpan={colSpan} />
        </div>)
    }

    return cardGrid;
}

export default CardGrid