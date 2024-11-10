import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

const Footer = () => {
    const [year, setYear] = useState(null);

    useEffect(() => {
        const date = new Date();
        setYear(date.getFullYear());
    }, []);

    return (
        <footer className=" text-white fixed bottom-0 w-full">
            <div className="bg-indigo-800 py-3 hidden xl:block">
                <div className='max-w-7xl mx-auto grid grid-cols-2 px-4'>
                    <div className='flex justify-start flex-col gap-3'>
                        <img src={logo} alt="Logo" width="25" height="25" className="d-inline-block align-text-top" />
                        <p>© PortalPOC {year}</p>
                    </div>
                    <div className="flex justify-end items-center">
                        <ul className='flex gap-2 flex-col'>
                            <li><p>Developed and maintained by the <a className='font-bold underline italic' href="https://github.com/TheNAVPeople/web_prototype_nFormPOC/" target="_blank" rel="noreferrer">Web Team</a></p></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='bg-indigo-950 py-2'>
                <div className='max-w-7xl mx-auto px-4 flex justify-between xl:justify-center'>
                    <ul className="flex justify-center items-center gap-3">
                        <li className='xl:hidden'><p>© PortalPOC {year}</p></li>
                        <li><a href="https://github.com/TheNAVPeople/web_prototype_nFormPOC/" target="_blank" rel="noreferrer"><i className="fa-brands fa-github"></i></a></li>
                        <li><a href='https://www.the365people.com/contact' target='blank' rel='noreferrer'><i className="fa-solid fa-earth-americas"></i></a></li>
                    </ul>
                    <div className="flex justify-end items-center xl:hidden">
                        <ul className='flex gap-2 flex-col'>
                            <li><p>Developed and maintained by the <a className='font-bold underline italic' href="https://github.com/TheNAVPeople/web_prototype_nFormPOC/" target="_blank" rel="noreferrer">Web Team</a></p></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;