import { MessageSquare, Users, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Create() {
    const navigate = useNavigate();

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
        navigate(route);
    };

    return (
        <div className="min-h-screen py-20 px-6" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4" style={{color: 'var(--text-primary)'}}>Create</h1>
                    <p className="text-xl" style={{color: 'var(--text-secondary)'}}>Choose what you want to create</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {createOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                            <button
                                key={option.id}
                                onClick={() => handleOptionClick(option.route)}
                                className="p-8 rounded-2xl transition-all hover:scale-105 hover:shadow-2xl border-2"
                                style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div 
                                        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                                        style={{backgroundColor: option.color + '20'}}
                                    >
                                        <Icon size={32} style={{color: option.color}} />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-2" style={{color: 'var(--text-primary)'}}>
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
