import { useGlobalStore } from '../stores';
import { setUserAuthToken } from '../helpers';

export const login = async (email, password) => {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        const data = await response.json();

        if (data.token) {
            localStorage.setItem('userAuthToken', data.token);
        }

        return data;
    } catch (error) {
        const errObj = JSON.parse(error.message);
        useGlobalStore.setState({ error: (errObj.code && `${errObj.code}: ` + errObj.message) || JSON.stringify(errObj) });
    }
}

export const loadUser = async () => {
    if (localStorage.userAuthToken) {
        setUserAuthToken(localStorage.userAuthToken);
        try {

            const response = await fetch('/loadUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({ token: localStorage.userAuthToken })
            });

            if (!response.ok) {
                const error = await response.text();
                localStorage.removeItem('userAuthToken');
                throw new Error(error);
            }

            const user = await response.json();

            useGlobalStore.setState({ authenticated: true, user });

        } catch (error) {
            const errObj = JSON.parse(error.message);
            useGlobalStore.setState({ error: (errObj.code && `${errObj.code}: ` + errObj.message) || JSON.stringify(errObj) });
            localStorage.removeItem('userAuthToken');
        }
    } else {
        useGlobalStore.setState({ authenticated: false });
    }
}

export const setUserPassword = async (userId, password) => {
    try {
        const response = await fetch('/setPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({ userId, password })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        return await response.json();
    } catch (error) {
        const errObj = JSON.parse(error.message);
        useGlobalStore.setState({ error: (errObj.code && `${errObj.code}: ` + errObj.message) || JSON.stringify(errObj) });
    }
}