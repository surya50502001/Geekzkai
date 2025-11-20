import React, { useState, useCallback, useEffect } from 'react';

const Resizable = ({ children }) => {
    // The Resizable component passes its current `width` and `height` as props to its children.
    // Children components can use these props to adjust their layout and styling dynamically
    // when the Resizable component is resized by the user.
    const [width, setWidth] = useState(250); // Initial width
    const [height, setHeight] = useState(window.innerHeight - 80); // Initial height to full screen minus some margin
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
        return () => {
            document.documentElement.style.setProperty('--sidebar-width', '0px');
        };
    }, [width]);


    return (
        <div style={{ position: 'fixed', left: 0, top: '64px', width: `${width}px`, height: `${height}px` }} className="relative">
            <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
                {React.Children.map(children, child =>
                    React.cloneElement(child, { width, height })
                )}
            </div>
            <div
                className="absolute top-0 right-0 w-2 h-full cursor-col-resize bg-transparent z-50"
                onMouseDown={startResizingWidth}
            />
            <div
                className="absolute bottom-0 left-0 right-0 h-2 cursor-row-resize bg-transparent z-50"
                onMouseDown={startResizingHeight}
            />
            <div
                className="absolute top-0 left-0 w-2 h-full cursor-col-resize bg-transparent z-50"
                onMouseDown={startResizingWidth}
            />
        </div>
    );
};

export default Resizable;
