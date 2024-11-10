import React from 'react';

const SearchLoader = () => {
    return (
        <div className='flex justify-center items-center absolute right-[6px] top-[5px]'>
            <div className="animate-spin rounded-full border-t-4 border-teal-500 border-solid h-5 w-5"></div>
        </div>
    );
}

export default SearchLoader