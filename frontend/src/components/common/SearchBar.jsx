import { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";

const SearchBar = () => {
    const [focused, setFocused] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [value, setValue] = useState(searchParams.get("search") || "");

    // Keep input in sync if URL changes externally (e.g. back button)
    useEffect(() => {
        setValue(searchParams.get("search") || "");
    }, [searchParams]);

    const applySearch = (query) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (query.trim()) {
                next.set("search", query.trim());
            } else {
                next.delete("search");
            }
            next.set("page", "1"); // reset to page 1 on new search
            return next;
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") applySearch(value);
    };

    const handleClear = () => {
        setValue("");
        applySearch("");
    };

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
                boxShadow: focused ? "0 0 0 3px rgba(255,255,255,0.1)" : "none",
            }}
        >
            <FiSearch
                size={16}
                style={{
                    color: focused ? "#fff" : "rgba(255,255,255,0.6)",
                    flexShrink: 0,
                    transition: "color 0.2s ease",
                    cursor: "pointer",
                }}
                onClick={() => applySearch(value)}
            />
            <input
                type="text"
                placeholder="Search products..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="search-input-dark"
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
            {value && (
                <FiX
                    size={14}
                    style={{ color: "rgba(255,255,255,0.6)", cursor: "pointer", flexShrink: 0 }}
                    onClick={handleClear}
                />
            )}
        </div>
    );
};

export default SearchBar;