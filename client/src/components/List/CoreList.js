import { useState, useEffect, useRef, Fragment } from 'react';
import { useGlobalStore, selectFields, selectEntity } from '../../stores';
import { useDeleteRecord } from '../../hooks/deleteRecordHook';
import Pagination from '../Pagination';
import Loader from '../Loader/Loader';
import FieldCore from '../Card/FieldCore';
import AddRecordFieldCore from '../Card/AddRecordFieldCore';
import { v4 as uuidv4 } from 'uuid';
import { isFormValid } from '../../helpers';

const CoreList = ({ useListPageStore, records, pageIndex, setPageIndex, entityCode }) => {
    const [record, setRecord] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [fieldValidity, setFieldValidity] = useState({});
    const dropdownRef = useRef(null);
    const { rowIndex, setRowIndex, loading, quickEdit, setQuickEdit, setAlert, quickAdd, setQuickAdd } = useGlobalStore();
    const fields = useGlobalStore(selectFields(entityCode));
    const entity = useGlobalStore(selectEntity(entityCode));
    //const handleCancelQuickEditHook = useCancelRecordAction(entityCode);
    //const handleUpdateRecordQuickEditHook = useUpdateRecord(entityCode);
    //const handleAddRecordQuickModeHook = useAddRecord(entityCode);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        //if (fields) setInsertFormValid(isFormValid(fields, fieldValidity));
    }, [fieldValidity]);

    // Select a record on list
    const handleRowSelect = (idx, r) => {
        if (!quickEdit && !quickAdd) {
            setRowIndex(idx);
            setRecord(r);
        }
    }

    // Click the edit button on list row
    const handelRowEdit = (r) => {
        if (!quickEdit && !quickAdd) {
            //setShowCard(true, r, { setRecord, setRecords, records, initialRecord: r });
        }
    }

    const determineRecordData = () => {
        if (rowIndex === 0) {
            return records && records[0];
        } else {
            return record;
        }
    };

    // Click the edit button on the options controls
    const handleOptionEdit = () => {
        if (!quickEdit && records) {
            const recordData = determineRecordData();
            //setShowCard(true, recordData, { setRecord, setRecords, records, initialRecord: recordData });
        }
    }

    // Click the quick edit button on the options controls
    const handleOptionQuickEdit = () => {
        if (!quickEdit && records) {
            const recordData = determineRecordData();
            //setShowCard(false, recordData, { setRecord, setRecords, records, initialRecord: recordData });
            setQuickEdit(!quickEdit);
            setAlert({ id: uuidv4(), message: 'Quick edit mode active', type: 'info' });
        }
    }

    // Cancel the quick edit mode
    const handleCancelQuickEdit = () => {
        setQuickEdit(!quickEdit);
        //handleCancelQuickEditHook();
    }

    // Update record (row) in quick edit mode
    const handleUpdateRecordQuickEdit = () => {
        setQuickEdit(!quickEdit);
        //handleUpdateRecordQuickEditHook();
    }

    // Click the delete button on the options controls
    const deleteHandler = useDeleteRecord(pageIndex, records, determineRecordData());
    const handleDelete = () => {
        if (!quickEdit && records) {
            deleteHandler();
        }
    }

    // handle 'New' dropdown button
    const handleAddNewOption = (option) => {
        setDropdownOpen(false);

        if (option === 'list') {
            setQuickAdd(true);
            records ? setRowIndex(records.length) : setRowIndex(0);
            //setShowCard(false, [], { setRecord, setRecords, records: [], initialRecord: [], isInsert: true });
        } else if (option === 'card') {
            //setShowCard(true, [], { setRecord, setRecords, records: [], initialRecord: [], isInsert: true });
        }
    };

    // Function to update the validity of a field
    const updateFieldValidity = (fieldName, isValid) => {
        setFieldValidity((prevValidity) => ({
            ...prevValidity,
            [fieldName]: isValid,
        }));
    };

    // Cancle the quick add mode
    const handleCancelQuickAdd = () => {
        setQuickAdd(false);
        setRowIndex(0);
        //handleCancelQuickEditHook();
    }

    // Add record (row) in quick mode
    const handleQuickAddRecord = () => {
        //handleAddRecordQuickModeHook();
    }

    return (
        <>
            {fields &&
                <>
                    <div className='flex pl-4 gap-4 items-center bg-white'>
                        <span className={`font-semibold text-sm ${entity?.entityCode ? '' : 'uppercase'} `}>{entity?.caption}:</span>
                        <div className={`flex gap-4 prose-nform ${quickEdit || quickAdd ? 'prose-p:cursor-not-allowed' : 'prose-p:cursor-pointer'} prose-p:m-0 prose-p:py-1 prose-p:px-2`}>
                            <p className='hover:bg-teal-100 hover:shadow hover:ring-1 hover:ring-offset-2 hover:ring-indigo-100 transition-colors duration-200 rounded' title="Edit the selected row in card" onClick={() => !quickAdd && handleOptionEdit()}>Edit <i className="bi bi-pencil-square"></i></p>
                            <p className='hover:bg-teal-100 hover:shadow hover:ring-1 hover:ring-offset-2 hover:ring-indigo-100 transition-colors duration-200 rounded' title="Delete the selected row" onClick={() => !quickAdd && handleDelete()}>Delete <i className="fa-solid fa-trash"></i></p>
                            <p className='hover:bg-teal-100 hover:shadow hover:ring-1 hover:ring-offset-2 hover:ring-indigo-100 transition-colors duration-200 rounded' title="Quick edit the selected row in place" onClick={() => !quickAdd && handleOptionQuickEdit()}>Quick Edit <i className="fa-solid fa-list"></i></p>

                            <div className="relative inline-block text-left" ref={dropdownRef}>
                                <div>
                                    <p
                                        className='hover:bg-teal-100 hover:shadow hover:ring-1 hover:ring-offset-2 hover:ring-indigo-100 transition-colors duration-200 rounded cursor-pointer'
                                        title="Add a new record"
                                        onClick={() => (!quickEdit && !quickAdd) && setDropdownOpen(!dropdownOpen)}
                                    >
                                        New <i className="fa-solid fa-plus"></i>
                                    </p>
                                </div>
                                {dropdownOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-2xl bg-white ring-2 ring-black ring-opacity-5">
                                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                            <p
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-100 hover:text-gray-900 cursor-pointer"
                                                role="menuitem"
                                                onClick={() => handleAddNewOption('list')}
                                            >
                                                <i className="fa-solid fa-caret-right"></i> <span>Add new in List</span>
                                            </p>
                                            <p
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-100 hover:text-gray-900 cursor-pointer"
                                                role="menuitem"
                                                onClick={() => handleAddNewOption('card')}
                                            >
                                                <i className="fa-solid fa-caret-right"></i> <span>Add new in Card</span>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {(quickEdit || quickAdd) && <div className='flex gap-5 items-center'>
                                <span className='font-semibold'>: </span>
                                <i className="fa-solid fa-circle-check text-teal-600 text-2xl cursor-pointer hover:text-teal-800" title="Save changes in quick edit mode" onClick={() => quickAdd ? handleQuickAddRecord() : handleUpdateRecordQuickEdit()}>
                                </i><i className="fa-solid fa-circle-xmark text-red-600 text-2xl cursor-pointer hover:text-red-800" title="Exit quick edit mode" onClick={() => quickAdd ? handleCancelQuickAdd() : handleCancelQuickEdit()}></i>
                            </div>}
                        </div>
                    </div>
                    {
                        <div className='py-1 px-4 bg-red-100 border-b border-red-400 flex items-center text-md mx-4'>
                            <p><i className="fa-solid fa-circle-exclamation text-red-700"></i> The page has an error.</p>
                        </div>
                    }
                </>
            }
            {loading ? (
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
                            <tbody className={`[&>*:nth-child(${rowIndex + 1})]:bg-teal-100`}>
                                {records && records?.map((r, idx) => (
                                    <Fragment key={idx}>
                                        <tr key={idx} className='table-shadow' onClick={() => handleRowSelect(idx, r)}>
                                            <td style={{ whiteSpace: 'nowrap' }} className='!pl-4 !p-0 text-sm'>
                                                <span className='flex items-center relative'>
                                                    <span className='pr-2'>{(pageIndex - 1) * 10 + idx}</span>
                                                    <i style={{ cursor: `${quickEdit || quickAdd ? 'not-allowed' : 'pointer'}`, }} className="bi bi-pencil-square text-xl px-2 py-3 hover:bg-teal-100" onClick={() => handelRowEdit(r)}></i>
                                                </span>
                                            </td>
                                            {r.map((fv, rIdx) => (
                                                <td key={rIdx} className='!py-3 text-sm leading-loose' style={{ whiteSpace: 'nowrap' }}>
                                                    {
                                                        quickEdit && rowIndex === idx ? (
                                                            <FieldCore f={fv} fInfo={fields[rIdx]} fields={fields} />
                                                        ) : (
                                                            typeof (fv) === 'string' ? fv.substring(0, 80) : String(fv)
                                                        )
                                                    }
                                                </td>
                                            ))}
                                        </tr>
                                        {quickAdd && idx === records.length - 1 && (
                                            <tr key={`${idx}_extra`} className='table-shadow' onClick={() => handleRowSelect((idx + 1), [])}>
                                                <td style={{ whiteSpace: 'nowrap' }} className=' text-sm'>
                                                    <span className='pr-2'>{(pageIndex - 1) * 10 + idx + 1}</span>
                                                </td>
                                                {fields.map((f, idx) => (
                                                    <td key={idx}><AddRecordFieldCore field={f} updateFieldValidity={updateFieldValidity} fieldsProp={fields} /></td>
                                                ))}
                                            </tr>
                                        )}
                                    </Fragment>
                                ))}
                                {!records && quickAdd &&
                                    <tr className='table-shadow' onClick={() => handleRowSelect((1), [])}>
                                        <td style={{ whiteSpace: 'nowrap' }} className=' text-sm'>
                                            <span className='pr-2'>{(pageIndex - 1) * 10}</span>
                                        </td>
                                        {fields.map((f, idx) => (
                                            <td key={idx}><AddRecordFieldCore field={f} updateFieldValidity={updateFieldValidity} fieldsProp={fields} /></td>
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