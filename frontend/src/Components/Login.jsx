import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/profile");
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
        } catch (error) {
            console.error("Login failed:", error);
            alert("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-background-primary p-4">
            <div className="bg-white/10 bg-opacity-80 p-8 rounded-xl shadow-lg w-full max-w-xs">
                <h2 className="text-3xl font-bold mb-6 text-center text-text-primary">Login</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 bg-background-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 bg-background-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="p-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors animated-gradient disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p className="mt-6 text-center text-text-secondary">
                        New User?{" "}
                        <Link to="/register" className="text-primary hover:underline">
                            Register here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
