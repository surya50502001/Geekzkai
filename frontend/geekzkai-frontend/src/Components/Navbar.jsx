﻿import React, { useState, useEffect } from 'react';
import TopNavbar from "./TopNavbar";
import BottomNavbar from "./BottomNavbar";
import Sidebar from "./Sidebar";

export default function Navbar() {
    return (
        <>
            <Sidebar />
            <TopNavbar />
            <BottomNavbar />
        </>
    );
}
