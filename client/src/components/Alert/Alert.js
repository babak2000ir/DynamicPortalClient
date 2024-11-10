import React, { useEffect } from 'react';
import { useGlobalStore } from '../../stores';

const Alert = () => {

    const { alerts, removeAlert } = useGlobalStore();

    const removeAlertHandler = (id) => {
        removeAlert(id);
    }

    useEffect(() => {
        const alertTimeout = setTimeout(() => {
            if (alerts.length > 0) {
                removeAlertHandler(alerts[0].id);
            }
        }, 3000);
        return () => clearTimeout(alertTimeout);
    }, [alerts, removeAlertHandler]);

    return (
        <div className="fixed top-16 right-0 p-4 z-[100] w-1/4">
            {alerts.map((alert, index) => (
                <div
                    key={alert.id}
                    className={`alert-${alert.type} border-l-4 border-solid py-4 pl-4 pr-12 my-2 rounded shadow transform transition-transform duration-500`}
                >
                    <span onClick={() => removeAlertHandler(alert.id)}
                        className="w3-button py-1 px-3 text-white w3-display-topright hover:!text-white">&times;</span>
                    <p className='font-medium text-base'>{alert.message}</p>
                </div>
            ))}
        </div>
    )
}

export default Alert;