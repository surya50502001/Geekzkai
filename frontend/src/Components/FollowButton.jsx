import { useState, useEffect } from "react";
import { UserPlus, UserMinus } from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import API_BASE_URL from "../apiConfig";

export default function FollowButton({ userId, username, onFollowChange }) {
    const { token, user } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);
    const [requestPending, setRequestPending] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && userId !== user.id && token) {
            checkFollowStatus();
        }
    }, [userId, user, token]);

    const checkFollowStatus = async () => {
        if (!token) return;
        try {
            const response = await fetch(`${API_BASE_URL}/follow/status/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setIsFollowing(data.isFollowing);
            }
            
            // Check for pending friend request
            const requestResponse = await fetch(`${API_BASE_URL}/notification/friend-requests`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (requestResponse.ok) {
                const requests = await requestResponse.json();
                const hasPendingRequest = requests.some(req => req.fromUserId === parseInt(localStorage.getItem('currentUserId')) && req.userId === userId);
                setRequestPending(hasPendingRequest);
            }
        } catch (error) {
            console.error("Error checking follow status:", error);
        }
    };

    const handleFollow = async () => {
        if (!user || userId === user.id || requestPending) return;
        
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/follow/${userId}`, {
                method: isFollowing ? "DELETE" : "POST",
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.ok) {
                if (isFollowing) {
                    setIsFollowing(false);
                } else {
                    setRequestPending(true);
                }
                if (onFollowChange) {
                    onFollowChange();
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
            className="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 hover:opacity-80"
            style={{
                backgroundColor: isFollowing ? 'var(--bg-secondary)' : '#3b82f6',
                color: isFollowing ? 'var(--text-primary)' : 'white'
            }}
        >
            {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isFollowing ? (
                <UserMinus size={16} />
            ) : requestPending ? (
                <span>⏳</span>
            ) : (
                <UserPlus size={16} />
            )}
            {isFollowing ? "Unfollow" : requestPending ? "Request Sent" : "Follow"}
        </button>
    );
}