import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const themes  = ["light","dark"];

export const ThemeProvider = ({ children }) => { 
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const nextTheme = () => {
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex+1) % themes.length;
        setTheme(themes[nextIndex]);
    }

    return (
        <ThemeContext.Provider value={{ theme, nextTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
