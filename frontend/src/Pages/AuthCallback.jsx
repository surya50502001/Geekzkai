import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

function AuthCallback() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
            // Decode token to get user info
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('JWT Payload:', payload); // Debug log
            setUser({
                id: payload.nameid || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
                email: payload.email || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
                username: payload.unique_name || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
            });
            navigate('/');
        } else {
            navigate('/login');
        }
    }, [navigate, setUser]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div>Processing login...</div>
        </div>
    );
}

export default AuthCallback;