import React from 'react';
import FieldCore from './FieldCore';

const FieldControl = ({ f, fInfo, fields }) => {
    const labelSpan = '3';
    const inputSpan = '9';

    return (
        <div className='w3-row'>
            <div className={`w3-col m${labelSpan} w3-padding-small`}>
                <label className='w3-small' style={{ whiteSpace: "nowrap", overflow: "hidden" }}>{fInfo.name}</label>
            </div>
            <div className={`w3-col m${inputSpan} w3-right-align w3-padding-small form-wrapper`}>
                {fInfo.partOfPrimaryKey && <i className="bi bi-key"></i>}
                <FieldCore f={f} fInfo={fInfo} fields={fields} />
            </div>
        </div>
    )
}

export default FieldControl;