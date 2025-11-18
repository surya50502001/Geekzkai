import { useState, useRef } from "react";

function Draggable({ children }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef(null);
    const offsetRef = useRef({ x: 0, y: 0 });

    const handleDragStart = (clientX, clientY) => {
        setIsDragging(true);
        const dragElement = dragRef.current;
        if (!dragElement) return;
        offsetRef.current = {
            x: clientX - dragElement.getBoundingClientRect().left,
            y: clientY - dragElement.getBoundingClientRect().top,
        };
    };

    const handleDragMove = (clientX, clientY) => {
        if (!isDragging) return;
        const dragElement = dragRef.current;
        if (!dragElement) return;

        const parentRect = dragElement.parentElement.getBoundingClientRect();
        const elementRect = dragElement.getBoundingClientRect();

        let newX = clientX - offsetRef.current.x;
        let newY = clientY - offsetRef.current.y;

        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX + elementRect.width > parentRect.width) newX = parentRect.width - elementRect.width;
        if (newY + elementRect.height > parentRect.height) newY = parentRect.height - elementRect.height;

        setPosition({
            x: newX,
            y: newY,
        });
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const handleMouseDown = (e) => {
        handleDragStart(e.clientX, e.clientY);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
        handleDragMove(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
        handleDragEnd();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        handleDragStart(touch.clientX, touch.clientY);
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);
    };

    const handleTouchMove = (e) => {
        const touch = e.touches[0];
        handleDragMove(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = () => {
        handleDragEnd();
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
    };

    return (
        <div
            ref={dragRef}
            style={{
                position: "absolute",
                left: position.x,
                top: position.y,
                cursor: isDragging ? "grabbing" : "grab",
                zIndex: 1000,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            {children}
        </div>
    );
}

export default Draggable;