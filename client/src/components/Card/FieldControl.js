import React from 'react';
import FieldCore from './FieldCore';
import { useGlobalStore, selectFields } from '../../stores';

const FieldControl = ({ useCardPageStore, fieldIdx }) => {
    const labelSpan = '3';
    const inputSpan = '9';

    const { pages, selectedPage } = useGlobalStore();

    const pageMetadata = pages.find(page => page.id === selectedPage);

    const fields = useGlobalStore(selectFields(pageMetadata.entity));

    const fInfo=fields[fieldIdx];

    return (
        <div className='w3-row'>
            <div className={`w3-col m${labelSpan} w3-padding-small`}>
                <label className='w3-small' style={{ whiteSpace: "nowrap", overflow: "hidden" }}>{fInfo.name}</label>
            </div>
            <div className={`w3-col m${inputSpan} w3-right-align w3-padding-small form-wrapper`}>
                {fInfo.partOfPrimaryKey && <i className="bi bi-key"></i>}
                <FieldCore useCardPageStore={useCardPageStore} fieldIdx={fieldIdx} />
            </div>
        </div>
    )
}

export default FieldControl;