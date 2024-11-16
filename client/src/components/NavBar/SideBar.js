import React from 'react';
import { useGlobalStore } from '../../stores';

const Sidebar = () => {
    const { entitiesLoading, pagesLoaded, pages, selectedPage, setSelectedPage } = useGlobalStore()

    const pagesClickHandler = (page) => {
        setSelectedPage(page.id);
    }

    return (
        <div className="h-full overflow-auto lg:fixed w3-bar-block border-2 w3-animate-left block w-full lg:w-1/4 xl:w-1/6 z-0 pt-20 lg:pt-6 bg-white" id="sidebar">
            <div className="w3-container">
                <ul className="prose-nform prose-li:bg-gray-100 prose-li:font-medium prose-li:cursor-pointer prose-li:text-center prose-li flex flex-col gap-2">
                    {!entitiesLoading &&
                        pages.map((page, idx) =>
                            <li key={idx}>
                                <button className={`hover:bg-indigo-700 hover:text-white hover:ring-1 hover:ring-offset-2 hover:ring-indigo-200 transition-colors duration-200 rounded w-full h-full py-2 ${selectedPage === page.id ? 'bg-indigo-700 text-white' : ''}`}
                                    onClick={() => pagesClickHandler(page)}>
                                    {page.title || `${page.entity} ${page.type}` || page.id}
                                </button>
                            </li>
                        )}
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
