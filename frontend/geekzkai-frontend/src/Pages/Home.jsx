import { useTheme } from "../Context/ThemeContext";

function Home() {
    const { theme } = useTheme();
    return (
        <div className="text-gray-100 px-6 py-10">
            <h1 className="text-3xl font-bold mb-4">Welcome to GeekzKai 👾</h1>
            <p className="text-gray-400">Your space to discuss anime theories, post “what if” ideas, and vibe with other fans!</p>
            <p>Current theme: {theme}</p>
        </div>
    )
}

export default Home
