import React, { useState } from 'react';
import { login } from '../../services/authSvc';
import { useGlobalStore } from '../../stores';
import ErrorModal from '../Modal/ErrorModal';
import DOMPurify from 'dompurify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { loadUser, setError } = useGlobalStore();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const sanitizedEmail = DOMPurify.sanitize(email);
        const sanitizedPassword = DOMPurify.sanitize(password);

        if (!sanitizedEmail || !sanitizedPassword) {
            setError('Invalid input');
            return;
        }

        const response = await login(sanitizedEmail, sanitizedPassword);

        if (response) {
            loadUser();
        }
    };

    return (
        <>
            <ErrorModal />
            <section className='max-w-8xl mx-auto'>
                <div className='px-5 flex justify-center items-center h-screen'>
                    <div className="lg:w-1/2 border rounded bg-white shadow">
                        <h2 className="text-2xl text-center py-2 text-white font-jost font-semibold bg-teal-700">Login</h2>
                        <div className='p-8'>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        required
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
                                <div className="mt-12">
                                    <button
                                        type="submit"
                                        className="w-full bg-teal-600 hover:bg-teal-400 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                            <p className='mt-6 italic'>Don't have an account? Contact the administrator</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Login;