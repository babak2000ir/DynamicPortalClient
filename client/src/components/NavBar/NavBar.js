import { useState, useEffect, useRef } from 'react';
import { useGlobalStore } from '../../stores';
import { setUserAuthToken } from '../../helpers';

const NavBar = () => {
    const { showSidebar, setShowSidebar, authenticated, user } = useGlobalStore();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    const handleLogout = () => {
        setDropdownOpen(false);
        localStorage.removeItem('userAuthToken');
        setUserAuthToken(null);
        useGlobalStore.setState({ authenticated: false, user: null });
        window.location.reload();
    }

    return (
        <nav className='fixed top-0 w-full h-14 z-50'>
            <div className={`w3-row bg-teal-700 h-[52px] ${!authenticated ? 'flex items-center' : ''}`}>
                {!authenticated &&
                    <div id='title' className="w3-container inline-block prose-nform prose-p:text-xl prose-p:text-white prose-p:m-0 prose-p:p-0">
                        <p className='font-semibold'>Portal POC</p>
                    </div>
                }
                {authenticated &&
                    <div className="flex justify-between items-center pr-5">
                        <div>
                            <button id="openNav" className="w3-button bg-teal-600 text-white w3-xlarge" onClick={() => setShowSidebar(!showSidebar)} >{showSidebar ? <i className="fa-solid fa-angles-left"></i> : <span>&#9776;</span>}</button>
                            <div id='title' className="w3-container inline-block prose-nform prose-p:text-xl prose-p:text-white prose-p:m-0 prose-p:p-0">
                                <p className='font-semibold'>Portal POC</p>
                            </div>
                        </div>
                        <div className="relative inline-block text-left" ref={dropdownRef}>
                            <div
                                className="bg-gray-50 rounded-full h-7 w-7 flex items-center justify-center cursor-pointer hover:bg-teal-300"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            ><i className="fa-solid fa-user"></i></div>

                            {dropdownOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-2xl bg-white ring-2 ring-black ring-opacity-5">
                                    <ul className="py-1 divide-y overflow-hidden" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                        <li
                                            className="gap-2 px-4 py-2 text-sm text-gray-700 text-wrap"
                                            role="menuitem"
                                        >
                                            <p className='font-medium uppercase text-xs'>Account</p>
                                            <div className='flex flex-col py-1'>
                                                <span className='font-medium text-sm'>{user.firstname} {user.lastname}</span>
                                                <span className='flex items-center gap-2 text-sm'><i className="fa-regular fa-envelope"></i>{user.username}</span>
                                            </div>
                                        </li>
                                        <li
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-100 hover:text-gray-900 cursor-pointer"
                                            role="menuitem"
                                            onClick={() => handleLogout()}
                                        >
                                            <i className="fa-solid fa-arrow-right-from-bracket"></i> <span>Sign out</span>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                }
            </div>
        </nav>
    );
}

export default NavBar;