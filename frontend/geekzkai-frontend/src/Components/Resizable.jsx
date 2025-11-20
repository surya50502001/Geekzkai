import React, { useState, useRef, useEffect } from 'react';

const Resizable = ({ children, minWidth = 0, maxWidth }) => {
    const [width, setWidth] = useState(300);
    const [isResizing, setIsResizing] = useState(false);
    const resizableRef = useRef(null);

    const handleMouseDown = (e) => {
        setIsResizing(true);
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        if (!isResizing) return;
        const newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX - resizableRef.current.getBoundingClientRect().left));
        setWidth(newWidth);
        document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    useEffect(() => {
        if (window.innerWidth >= 768) {
            document.documentElement.style.setProperty('--sidebar-width', `${width}px`);
        }
    }, [width]);

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    return (
        <div
            ref={resizableRef}
            style={{ width: `${width}px` }}
            className="fixed left-0 top-0 h-full bg-background-secondary border-r border-border-primary z-30 hidden md:block"
        >
            {children}
            <div
                onMouseDown={handleMouseDown}
                className="absolute right-0 top-0 h-full w-2 bg-transparent cursor-col-resize hover:bg-primary/20 transition-colors flex items-center justify-center z-50"
            >
                <div className="w-0.5 h-8 bg-border-primary rounded-full opacity-50 hover:opacity-100 transition-opacity" />
            </div>
        </div>
    );
};

export default Resizable;
