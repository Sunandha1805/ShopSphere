import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiStar } from "react-icons/fi";
import { addToWishlist, removeWishlistByProductId } from "../../services/wishlistService";
import { useCartWishlist } from "../../context/CartWishlistContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
    const { wishlistItems, refreshCounts } = useCartWishlist();
    const [wishlisted, setWishlisted] = useState(false);

    useEffect(() => {
        if (wishlistItems && product?.product_id) {
            setWishlisted(wishlistItems.includes(product.product_id));
        }
    }, [wishlistItems, product?.product_id]);

    const handleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            if (wishlisted) {
                await removeWishlistByProductId(product.product_id);
                setWishlisted(false);
                refreshCounts();
                toast.success("Removed from wishlist");
            } else {
                await addToWishlist(product.product_id);
                setWishlisted(true);
                refreshCounts();
                toast.success("Added to wishlist!");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update wishlist"
            );
        }
    };

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid #e8edf2",
                boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                overflow: "hidden",
                transition: "box-shadow 0.22s ease, transform 0.22s ease",
                display: "flex",
                flexDirection: "column",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.05)";
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            {/* Image area — soft neutral gradient */}
            <div
                style={{
                    position: "relative",
                    background: "linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)",
                    borderBottom: "1px solid #e8edf2",
                }}
            >
                <img
                    src={product.image_url}
                    alt={product.product_name}
                    style={{
                        width: "100%",
                        height: 220,
                        objectFit: "contain",
                        padding: "16px",
                        display: "block",
                    }}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/400x400?text=No+Image";
                    }}
                />

                {/* Wishlist button */}
                <button
                    aria-label="Add to wishlist"
                    onClick={handleWishlist}
                    style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        background: wishlisted ? "#fff1f2" : "#fff",
                        border: wishlisted ? "1px solid #fecdd3" : "1px solid #e2e8f0",
                        borderRadius: "50%",
                        width: 34,
                        height: 34,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: wishlisted ? "#e11d48" : "#94a3b8",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                        transition: "color 0.2s, border-color 0.2s, background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        if (!wishlisted) {
                            e.currentTarget.style.color = "#e11d48";
                            e.currentTarget.style.borderColor = "#fecdd3";
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!wishlisted) {
                            e.currentTarget.style.color = "#94a3b8";
                            e.currentTarget.style.borderColor = "#e2e8f0";
                        }
                    }}
                >
                    <FiHeart size={15} fill={wishlisted ? "#e11d48" : "none"} />
                </button>

                {/* Out of stock badge */}
                {product.stock_quantity === 0 && (
                    <span
                        style={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            background: "#fff1f2",
                            color: "#be123c",
                            fontSize: "0.68rem",
                            fontWeight: 600,
                            padding: "3px 9px",
                            borderRadius: 99,
                            border: "1px solid #fecdd3",
                            fontFamily: "'Inter', sans-serif",
                            letterSpacing: "0.02em",
                        }}
                    >
                        Out of Stock
                    </span>
                )}
            </div>

            {/* Content */}
            <div
                style={{
                    padding: "14px 16px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    flex: 1,
                }}
            >
                {/* Brand */}
                <p
                    style={{
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        color: "#94a3b8",
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                        fontFamily: "'Inter', sans-serif",
                        margin: 0,
                    }}
                >
                    {product.brand}
                </p>

                {/* Product name */}
                <h2
                    style={{
                        fontSize: "0.92rem",
                        fontWeight: 600,
                        color: "#0f172a",
                        lineHeight: 1.45,
                        margin: "2px 0 6px",
                        fontFamily: "'Inter', sans-serif",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {product.product_name}
                </h2>

                {/* Rating (if any) */}
                {product.rating > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <FiStar size={12} fill="#f59e0b" stroke="#f59e0b" />
                        <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>
                            {Number(product.rating).toFixed(1)}
                        </span>
                    </div>
                )}

                {/* Price + CTA */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "auto",
                        paddingTop: 12,
                    }}
                >
                    <span
                        style={{
                            fontSize: "1.05rem",
                            fontWeight: 700,
                            color: "#0f172a",
                            fontFamily: "'Inter', sans-serif",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        ₹{Number(product.price).toLocaleString()}
                    </span>

                    <Link
                        to={`/products/${product.product_id}`}
                        style={{
                            background: "#0d9488",
                            color: "#fff",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            padding: "7px 16px",
                            borderRadius: 8,
                            textDecoration: "none",
                            fontFamily: "'Inter', sans-serif",
                            transition: "background 0.2s",
                            letterSpacing: "0.02em",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#0f766e";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#0d9488";
                        }}
                    >
                        View
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;