import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5131/api";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    useEffect(() => {
        if (token) {
            // ✅ fetch user info using token
            fetch(`${API_BASE_URL}/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.ok ? res.json() : null)
                .then((data) => setUser(data))
                .catch(() => setUser(null));
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

    const register = async (username, email, password, channelLink = null) => {
        const res = await fetch(`${API_BASE_URL}/user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, passwordHash: password, channelLink }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Registration failed");
        }

        const data = await res.json();
        // Optionally, auto-login after registration
        await login(email, password);
        return data;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
