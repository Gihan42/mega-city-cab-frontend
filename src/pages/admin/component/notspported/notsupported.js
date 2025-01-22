import React, { useEffect, useState } from 'react';

function NotSupported() {
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        const checkScreenSize = () => {
            if (window.innerWidth < 768) {
                setIsSupported(false);
            } else {
                setIsSupported(true);
            }
        };

        checkScreenSize();

        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    return (
        <>
            {isSupported ? (
                <div>
                    <h1>Oops!</h1>
                </div>
            ) : (
                <div className="not-supported-container">
                    <h1>Page Not Supported</h1>
                    <p>This page is not supported on your device or screen size.</p>
                    <p>Please access it on a larger screen or supported device.</p>
                </div>
            )}
        </>
    );
}

export default NotSupported;
