import { HashRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./Components/Navbar"
import Home from "./Pages/Home"
import Login from "./Components/Login";
import Register from "./Components/Register";
import Trending from "./Pages/Trending";
import CreatePost from "./Pages/CreatePost";
import CreateRoom from "./Pages/CreateRoom";
import Room from "./Pages/Room";
import Rooms from "./Pages/Rooms";
import Chat from "./Pages/Chat";

import { Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";
import { useEffect } from "react";
import Settings from "./Pages/Settings";
import Profile from "./Pages/Profile";

import Search from "./Pages/Search";
import UserProfile from "./Pages/UserProfile";
import Create from "./Pages/Create";
import PostDetail from "./Pages/PostDetail";
import FollowersPage from "./Pages/FollowersPage";
import EditProfile from "./Pages/EditProfile";
import FollowRequests from "./Pages/FollowRequests";
import Sidebar from "./Components/Sidebar";
import AuthCallback from "./Pages/AuthCallback";




function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }
    
    return user ? children : <Navigate to="/login" />;
}
function App() {
    const { setUser } = useAuth();

    useEffect(() => {
        const hash = window.location.hash;
        if (hash.startsWith('#token=')) {
            const hashParams = new URLSearchParams(hash.substring(1));
            const token = hashParams.get('token');
            const tour = hashParams.get('tour');
            
            if (token) {
                localStorage.setItem('token', token);
                
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    const decodedToken = JSON.parse(jsonPayload);
                    
                    const user = {
                        id: decodedToken.id,
                        email: decodedToken.email,
                        username: decodedToken.username,
                    };
                    setUser(user);
                    
                    // Redirect to profile with tour parameter if needed
                    const redirectUrl = tour === 'true' ? '/profile?tour=true' : '/profile';
                    window.location.hash = '';
                    window.history.replaceState(null, null, redirectUrl);
                } catch (error) {
                    console.error('Token processing error:', error);
                }
            }
        }
    }, [setUser]);

    return (
        <div className="min-h-screen transition-colors duration-300" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
            <Router>
                <Navbar />
                <div className="hidden md:block">
                    <Sidebar />
                </div>
                <main className="md:ml-[var(--sidebar-width,0px)] pb-16 md:pb-0">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="/create" element={<PrivateRoute><Create /></PrivateRoute>} />
                        <Route path="/create/post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
                        <Route path="/create/room" element={<PrivateRoute><CreateRoom /></PrivateRoute>} />
                        <Route path="/rooms" element={<PrivateRoute><Rooms /></PrivateRoute>} />
                        <Route path="/room/:id" element={<PrivateRoute><Room /></PrivateRoute>} />
                        <Route path="/create/live" element={<PrivateRoute><div className="p-8 text-center" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>Go Live - Coming Soon</div></PrivateRoute>} />
                        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
                        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                        <Route path="/profile/edit" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
                        <Route path="/follow-requests" element={<PrivateRoute><FollowRequests /></PrivateRoute>} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/user/:id" element={<UserProfile />} />
                        <Route path="/user/:userId/:type" element={<FollowersPage />} />
                        <Route path="/post/:id" element={<PostDetail />} />
                        <Route path="/trending" element={<Trending /> } />
                        <Route path="/auth/callback" element={<AuthCallback />} />
                    </Routes>
                </main>
            </Router>
        </div>
    )
}

export default App
