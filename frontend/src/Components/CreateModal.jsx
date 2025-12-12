import { X, MessageSquare, Users, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateModal({ isOpen, onClose }) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const createOptions = [
        {
            id: 'post',
            title: 'Create Post',
            description: 'Share your thoughts and questions',
            icon: MessageSquare,
            color: '#3b82f6',
            route: '/create/post'
        },
        {
            id: 'room',
            title: 'Create Room',
            description: 'Start a discussion room',
            icon: Users,
            color: '#10b981',
            route: '/create/room'
        },
        {
            id: 'live',
            title: 'Go Live',
            description: 'Start a live stream',
            icon: Radio,
            color: '#ef4444',
            route: '/create/live'
        }
    ];

    const handleOptionClick = (route) => {
        onClose();
        navigate(route);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-50" 
                onClick={onClose}
            />
            
            {/* Modal */}
            <div 
                className="relative w-full max-w-md mx-4 rounded-2xl shadow-xl"
                style={{backgroundColor: 'var(--bg-primary)'}}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b" style={{borderColor: 'var(--border-color)'}}>
                    <h2 className="text-xl font-bold" style={{color: 'var(--text-primary)'}}>Create</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg transition-colors hover:opacity-80"
                        style={{color: 'var(--text-primary)'}}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Options */}
                <div className="p-4 space-y-3">
                    {createOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                            <button
                                key={option.id}
                                onClick={() => handleOptionClick(option.route)}
                                className="w-full flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.02]"
                                style={{backgroundColor: 'var(--bg-secondary)'}}
                            >
                                <div 
                                    className="w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{backgroundColor: option.color + '20'}}
                                >
                                    <Icon size={24} style={{color: option.color}} />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="font-semibold" style={{color: 'var(--text-primary)'}}>
                                        {option.title}
                                    </h3>
                                    <p className="text-sm" style={{color: 'var(--text-secondary)'}}>
                                        {option.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}