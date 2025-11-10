import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center mt-20">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <div className="flex flex-col gap-4 w-64">
                <p>
                    <strong>Username:</strong> {user.username}
                </p>
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
                <button
                    onClick={handleLogout}
                    className="p-2 bg-red-500 text-white rounded"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Profile;