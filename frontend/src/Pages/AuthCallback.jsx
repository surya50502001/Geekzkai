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
                console.log('Token saved, redirecting to home');
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