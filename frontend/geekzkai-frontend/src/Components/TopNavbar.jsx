import { Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function TopNavbar({ isDraggable, setIsDraggable }) {
    return (
        <nav className="bg-background-secondary border-b border-border-primary p-4 flex justify-between items-center md:ml-48">
            <div className="text-xl font-bold text-text-primary">GeekZkai</div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-background-tertiary px-3 py-2 rounded-full">
                    <Search size={20} className="text-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent focus:outline-none text-text-primary"
                    />
                </div>
                <ThemeToggle />
                <button onClick={() => setIsDraggable(!isDraggable)} className="bg-primary text-white p-2 rounded-full">
                    {isDraggable ? "Fix Navbar" : "Move Navbar"}
                </button>
            </div>
        </nav>
    );
}