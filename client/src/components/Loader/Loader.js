import React from 'react';

const Loader = ({ showRelatedTable }) => {
    return (
        <div className={`flex justify-center items-center ${showRelatedTable ? 'h-max' : 'h-screen'}`}>
            <div className="animate-spin rounded-full border-t-4 border-teal-500  border-solid h-12 w-12"></div>
        </div>
    );
};

export default Loader;