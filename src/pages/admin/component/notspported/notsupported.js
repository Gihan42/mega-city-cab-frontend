import React, { useEffect, useState } from 'react';

function NotSupported() {
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSupported(window.innerWidth > 1030);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <div className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Page Not Supported</h1>
            <p className="text-lg mb-2">This page is not supported on your device or screen size.</p>
            <p className="text-lg">Please access it on a screen wider than 1030px.</p>
        </div>
    );
}

export default NotSupported;