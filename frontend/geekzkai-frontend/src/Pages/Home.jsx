import { useTheme } from "../Context/ThemeContext";

function Home() {
    const { theme } = useTheme();
    return (
        <div className="text-text-primary px-6 py-10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">Welcome to GeekzKai 👾</h1>
                <p className="text-text-secondary text-lg">
                    Your space to discuss anime theories, post “what if” ideas, and vibe with other fans!
                </p>
                <p className="mt-4">Current theme: <span className="font-semibold text-primary">{theme}</span></p>
            </div>
        </div>
    );
}

export default Home;
