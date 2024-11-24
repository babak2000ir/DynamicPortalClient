import React, { useState, useEffect } from 'react';
import { useGlobalStore, selectFields } from '../../stores';
import Loader from '../Loader/Loader';
import Pagination from '../Pagination';

const RelatedTableList = ({ selectedEntityCode }) => {
    const [rowIndex, setRowIndex] = useState(-1);
    const [records, setRecords] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const { loadEntity, showRelatedTable, setRelatedTableRecord, setRelatedTableUpdateDisabled } = ''; //();
    const { setRelatedTableLoading, relatedTableLoading } = useGlobalStore();
    const entityData = ''; //(state => state.entityCollection[selectedEntityCode]);
    const fields = useGlobalStore(selectFields(selectedEntityCode));

    useEffect(() => {
        const load = async () => {
            const res = await loadEntity(selectedEntityCode, pageIndex);
            setRelatedTableLoading(false);
            setRecords(res?.records);
        }
        if (selectedEntityCode && selectedEntityCode !== '0' && relatedTableLoading && showRelatedTable) {
            load();
        }
    }, [pageIndex, selectedEntityCode, records]);

    const handleRowSelect = (idx, r) => {
        setRowIndex(idx);
        setRelatedTableRecord(r);
        setRelatedTableUpdateDisabled(false);
    }

    return (
        <>
            {relatedTableLoading ? (
                <Loader showRelatedTable={showRelatedTable} />
            ) : (
                <div className="w3-center w3-padding">
                    <div className="w3-responsive">
                        {fields && <table className="w3-table w3-bordered w3-border">
                            <thead>
                                <tr>
                                    <th><i className="bi bi-hash"></i></th>
                                    {fields?.map(f =>
                                        <th style={{ whiteSpace: 'nowrap' }} key={f.id}>{f.caption.substring(0, 80)}</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className={`[&>*:nth-child(${rowIndex + 1})]:bg-teal-100`}>
                                {records?.map((r, idx) => (
                                    <tr key={idx} className='table-shadow' onClick={() => handleRowSelect(idx, r)}>
                                        <td style={{ whiteSpace: 'nowrap' }} className='!py-3 text-sm leading-loose'>

                                            <span>{(pageIndex - 1) * 10 + idx}</span>

                                        </td>
                                        {r.map((fv, rIdx) => (
                                            <td className='!py-3 text-sm leading-loose' style={{ whiteSpace: 'nowrap' }} key={rIdx}>

                                                {typeof (fv) === 'string' ? fv.substring(0, 80) : String(fv)}

                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>}
                    </div>
                    <Pagination pageCount={entityData?.paging?.pageCount} pageIndex={pageIndex} setPageIndex={setPageIndex} />
                </div>
            )
            }
        </>
    )
}

export default RelatedTableList;