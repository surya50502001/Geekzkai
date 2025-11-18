import React, { useState, useEffect } from 'react';
import TopNavbar from "./TopNavbar";
import BottomNavbar from "./BottomNavbar";
import Draggable from './Draggable';

export default function Navbar() {
    const [isDraggable, setIsDraggable] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <TopNavbar isDraggable={isDraggable} setIsDraggable={setIsDraggable} />
            {isDraggable && !isMobile && <div className="md:w-48" />}
            {isDraggable ? (
                <Draggable>
                    <BottomNavbar />
                </Draggable>
            ) : (
                <BottomNavbar />
            )}
        </>
    );
}
