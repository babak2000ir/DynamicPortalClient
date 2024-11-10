import React from 'react';
import { useGlobalStore } from '../../stores';

const ErrorModal = () => {
    const { error, setError } = useGlobalStore();

    return (
        error && <div id="delete-modal" className="w3-modal z-20" style={{ display: 'block' }}>
            <div className="w3-modal-content !w-1/3 w3-animate-zoom shadow">
                <header className="w3-container bg-red-700 text-white">
                    <h2 className='font-jost py-2'>Error</h2>
                </header>

                <div className="w3-container p-6 flex items-center gap-3">
                    <i className="fa-solid fa-circle-exclamation text-2xl"></i>
                    <p>{error}</p>
                </div>

                <footer className="pb-4 pr-3 flex gap-4 justify-end">
                    <button className="px-4 py-1 rounded bg-indigo-700 text-white hover:shadow hover:ring-2 hover:ring-offset-2 hover:ring-indigo-300 transition-colors duration-200" onClick={() => setError('')}>Close</button>
                </footer>

            </div>
        </div>

    );
}

export default ErrorModal;