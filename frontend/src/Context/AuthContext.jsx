import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// API base
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://geekzkai.onrender.com/api";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(!!token);

    useEffect(() => {
        const currentToken = localStorage.getItem("token");
        if (currentToken && currentToken !== token) {
            setToken(currentToken);
        }
        
        if (currentToken) {
            setLoading(true);
            fetch(`${API_BASE_URL}/user/me`, {
                headers: {
                    Authorization: `Bearer ${currentToken}`,
                },
            })
                .then((res) => (res.ok ? res.json() : null))
                .then((data) => setUser(data))
                .catch(() => setUser(null))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        const res = await fetch(`${API_BASE_URL}/user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: "Invalid credentials" }));
            throw new Error(errorData.message || "Invalid credentials");
        }

        const data = await res.json();
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setUser(data.user);
    };

    const register = async (
        username,
        email,
        password,
        isYoutuber,
        youtubeChannelLink = null
    ) => {
        const payload = {
            username,
            email,
            password,
            isYoutuber,
            YouTubeChannelLink: youtubeChannelLink,
        };

        const res = await fetch(`${API_BASE_URL}/user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: `Request failed ${res.status}` }));
            console.error("Registration error:", errorData);
            throw errorData;
        }

        const data = await res.json();

        // Auto-login
        await login(email, password);

        return data;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
