import { create } from 'zustand';
import { useGlobalStore, selectFields } from '../stores';
import { List } from './List/List';
import { Card } from './Card/Card';

const useLocalStore = create((set) => ({
    selectedTableNo: 0,
    setSelectedTableNo: (selectedTableNo) => set({ selectedTableNo }),
}));

export const ActionSection = () => {
    const { entities: tables, setRowIndex, setLoading, setPageIndex, quickEdit, quickAdd } = useGlobalStore();
    const { selectedTableNo, setSelectedTableNo } = useLocalStore();

    const handleOnChange = (e) => {
        setLoading(true);
        setSelectedTableNo(e.target.value);
        setRowIndex(0);
        setPageIndex(1);
    }

    return (
        <select className="prose-nform max-w-full table-dropdown bg-white rounded-md py-2 px-0 w-full border-b-2 border-teal-400" name="option" value={selectedTableNo} onChange={e => handleOnChange(e)}>
            {tables && <option value="0" disabled className='font-medium text-lg'>Choose a table</option>}
            {tables && tables.map((t, idx) => <option key={idx} value={t.entityCode || t.id} disabled={quickEdit || quickAdd}>{t.entityCode || t.id} {t.caption}</option>)}
        </select>
    );
}

export const MainSection = () => {
    const setSelectedTableNo = useLocalStore(state => state.setSelectedTableNo);
    const selectedTableNo = useLocalStore(state => state.selectedTableNo);
    const { entities, setRowIndex, setLoading, setPageIndex, quickEdit, quickAdd } = useGlobalStore();
    const fields = useGlobalStore(selectFields(selectedTableNo));

    const relationTableNoHandler = (f) => {
        if (!quickEdit && !quickAdd) {
            setSelectedTableNo(f.relationTableNo);
            setLoading(true);
            setRowIndex(0);
            setPageIndex(1);
        }
    }

    return (
        <>
            <div className='w3-col m9 lg:sticky top-28'>
                <List selectedEntityCode={selectedTableNo} />
            </div>
            <Card selectedEntityCode={selectedTableNo} />
            <div className="w3-col m3 shadow pr-4 mb-[115px]">
                <ul className="w3-ul w3-card">
                    {fields?.map(f =>
                        <li
                            key={f.id}
                            className={`w3-bar ${f.partOfPrimaryKey ? ' bg-indigo-700 text-white' : 'w3-white'}`}
                        >
                            <div className="w3-row">
                                <div className="w3-bar-item">
                                    <span className="w3-small">{f.id}: {f.name}</span>
                                </div>
                                <span className="w3-bar-item w3-right w3-small">
                                    {f.type}[{f.length}]
                                </span>
                            </div>
                            {f.relationTableNo &&
                                <div className="w3-row">
                                    <span className={`w3-bar-item w3-tag w3-aqua w3-right w3-tiny w3-button ${quickEdit || quickAdd ? 'cursor-not-allowed' : ''}`} onClick={() => relationTableNoHandler(f)}>
                                        →{entities?.find(t => t.id === f.relationTableNo)?.name || f.relationTableNo}
                                    </span>
                                </div>
                            }
                        </li>
                    )}
                </ul>
            </div>
        </>
    );
}