import { Link } from "react-router-dom";
import { Home, User, Plus } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CreatePostModal from "./CreatePostModal"; // Import the modal component

const navLinks = [
    { to: "/", icon: <Home size={20} />, label: "Home" },
    { to: "/profile", icon: <User size={20} />, label: "Profile" },
];

function BottomNavbar() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

    const handleProfileClick = () => {
        if (user) navigate("/profile");
        else navigate("/login");
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <nav className="fixed bottom-0 left-0 right-0 md:top-16 md:bottom-0 md:w-48 p-4 flex flex-col justify-start items-start text-text-primary font-sans z-40 bg-background-secondary md:border-r border-border-primary">
                {navLinks.map((link) => (
                    <Link
                        key={link.to}
                        to={user ? link.to : "/login"}
                        aria-label={link.label}
                        className="flex items-center gap-3 p-3 rounded-lg text-text-primary hover:bg-primary/20 transition-all duration-200 font-medium"
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </Link>
                ))}
                <button
                    onClick={openModal}
                    aria-label="Create Post"
                    className="flex items-center gap-3 p-3 rounded-lg text-text-primary hover:bg-primary/20 transition-all duration-200 font-medium"
                >
                    <Plus size={20} />
                    <span>Create Post</span>
                </button>
                <div className="mt-auto">
                    <ThemeToggle />
                </div>
            </nav>
            {isModalOpen && <CreatePostModal closeModal={closeModal} />}
        </>
    );
}

export default BottomNavbar;
