import React, { useState } from 'react';
import { useGlobalStore } from '../../stores';

const Sidebar = () => {
    const [activeEntity, setActiveEntity] = useState(null);
    const { showSidebar, setShowSidebar, loadPage, setLoading, loadedPage, setPageIndex, quickEdit, quickAdd, entities } = useGlobalStore(state => ({
        showSidebar: state.showSidebar,
        setShowSidebar: state.setShowSidebar,
        loadPage: state.loadPage,
        setLoading: state.setLoading,
        loadedPage: state.loadedPage,
        setPageIndex: state.setPageIndex,
        quickEdit: state.quickEdit,
        quickAdd: state.quickAdd,
        entities: state.entities?.filter(entity => entity.entityCode !== ''),
    }));

    const closeSideBarClickHandler = () => {
        setShowSidebar(false);
    }

    const tableExplorerClickHandler = () => {
        loadPage('TableExplorer');
        setLoading(true);
        setPageIndex(1);
        setActiveEntity(null);
    }

    const entitiesClickHandler = (entity) => {
        loadPage('EntityPage', { entityCode: entity.entityCode });
        setLoading(true);
        setPageIndex(1);
        setActiveEntity(entity.entityCode);
    }

    return (
        <>
            {showSidebar && <div className="h-full overflow-auto lg:fixed w3-bar-block border-2 w3-animate-left block w-full lg:w-1/4 xl:w-1/6 z-0 pt-20 lg:pt-6 bg-white" id="sidebar">
                <div className="w3-container">
                    <ul className="prose-nform prose-li:bg-gray-100 prose-li:font-medium prose-li:cursor-pointer prose-li:text-center prose-li flex flex-col gap-2">
                        <li><button className={`hover:bg-indigo-700 hover:text-white hover:ring-1 hover:ring-offset-2 hover:ring-indigo-200 transition-colors duration-200 rounded w-full h-full py-2 ${loadedPage === 'TableExplorer' ? '!bg-indigo-700 text-white' : ''} ${quickEdit || quickAdd ? 'cursor-not-allowed' : ''}`} disabled={loadedPage === 'TableExplorer' || quickEdit || quickAdd} onClick={() => tableExplorerClickHandler()}>Tables Explorer</button></li>
                        {entities && entities.map((entity, idx) =>
                            <li key={idx}>
                                <button className={`hover:bg-indigo-700 hover:text-white hover:ring-1 hover:ring-offset-2 hover:ring-indigo-200 transition-colors duration-200 rounded w-full h-full py-2 ${activeEntity === entity.entityCode ? 'bg-indigo-700 text-white' : ''} ${loadedPage === entity.entityCode || quickEdit || quickAdd ? 'cursor-not-allowed' : ''}`} disabled={activeEntity === entity.entityCode || quickEdit || quickAdd} onClick={() => entitiesClickHandler(entity)}>
                                    {entity.caption || entity.name || entity.entityCode}
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>}
        </>
    );
}

export default Sidebar;
