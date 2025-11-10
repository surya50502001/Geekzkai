import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import narutoBg from "../assets/themes/naruto.png";
import sasukeBg from "../assets/themes/sasuke.png";
import itachiBg from "../assets/themes/itachi.png";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const { theme } = useTheme();
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

    const getBackgroundImage = () => {
        switch (theme) {
            case "naruto":
                return narutoBg;
            case "sasuke":
                return sasukeBg;
            case "itachi":
                return itachiBg;
            default:
                return narutoBg;
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center"
            style={{
                background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), linear-gradient(rgba(0,0,0,0.5), rgba(255,100,0,0.3)), url(${getBackgroundImage()}) center/cover no-repeat`
            }}
        >
            <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-64">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-2 border rounded"
                    />
                    <button type="submit" className="p-2 bg-orange-500 text-white rounded animated-gradient">
                        Login
                    </button>
                    <p className="mt-4 text-center">
                        New User?{" "}
                        <Link to="/Register" className="text-orange-500 ">
                            Register here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
