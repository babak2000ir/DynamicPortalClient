import dash from '../assets/dash.gif';

export const ActionSection = () => {
    return (
        <div className='max-w-7xl mx-auto flex justify-center items-center mt-8'>
            <div className='prose-nform prose-h1:mb-5 prose-p:m-0 prose-p:text-2xl text-center text-gray-500'>
                <h1>Portal POC</h1>
                <p>Select a table or entity to begin</p>
            </div>
        </div>
    );
}

export const MainSection = () => {
    return (
        <div className='max-w-7xl mx-auto flex justify-center items-center'>
            <div className="">
                <img src={dash} alt="dash" />
            </div>
        </div>
    );
}