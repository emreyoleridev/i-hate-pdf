"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="fixed bottom-6 right-6 z-50 p-3 rounded-full border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-lg w-[50px] h-[50px]">
            </div>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-lg text-zinc-900 dark:text-white hover:scale-110 transition-transform flex items-center justify-center cursor-pointer"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
        </button>
    );
}
