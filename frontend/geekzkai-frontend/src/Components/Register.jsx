import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [link, setLink] = useState("");
    const [isYoutuber, setIsYoutuber] = useState(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password, isYoutuber ? link : null);
            navigate("/profile");
        } catch (error) {
            alert(error.message);
        }
    };

    const CheckYoutuber = (answer) => {
        setIsYoutuber(answer === "Yes");
    };

    const renderInitialQuestion = () => (
        <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-text-primary">Are You a YouTuber?</h3>
            <div className="flex justify-center gap-4 ">
                <button
                    type="button"
                    onClick={() => CheckYoutuber("Yes")}
                    className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:scale-105 transition-transform"
                >
                    Yes
                </button>
                <button
                    type="button"
                    onClick={() => CheckYoutuber("No")}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:scale-105 transition-transform"
                >
                    No
                </button>
            </div>
        </div>
    );

    const renderRegistrationForm = () => (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-3 bg-background-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
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
            {isYoutuber && (
                <input
                    type="url"
                    placeholder="YouTube Channel Link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="p-3 bg-background-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
            )}
            <button
                type="submit"
                className="p-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
                Register
            </button>
            <button
                type="button"
                onClick={() => setIsYoutuber(null)}
                className="text-sm text-text-secondary underline hover:text-primary"
            >
                Go Back
            </button>
        </form>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background-primary p-4 ">
            <div className="bg-background-secondary bg-opacity-80 p-8 rounded-xl shadow-lg w-full max-w-xs ">
                <h2 className="text-3xl font-bold mb-6 text-center text-text-primary">
                    Register
                </h2>
                {isYoutuber === null ? renderInitialQuestion() : renderRegistrationForm()}
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
