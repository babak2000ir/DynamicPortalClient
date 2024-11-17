import React from 'react';
import FieldSet from './FieldSet';
import { useGlobalStore, selectFields } from '../../stores';


const CardGrid = ({ useCardPageStore }) => {
    const { pages, selectedPage } = useGlobalStore();
    const { record, numberOfColumns } = useCardPageStore();

    const pageMetadata = pages.find(page => page.id === selectedPage);

    const fields = useGlobalStore(selectFields(pageMetadata.entity));

    const fieldsInFullColumns = Math.floor(fields?.length / numberOfColumns) + 1;
    const colSpan = Math.floor(12 / numberOfColumns).toString();

    const cardGrid = [];

    for (let rowIdx = 0; rowIdx < fieldsInFullColumns; rowIdx++) {
        cardGrid.push(
            <div key={rowIdx} className="w3-row">
                <FieldSet key={rowIdx} rowIdx={rowIdx} useCardPageStore={useCardPageStore} />
            </div>
        )
    }

    return cardGrid;
}

export default CardGrid