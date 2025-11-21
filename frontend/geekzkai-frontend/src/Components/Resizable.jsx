import React, { useState, useRef, useEffect, useCallback } from "react";

const Resizable = ({ children, minWidth = 80, maxWidth = 400 }) => {
    const [width, setWidth] = useState(260);
    const isResizing = useRef(false);
    const containerRef = useRef(null);

    const handleMouseDown = (e) => {
        isResizing.current = true;
        e.preventDefault();
    };

    const handleMouseMove = useCallback(
        (e) => {
            if (!isResizing.current) return;

            let newWidth = e.clientX;

            // Boundaries
            if (newWidth < minWidth) newWidth = minWidth;
            if (newWidth > maxWidth) newWidth = maxWidth;

            setWidth(newWidth);
        },
        [minWidth, maxWidth]
    );

    const handleMouseUp = useCallback(() => {
        isResizing.current = false;
    }, []);

    useEffect(() => {
        document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
    }, [width]);

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    return (
        <div
            ref={containerRef}
            style={{ width }}
            className="
                fixed left-0 top-0 
                h-full 
                bg-background-secondary 
                border-r border-border-primary
                z-30 hidden md:block 
                overflow-hidden 
                transition-[width] duration-150
            "
        >
            {children(width)}

            {/* Resize handle */}
            <div
                onMouseDown={handleMouseDown}
                className="
                    absolute right-0 top-0 
                    h-full w-[6px] 
                    cursor-col-resize 
                    bg-transparent 
                    hover:bg-primary/20 
                    flex items-center justify-center
                "
            >
                <div className="w-[2px] h-10 bg-border-primary rounded-full opacity-60"></div>
            </div>
        </div>
    );
};

export default Resizable;
