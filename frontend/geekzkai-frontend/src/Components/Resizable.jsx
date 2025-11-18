import React, { useState, useCallback, useEffect } from 'react';

const Resizable = ({ children }) => {
    const [width, setWidth] = useState(250); // Initial width
    const [height, setHeight] = useState(500); // Initial height
    const [isResizingWidth, setIsResizingWidth] = useState(false);
    const [isResizingHeight, setIsResizingHeight] = useState(false);

    const startResizingWidth = useCallback((e) => {
        e.preventDefault();
        setIsResizingWidth(true);
    }, []);

    const startResizingHeight = useCallback((e) => {
        e.preventDefault();
        setIsResizingHeight(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizingWidth(false);
        setIsResizingHeight(false);
    }, []);

    const resize = useCallback(
        (e) => {
            if (isResizingWidth) {
                const newWidth = e.clientX;
                if (newWidth > 150 && newWidth < 500) { // Min and max width
                    setWidth(newWidth);
                }
            }
            if (isResizingHeight) {
                const newHeight = e.clientY;
                if (newHeight > 300 && newHeight < 800) { // Min and max height
                    setHeight(newHeight);
                }
            }
        },
        [isResizingWidth, isResizingHeight]
    );

    useEffect(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);

        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [resize, stopResizing]);

    useEffect(() => {
        document.documentElement.style.setProperty('--sidebar-width', `${width}px`);
    }, [width]);


    return (
        <div style={{ width: `${width}px`, height: `${height}px` }} className="relative">
            {children}
            <div
                className="absolute top-0 right-0 w-2 h-full cursor-col-resize bg-transparent"
                onMouseDown={startResizingWidth}
            />
            <div
                className="absolute bottom-0 left-0 right-0 h-2 cursor-row-resize bg-transparent"
                onMouseDown={startResizingHeight}
            />
            <div
                className="absolute top-0 left-0 w-2 h-full cursor-col-resize bg-transparent"
                onMouseDown={startResizingWidth}
            />
        </div>
    );
};

export default Resizable;
