import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

// Basic JWT decoder
function jwtDecode(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Invalid token:", e);
        return null;
    }
}


function AuthCallback() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('message');

        if (error) {
            console.error('OAuth error:', error);
            navigate('/login?error=' + encodeURIComponent(error));
            return;
        }

        if (token) {
            try {
                localStorage.setItem('token', token);
                const decodedToken = jwtDecode(token);
                if (decodedToken) {
                    const user = {
                        id: decodedToken.id || decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
                        email: decodedToken.email || decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
                        username: decodedToken.username || decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
                    };
                    setUser(user);
                    console.log('Token saved and user set, redirecting to home');
                } else {
                    // if token is invalid, remove it
                    localStorage.removeItem('token');
                }
                navigate('/');
            } catch (error) {
                console.error('Token processing error:', error);
                navigate('/login?error=Invalid token');
            }
        } else {
            navigate('/login?error=No token received');
        }
    }, [navigate, setUser]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div>Processing login...</div>
        </div>
    );
}

export default AuthCallback;