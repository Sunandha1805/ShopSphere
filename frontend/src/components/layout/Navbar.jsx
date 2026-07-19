import { Link, NavLink,  useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "../common/SearchBar";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };
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

                {/* Search */}
                <SearchBar />

                {/* Icon Actions */}
                <div className="flex items-center gap-1">
                    {/* Wishlist */}
                    {[
                        { to: "/wishlist", icon: <FiHeart size={20} />, label: "Wishlist", badge: 3 },
                        { to: "/cart",     icon: <FiShoppingCart size={20} />, label: "Cart", badge: 5 },
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
                        <div className="flex items-center gap-1 ml-1">
                            {/* Profile link */}
                            <NavLink
                                to="/profile"
                                title="Profile"
                                aria-label="Profile"
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200"
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
                                <span>{user.first_name}</span>
                            </NavLink>

                            {/* Logout button */}
                            <button
                                onClick={handleLogout}
                                title="Logout"
                                aria-label="Logout"
                                className="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200"
                                style={{
                                    fontFamily: "'Inter', sans-serif",
                                    color: "rgba(255,255,255,0.7)",
                                    background: "transparent",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    cursor: "pointer",
                                    letterSpacing: "0.01em",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(255,80,80,0.18)";
                                    e.currentTarget.style.color = "#fca5a5";
                                    e.currentTarget.style.borderColor = "rgba(255,80,80,0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                                }}
                            >
                                Logout
                            </button>
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