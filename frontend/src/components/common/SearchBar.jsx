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
                background: focused ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.12)",
                border: focused
                    ? "1.5px solid rgba(255,255,255,0.6)"
                    : "1.5px solid rgba(255,255,255,0.25)",
                borderRadius: 12,
                padding: "7px 14px",
                width: 260,
                transition: "all 0.2s ease",
                boxShadow: focused
                    ? "0 0 0 3px rgba(255,255,255,0.1)"
                    : "none",
            }}
        >
            <FiSearch
                size={16}
                style={{
                    color: focused ? "#fff" : "rgba(255,255,255,0.6)",
                    flexShrink: 0,
                    transition: "color 0.2s ease",
                }}
            />
            <input
                type="text"
                placeholder="Search products..."
                className="search-input-dark"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "0.875rem",
                    color: "#fff",
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