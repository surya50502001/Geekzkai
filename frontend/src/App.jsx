import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./Components/Navbar"
import Home from "./Pages/Home"
import Login from "./Components/Login";
import Register from "./Components/Register";

import { Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";
import Settings from "./Pages/Settings";
import Profile from "./Pages/Profile";
import CreatePostPage from "./Pages/CreatePostPage";
import Sidebar from "./Components/Sidebar";


function PrivateRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
}
function App() {
    return (
        <Router>
        <div className="min-h-screen text-text-primary transition-colors duration-500" style={{ background: 'var(--background-primary)' }}>
                <Navbar />
                <div className="hidden md:block">
                    <Sidebar />
                </div>
                <main className="md:ml-[var(--sidebar-width,0px)]">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/create" element={<PrivateRoute><CreatePostPage /></PrivateRoute>} />
                        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App
