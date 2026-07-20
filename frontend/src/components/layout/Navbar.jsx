import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiUser, FiPackage, FiLogOut, FiChevronDown } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useCartWishlist } from "../../context/CartWishlistContext";
import SearchBar from "../common/SearchBar";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { cartCount, wishlistCount } = useCartWishlist();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Show search only on the products page
    const showSearch = location.pathname === "/products";

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate("/login");
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav
            style={{
                background: "#0d9488",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderBottom: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 2px 16px 0 rgba(0,0,0,0.12)",
                position: "sticky",
                top: 0,
                zIndex: 50,
            }}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

                {/* Brand */}
                <Link
                    to="/"
                    style={{
                        color: "#fff",
                        fontSize: "1.6rem",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        fontFamily: "'Inter', sans-serif",
                        textDecoration: "none",
                        userSelect: "none",
                    }}
                >
                    ShopSphere
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-6">
                    {[
                        { to: "/", label: "Home" },
                        { to: "/products", label: "Products" },
                        { to: "/orders", label: "Orders" },
                        { to: "/addresses", label: "Addresses" },
                    ].map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === "/"}
                            className={({ isActive }) =>
                                [
                                    "text-sm transition-colors duration-200",
                                    isActive
                                        ? "font-bold"
                                        : "font-medium",
                                ].join(" ")
                            }
                            style={({ isActive }) => ({
                                fontFamily: "'Inter', sans-serif",
                                textDecoration: "none",
                                letterSpacing: "0.01em",
                                padding: "8px 2px",
                                color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                            })}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                            onMouseLeave={(e) => {
                                const active = e.currentTarget.getAttribute("aria-current") === "page";
                                e.currentTarget.style.color = active ? "#fff" : "rgba(255,255,255,0.65)";
                            }}
                        >
                            {label}
                        </NavLink>
                    ))}
                </div>

                {/* Search — only on Products page */}
                {showSearch && <SearchBar />}

                {/* Icon Actions */}
                <div className="flex items-center gap-1">
                    {/* Wishlist */}
                    {[
                        { to: "/wishlist", icon: <FiHeart size={20} />, label: "Wishlist", badge: wishlistCount },
                        { to: "/cart",     icon: <FiShoppingCart size={20} />, label: "Cart",     badge: cartCount },
                    ].map(({ to, icon, label, badge }) => (
                        <NavLink
                            key={to}
                            to={to}
                            title={label}
                            aria-label={label}
                            className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200"
                            style={({ isActive }) => ({
                                color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                                background: "none",
                            })}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                            onMouseLeave={(e) => {
                                const active = e.currentTarget.getAttribute("aria-current") === "page";
                                e.currentTarget.style.color = active ? "#fff" : "rgba(255,255,255,0.65)";
                            }}
                        >
                            {icon}
                            {badge > 0 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: 4,
                                        right: 4,
                                        minWidth: 16,
                                        height: 16,
                                        borderRadius: 99,
                                        background: "#fff",
                                        color: "#0d9488",
                                        fontSize: "0.6rem",
                                        fontWeight: 700,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: "0 4px",
                                        lineHeight: 1,
                                        pointerEvents: "none",
                                        fontFamily: "'Inter', sans-serif",
                                    }}
                                >
                                    {badge > 99 ? "99+" : badge}
                                </span>
                            )}
                        </NavLink>
                    ))}

                    {/* User / Auth section */}
                    {user ? (
                        <div className="relative ml-2 flex items-center" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-teal-700 font-bold bg-white transition-transform hover:scale-105 shadow-sm border border-transparent"
                                style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: "1rem"
                                }}
                            >
                                {user.first_name?.charAt(0).toUpperCase()}
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div
                                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 flex flex-col py-2"
                                    style={{ fontFamily: "'Inter', sans-serif" }}
                                >
                                    <div className="px-4 py-3 border-b border-gray-50">
                                        <p className="text-sm font-bold text-gray-900 truncate">
                                            {user.first_name} {user.last_name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">
                                            {user.email}
                                        </p>
                                    </div>
                                    <div className="py-2">
                                        <Link
                                            to="/profile"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                                        >
                                            <FiUser size={16} /> My Profile
                                        </Link>
                                        <Link
                                            to="/orders"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                                        >
                                            <FiPackage size={16} /> My Orders
                                        </Link>
                                    </div>
                                    <div className="border-t border-gray-50 py-2">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                                        >
                                            <FiLogOut size={16} /> Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Login link */
                        <NavLink
                            to="/login"
                            title="Login"
                            aria-label="Login"
                            className="flex items-center gap-2 ml-1 px-3 py-1.5 rounded-xl transition-all duration-200"
                            style={({ isActive }) => ({
                                color: isActive ? "#fff" : "rgba(255,255,255,0.85)",
                                background: isActive ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
                                fontFamily: "'Inter', sans-serif",
                                textDecoration: "none",
                                fontSize: "0.875rem",
                                fontWeight: 600,
                            })}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.18)";
                                e.currentTarget.style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                                const active = e.currentTarget.getAttribute("aria-current") === "page";
                                e.currentTarget.style.background = active ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)";
                                e.currentTarget.style.color = active ? "#fff" : "rgba(255,255,255,0.85)";
                            }}
                        >
                            <FiUser size={16} />
                            <span>Login</span>
                        </NavLink>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;