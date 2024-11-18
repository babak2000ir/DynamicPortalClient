import React, { useEffect, useState } from 'react';

const Alert = ({ alerts, removeAlert }) => {
    useEffect(() => {
        const alertTimeout = setTimeout(() => {
            if (alerts.length > 0) {
                removeAlert(alerts[0].id);
            }
        }, 3000);
        return () => clearTimeout(alertTimeout);
    }, [alerts]);

    return (
        <div className="fixed top-16 right-0 p-4 z-[100] w-1/4">
            {alerts.map((alert, index) => (
                <div
                    key={index}
                    className={`alert-${alert.type} border-l-4 border-solid py-4 pl-4 pr-12 my-2 rounded shadow transform transition-transform duration-500`}
                >
                    <span onClick={() => removeAlert(alert.id)}
                        className="w3-button py-1 px-3 text-white w3-display-topright hover:!text-white">&times;</span>
                    <p className='font-medium text-base'>{alert.message}</p>
                </div>
            ))}
        </div>
    )
}

export const useAlert = () => {
    const [alerts, setAlerts] = useState([]);

    const setAlert = (message, type = 'error') => {
        const alert = {
            id: Math.random().toString(),
            message,
            type
        }
        setAlerts([...alerts, alert]);
    }

    const removeAlert = (id) => {
        setAlerts(alerts.filter(alert => alert.id !== id));
    }

    return { alerts, setAlert, removeAlert };
}

export const errorHandlingWrapper = async (func, setAlert) => {
    const error = await func();
    if (error)
        setAlert(`Error code: ${error.code}, error message: ${error.message}`, 'error');
}

export default Alert;