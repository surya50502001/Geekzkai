import { useState, useEffect } from "react";
import { UserPlus, UserMinus } from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import API_BASE_URL from "../apiConfig";

export default function FollowButton({ userId, username, onFollowChange }) {
    const { token, user } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && userId !== user.id) {
            checkFollowStatus();
        }
    }, [userId, user]);

    const checkFollowStatus = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/follow/status/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setIsFollowing(data.isFollowing);
            }
        } catch (error) {
            console.error("Error checking follow status:", error);
        }
    };

    const handleFollow = async () => {
        if (!user || userId === user.id) return;
        
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/follow/${userId}`, {
                method: isFollowing ? "DELETE" : "POST",
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.ok) {
                setIsFollowing(!isFollowing);
                if (onFollowChange) {
                    onFollowChange(!isFollowing);
                }
            }
        } catch (error) {
            console.error("Error following/unfollowing user:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!user || userId === user.id) return null;

    return (
        <button
            onClick={handleFollow}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                isFollowing
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600"
                    : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
        >
            {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isFollowing ? (
                <UserMinus size={16} />
            ) : (
                <UserPlus size={16} />
            )}
            {isFollowing ? "Unfollow" : "Follow"}
        </button>
    );
}