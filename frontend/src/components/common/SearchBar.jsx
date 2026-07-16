import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = () => {
    const [focused, setFocused] = useState(false);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: focused ? "#ffffff" : "rgba(255,255,255,0.6)",
                border: focused
                    ? "1.5px solid #14b8a6"
                    : "1.5px solid rgba(13,148,136,0.2)",
                borderRadius: 12,
                padding: "7px 14px",
                width: 260,
                transition: "all 0.2s ease",
                boxShadow: focused
                    ? "0 0 0 3px rgba(20,184,166,0.15)"
                    : "none",
            }}
        >
            <FiSearch
                size={16}
                style={{
                    color: focused ? "#0d9488" : "#9ca3af",
                    flexShrink: 0,
                    transition: "color 0.2s ease",
                }}
            />
            <input
                type="text"
                placeholder="Search products..."
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "0.875rem",
                    color: "#134e4a",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    width: "100%",
                    letterSpacing: "0.01em",
                }}
            />
        </div>
    );
};

export default SearchBar;