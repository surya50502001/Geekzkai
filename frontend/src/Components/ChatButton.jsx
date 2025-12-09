import { MessageCircle } from "lucide-react";
import { useAuth } from "../Context/AuthContext";

export default function ChatButton({ userId, username, onChatOpen }) {
    const { user } = useAuth();

    const handleChat = () => {
        if (onChatOpen) {
            onChatOpen({ id: userId, username });
        }
    };

    if (!user || userId === user.id) return null;

    return (
        <button
            onClick={handleChat}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-medium bg-green-500 text-white hover:bg-green-600 transition-all duration-200"
        >
            <MessageCircle size={16} />
            Message
        </button>
    );
}