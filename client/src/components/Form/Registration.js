import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUserPassword } from '../../services/authSvc';
import { useGlobalStore } from '../../stores';
import ErrorModal from '../Modal/ErrorModal';
import { useQuery } from '../../helpers';
import { caesarDecrypt } from '../../helpers';
import DOMPurify from 'dompurify';

const Registration = () => {
    const query = useQuery();
    const data = query.get('data') || '';
    const [userInfo, setUserInfo] = useState({ userId: '', email: '', firstname: '', lastname: '' });
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showCompletion, setShowCompletion] = useState(false);
    const { setError } = useGlobalStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            const base64Decoded = atob(data);
            const userInfoDecrypt = caesarDecrypt(base64Decoded, 3);
            if (userInfoDecrypt) {
                const userInfoParts = userInfoDecrypt.split('&');
                setUserInfo({
                    userId: userInfoParts[0],
                    email: userInfoParts[1],
                    firstname: userInfoParts[2],
                    lastname: userInfoParts[3]
                });
            } else {
                setError('Invalid registration link.');
            }
        }
    }, [data]);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const sanitizedPassword = DOMPurify.sanitize(password);
        const sanitizedConfirmPassword = DOMPurify.sanitize(confirmPassword);

        // Password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
        if (!passwordRegex.test(sanitizedPassword)) {
            setError('Password must be at least 7 characters long, include at least one uppercase letter, one number, and one special character.');
            return;
        }

        if (sanitizedPassword !== sanitizedConfirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await setUserPassword(userInfo.userId, sanitizedPassword);

            if (response) setShowCompletion(true);
        } catch (error) {
            setError('An error occurred while setting the password.');
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <>
            <ErrorModal />

            <section className='max-w-8xl mx-auto'>
                <div className='px-5 flex justify-center items-center h-screen'>
                    <div className="lg:w-1/2 border rounded bg-white shadow">
                        <h2 className="text-2xl text-center py-2 text-white font-jost font-semibold bg-teal-700">Complete Registration</h2>
                        {showCompletion ? (
                            <div className='p-8 flex items-center justify-center flex-col'>
                                <p>Your registration is now complete. Please click the button below to log into your account.</p>
                                <div className="mt-8">
                                    <button onClick={handleLoginClick} className="bg-teal-600 hover:bg-teal-400 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300">
                                        Login
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className='p-8'>
                                <p className='pb-4'>Please provide a password to complete your account registration.</p>
                                <form onSubmit={handleSubmit}>
                                    <div className='grid md:grid-cols-2 md:gap-x-5'>
                                        <div className="mb-4">
                                            <label className="block text-sm font-semibold text-gray-700">User ID</label>
                                            <input
                                                type="text"
                                                value={userInfo.userId}
                                                disabled
                                                className="block w-full border rounded py-2 px-3 text-gray-700 mt-1 focus:outline-none focus:border-teal-400 focus:border"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-semibold text-gray-700">User Email</label>
                                            <input
                                                type="email"
                                                value={userInfo.email}
                                                disabled
                                                className="block w-full border rounded py-2 px-3 text-gray-700 mt-1 focus:outline-none focus:border-teal-400 focus:border"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-semibold text-gray-700">First Name</label>
                                            <input
                                                type="text"
                                                value={userInfo.firstname}
                                                disabled
                                                className="block w-full border rounded py-2 px-3 text-gray-700 mt-1 focus:outline-none focus:border-teal-400 focus:border"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-semibold text-gray-700">Last Name</label>
                                            <input
                                                type="text"
                                                value={userInfo.lastname}
                                                disabled
                                                className="block w-full border rounded py-2 px-3 text-gray-700 mt-1 focus:outline-none focus:border-teal-400 focus:border"
                                            />
                                        </div>
                                        <div className="mb-4 relative">
                                            <label className="block text-sm font-semibold text-gray-700">Password</label>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={handlePasswordChange}
                                                required
                                                className="block w-full border rounded py-2 px-3 text-gray-700 mt-1 focus:outline-none focus:border-teal-400 focus:border"
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className="absolute right-3 top-8 text-gray-600 focus:outline-none"
                                            >
                                                {showPassword ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                        <div className="mb-4 relative">
                                            <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                                            <input
                                                type='password'
                                                value={confirmPassword}
                                                onChange={handleConfirmPasswordChange}
                                                required
                                                className="block w-full border rounded py-2 px-3 text-gray-700 mt-1 focus:outline-none focus:border-teal-400 focus:border"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-12">
                                        <button
                                            type="submit"
                                            className="w-full bg-teal-600 hover:bg-teal-400 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                                <p className='mt-6 italic'>Having trouble with the registration form? Contact the administrator</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Registration;
