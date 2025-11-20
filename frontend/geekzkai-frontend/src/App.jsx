import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./Components/Navbar"
import Home from "./Pages/Home"
import Login from "./Components/Login";
import Register from "./Components/Register";

import { Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";
import Settings from "./Pages/Settings";
import Profile from "./Pages/Profile";
import Sidebar from "./Components/Sidebar";
import { ThemeProvider } from "./Context/ThemeContext";
import CreatePostModal from "./Components/CreatePostModal";
import { useState, useEffect } from "react";


function PrivateRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
}
function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        const handleOpenModal = () => openModal();
        window.addEventListener('openCreateModal', handleOpenModal);
        return () => window.removeEventListener('openCreateModal', handleOpenModal);
    }, []);

    return (
        <ThemeProvider>
            <Router>
            <div className="min-h-screen text-text-primary transition-colors duration-500" style={{ background: 'var(--background-primary)' }}>
                    <Navbar />
                    <Sidebar openModal={openModal} />
                    <main style={{ marginLeft: 'var(--sidebar-width, 0px)' }}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                        </Routes>
                    </main>
                    <CreatePostModal isOpen={isModalOpen} onClose={closeModal} />
                </div>
            </Router>
        </ThemeProvider>
    )
}

export default App
