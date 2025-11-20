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


function PrivateRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
}
function App() {
    return (
        <Router>
            <div className="min-h-screen bg-background-primary text-text-primary transition-colors duration-500">
                <Navbar />
                <Sidebar />
                <main className="transition-all duration-300" style={{ marginLeft: 'var(--sidebar-width)' }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App
