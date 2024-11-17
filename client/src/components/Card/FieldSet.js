import React from 'react';
import FieldControl from './FieldControl';
import { useGlobalStore, selectFields } from '../../stores';

const FieldSet = ({ useCardPageStore, rowIdx }) => {
    const { pages, selectedPage } = useGlobalStore();
    const { record, numberOfColumns } = useCardPageStore();

    const pageMetadata = pages.find(page => page.id === selectedPage);

    const fields = useGlobalStore(selectFields(pageMetadata.entity));

    const colSpan = Math.floor(12 / numberOfColumns).toString();

    let fieldSet = [];

    for (let colIdx = 0; colIdx < numberOfColumns; colIdx++) {
        const fieldIdx = (rowIdx * numberOfColumns) + colIdx;

        if (fields[fieldIdx])
            fieldSet.push(
                <div key={fieldIdx} className={`w3-col m${colSpan}`}>
                    <FieldControl key={fieldIdx} fieldIdx={fieldIdx} useCardPageStore={useCardPageStore} />
                </div>
            )
    }

    return fieldSet;
}

export default FieldSet;