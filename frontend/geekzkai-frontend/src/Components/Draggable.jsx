import { useState, useRef } from "react";

function Draggable({ children }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef(null);
    const offsetRef = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        setIsDragging(true);
        const dragElement = dragRef.current;
        offsetRef.current = {
            x: e.clientX - dragElement.getBoundingClientRect().left,
            y: e.clientY - dragElement.getBoundingClientRect().top,
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
        const dragElement = dragRef.current;
        if (!dragElement) return;

        const parentRect = dragElement.parentElement.getBoundingClientRect();
        const elementRect = dragElement.getBoundingClientRect();

        let newX = e.clientX - offsetRef.current.x;
        let newY = e.clientY - offsetRef.current.y;

        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX + elementRect.width > parentRect.width) newX = parentRect.width - elementRect.width;
        if (newY + elementRect.height > parentRect.height) newY = parentRect.height - elementRect.height;

        setPosition({
            x: newX,
            y: newY,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
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
        >
            {children}
        </div>
    );
}

export default Draggable;