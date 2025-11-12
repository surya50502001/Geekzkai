import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./components/Login";
import Register from "./Components/Register";

import { Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";
import Profile from "./pages/profile";


function PrivateRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
}
function App() {
    return (
        <Router>
            <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-500">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register  />} />
                    <Route path="/profile" element={<PrivateRoute><Profile />  </PrivateRoute>} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
