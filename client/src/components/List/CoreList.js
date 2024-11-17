import { Fragment } from 'react';
import { useGlobalStore, PageMode, selectFields, selectEntity } from '../../stores';
import Pagination from '../Pagination';
import Loader from '../Loader/Loader';
import FieldCore from '../Card/FieldCore';
import AddRecordFieldCore from '../Card/AddRecordFieldCore';

const CoreList = ({ useListPageStore }) => {
    const { pages, selectedPage } = useGlobalStore();
    const {
        records,
        recordsLoading,
        selectedRecord,
        selectedRecordKey,
        setSelectedRecordKey,
        pageIndex,
        pageMode,
        setPageMode,
    } = useListPageStore();

    const pageMetadata = pages.find(page => page.id === selectedPage);

    const fields = useGlobalStore(selectFields(pageMetadata.entity));
    const entity = useGlobalStore(selectEntity(pageMetadata.entity));

    // Select a record on list
    const handleRowSelect = (record) => {
        if (pageMode === PageMode.View) {
            setSelectedRecordKey(record);
        }
    }

    // Click the View button on list row
    const handleView = (record) => {
        if (pageMode === PageMode.View) {
            //TODO - Call the card page
        }
    }

    // Click the edit button
    const handleEdit = () => {
        if (pageMode === PageMode.View) {
            setPageMode(PageMode.Edit);
        }
    }

    // Click the delete button
    const handleDelete = () => {
        if (pageMode === PageMode.View) {
            //TODO - Delete the record
        }
    }

    // handle New button
    const handleNew = () => {
        if (pageMode === PageMode.View) {
            setPageMode(PageMode.New);
        }
    };

    // Cancle
    const handleCancel = () => {
        if (pageMode === PageMode.Edit) {
            setPageMode(PageMode.View);
        }
        if (pageMode === PageMode.New) {
            setPageMode(PageMode.View);
        }
    }

    // Confirm
    const handleConfirm = () => {
        if (pageMode === PageMode.Edit) {
            setPageMode(PageMode.View);
        }
        if (pageMode === PageMode.New) {
            setPageMode(PageMode.View);
        }
    }

    return (
        <>
            {fields &&
                <>
                    <div className='flex pl-4 gap-4 items-center bg-white'>
                        <span className={`font-semibold text-sm uppercase`}>{entity?.caption}:</span>
                        <div className={`flex gap-4 prose-nform ${pageMode !== PageMode.View ? 'prose-p:cursor-not-allowed' : 'prose-p:cursor-pointer'} prose-p:m-0 prose-p:py-1 prose-p:px-2`}>
                            <p className='hover:bg-teal-100 hover:shadow hover:ring-1 hover:ring-offset-2 hover:ring-indigo-100 transition-colors duration-200 rounded' title="Edit the selected row in card" onClick={() => handleEdit()}>Edit <i className="bi bi-pencil-square"></i></p>
                            <p className='hover:bg-teal-100 hover:shadow hover:ring-1 hover:ring-offset-2 hover:ring-indigo-100 transition-colors duration-200 rounded' title="Delete the selected row" onClick={() => handleDelete()}>Delete <i className="fa-solid fa-trash"></i></p>
                            <p className='hover:bg-teal-100 hover:shadow hover:ring-1 hover:ring-offset-2 hover:ring-indigo-100 transition-colors duration-200 rounded' title="Quick edit the selected row in place" onClick={() => handleNew()}>New <i className="fa-solid fa-plus"></i></p>

                            {pageMode !== PageMode.View && <div className='flex gap-5 items-center'>
                                <span className='font-semibold'>: </span>
                                <i className="fa-solid fa-circle-check text-teal-600 text-2xl cursor-pointer hover:text-teal-800" title="Save changes in quick edit mode" onClick={() => handleConfirm()}>
                                </i><i className="fa-solid fa-circle-xmark text-red-600 text-2xl cursor-pointer hover:text-red-800" title="Exit quick edit mode" onClick={() => handleCancel()}></i>
                            </div>}
                        </div>
                    </div>
                </>
            }
            {recordsLoading ? (
                <Loader />
            ) : (
                <div className="w3-center w3-padding mt-3">
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
                                {records && records?.map((r, idx) => (
                                    <Fragment key={idx}>
                                        <tr key={idx} className={`table-shadow ${r === selectedRecord && 'bg-teal-100'}`} onClick={() => handleRowSelect(r)}>
                                            <td style={{ whiteSpace: 'nowrap' }} className='!pl-4 !p-0 text-sm'>
                                                <span className='flex items-center relative'>
                                                    <span className='pr-2'>{(pageIndex - 1) * 10 + idx}</span>
                                                    <i style={{ cursor: `${pageMode !== PageMode.View ? 'not-allowed' : 'pointer'}`, }} className="bi bi-pencil-square text-xl px-2 py-3 hover:bg-teal-100" onClick={() => handleView(r)}></i>
                                                </span>
                                            </td>
                                            {r.map((fv, rIdx) => (
                                                <td key={rIdx} className='!py-3 text-sm leading-loose' style={{ whiteSpace: 'nowrap' }}>
                                                    {
                                                        (pageMode === PageMode.Edit) && r === selectedRecord ? (
                                                            <FieldCore f={fv} fInfo={fields[rIdx]} fields={fields} />
                                                        ) : (
                                                            typeof (fv) === 'string' ? fv.substring(0, 80) : String(fv)
                                                        )
                                                    }
                                                </td>
                                            ))}
                                        </tr>
                                        {pageMode === PageMode.New && idx === records.length - 1 && (
                                            <tr key={`${idx}_extra`} className='table-shadow' onClick={() => handleRowSelect((idx + 1), [])}>
                                                <td style={{ whiteSpace: 'nowrap' }} className=' text-sm'>
                                                    <span className='pr-2'>{(pageIndex - 1) * 10 + idx + 1}</span>
                                                </td>
                                                {fields.map((field, idx) => (
                                                    <td key={idx}><AddRecordFieldCore useListPageStore={useListPageStore} field={field} /></td>
                                                ))}
                                            </tr>
                                        )}
                                    </Fragment>
                                ))}
                                {!records && pageMode === PageMode.New &&
                                    <tr className='table-shadow' onClick={() => handleRowSelect((1), [])}>
                                        <td style={{ whiteSpace: 'nowrap' }} className=' text-sm'>
                                            <span className='pr-2'>{(pageIndex - 1) * 10}</span>
                                        </td>
                                        {fields.map((field, idx) => (
                                            <td key={idx}><AddRecordFieldCore useListPageStore={useListPageStore} field={field}  /></td>
                                        ))}
                                    </tr>
                                }
                            </tbody>
                        </table>}
                    </div>
                    <Pagination useListPageStore={useListPageStore} />
                </div>
            )
            }
        </>
    );
}

export default CoreList;