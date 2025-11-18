import React, { useState } from 'react';
import TopNavbar from "./TopNavbar";
import BottomNavbar from "./BottomNavbar";
import Draggable from './Draggable';

export default function Navbar() {
    const [isDraggable, setIsDraggable] = useState(false);

    return (
        <>
            <TopNavbar isDraggable={isDraggable} setIsDraggable={setIsDraggable} />
            {isDraggable && <div className="md:w-48" />}
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
