import { useEffect, useState } from 'react';
import { useGlobalStore, usePageStore, selectFields } from '../../stores';
import Loader from '../Loader/Loader';
import Pagination from '../Pagination';

const RecordRelationsList = ({ selectedEntityCode, relatedEntityCode, filterParams }) => {
    const [records, setRecords] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const { loadEntity } = usePageStore();
    const { setRowIndex, setRecordRelationsLoading, recordRelationsLoading } = useGlobalStore();
    const entityData = usePageStore(state => state.entityCollection[selectedEntityCode]);
    const fields = useGlobalStore(selectFields(selectedEntityCode));

    useEffect(() => {
        const load = async () => {
            const res = await loadEntity(selectedEntityCode, pageIndex, filterParams, relatedEntityCode);
            setRecordRelationsLoading(false);
            setRowIndex(0);
            setRecords(res?.records);
        }
        if (selectedEntityCode && selectedEntityCode !== '0' && recordRelationsLoading) {
            load();
        }
        window.scrollTo(0, 0);
    }, [pageIndex, selectedEntityCode]);

    const handleRowSelect = () => { }

    return (
        <>
            {recordRelationsLoading ? (
                <Loader showRelatedTable={true} />
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
                            <tbody>
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

export default RecordRelationsList;