import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/profile");
        } catch {
            alert("Invalid email or password");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background-primary p-4 absolute inset-0 z-10">
            <div className="bg-background-secondary bg-opacity-80 p-8 rounded-xl shadow-lg w-full max-w-xs">
                <h2 className="text-3xl font-bold mb-6 text-center text-text-primary">Login</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 bg-background-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 bg-background-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button type="submit" className="p-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors animated-gradient">
                        Login
                    </button>
                    <p className="mt-6 text-center text-text-secondary">
                        New User?{" "}
                        <Link to="/Register" className="text-primary hover:underline">
                            Register here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
