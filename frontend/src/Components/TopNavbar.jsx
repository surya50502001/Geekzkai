import { Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function TopNavbar() {
    return (
        <nav className="hidden md:flex border-b border-border-primary p-4 items-center" style={{ marginLeft: 'var(--sidebar-width, 0px)' }}>
            <div className="flex-1 text-center">
                <div className="text-xl font-bold text-text-primary">GeekZkai</div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-background-tertiary px-3 py-2 rounded-full">
                    <Search size={20} className="text-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent focus:outline-none text-black dark:text-gray/50"
                    />
                </div>
                <ThemeToggle />
            </div>
        </nav>
    );
}
