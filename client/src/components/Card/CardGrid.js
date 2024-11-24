import React from 'react';
import FieldSet from './FieldSet';
import { useGlobalStore, getEntity } from '../../stores';

const CardGrid = () => {
    const { pages, selectedPage } = useGlobalStore();
    const entity = useGlobalStore(getEntity);

    const { numberOfColumns } = ''; //();

    const pageMetadata = pages.find(page => page.id === selectedPage);

    const fieldsInFullColumns = Math.floor(entity.fields?.length / numberOfColumns) + 1;
    const colSpan = Math.floor(12 / numberOfColumns).toString();

    const cardGrid = [];

    for (let rowIdx = 0; rowIdx < fieldsInFullColumns; rowIdx++) {
        cardGrid.push(
            <div key={rowIdx} className="w3-row">
                <FieldSet key={rowIdx} rowIdx={rowIdx} />
            </div>
        )
    }

    return cardGrid;
}

export default CardGrid