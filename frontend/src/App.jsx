import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./Components/Navbar"
import Home from "./Pages/Home"
import Login from "./Components/Login";
import Register from "./Components/Register";
import Trending from "./Pages/Trending";

import { Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";
import Settings from "./Pages/Settings";
import Profile from "./Pages/Profile";
import CreatePostPage from "./Pages/CreatePostPage";
import Sidebar from "./Components/Sidebar";




function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }
    
    return user ? children : <Navigate to="/login" />;
}
function App() {
    return (
        <div className="min-h-screen transition-colors duration-300" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
            <Router>
                <Navbar />
                <div className="hidden md:block">
                    <Sidebar />
                </div>
                <main className="md:ml-[var(--sidebar-width,0px)] pb-20 md:pb-0">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/create" element={<PrivateRoute><CreatePostPage /></PrivateRoute>} />
                        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                        <Route path="/trending" element={<Trending /> } />
                    </Routes>
                </main>
            </Router>
        </div>
    )
}

export default App
