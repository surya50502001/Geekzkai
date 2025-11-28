import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [link, setLink] = useState("");
    const [isYoutuber, setIsYoutuber] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await register(
                username,
                email,
                password,
                isYoutuber,
                isYoutuber ? link : null
            );
        } catch (error) {
            alert(error.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background-primary p-4">
            <div className="bg-background-secondary bg-opacity-80 p-8 rounded-xl shadow-lg w-full max-w-xs">
                <h2 className="text-3xl font-bold mb-6 text-center text-text-primary">
                    Register
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="p-3 bg-background-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />

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

                    {/* Youtuber Toggle */}
                    <div className="flex items-center justify-between">
                        <span className="text-text-primary">Are you a YouTuber?</span>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isYoutuber}
                                onChange={() => setIsYoutuber(!isYoutuber)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-dark dark:peer-focus:ring-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:bg-gray-700 peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    {/* Channel Link */}
                    {isYoutuber && (
                        <input
                            type="url"
                            placeholder="YouTube Channel Link"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="p-3 bg-background-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="p-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="mt-6 text-center text-text-secondary">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
