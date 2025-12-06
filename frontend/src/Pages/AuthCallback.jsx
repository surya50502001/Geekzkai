import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

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
                // Decode token to get user info
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log('JWT Payload:', payload);
                
                const userData = {
                    id: payload.nameid || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
                    email: payload.email || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
                    username: payload.unique_name || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
                };
                
                setUser(userData);
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