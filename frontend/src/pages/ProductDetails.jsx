import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiArrowLeft, FiPackage } from "react-icons/fi";
import { getProductById } from "../services/productService";

import { addToCart } from "../services/cartService";
import toast from "react-hot-toast";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleAddToCart = async () => {
        try {
            await addToCart(product.product_id);
            toast.success("Product added to cart!");
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message ||
                "Failed to add product."
            );
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getProductById(id);
                setProduct(data.data);
            } catch (error) {
                console.error(error);
                setError("Failed to load product.");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 400,
                    gap: 12,
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                <FiPackage size={36} style={{ color: "#0d9488", opacity: 0.5 }} />
                <p style={{ fontSize: "0.95rem", color: "#6b7280" }}>Loading product...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 400,
                    gap: 16,
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                <p style={{ color: "#dc2626", fontSize: "0.95rem" }}>
                    {error || "Product not found."}
                </p>
                <button
                    onClick={() => navigate("/products")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: "#0d9488",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                    }}
                >
                    <FiArrowLeft size={15} /> Back to Products
                </button>
            </div>
        );
    }

    const inStock = product.stock_quantity > 0;

    return (
        <div style={{ padding: "8px 16px", fontFamily: "'Inter', sans-serif" }}>

            {/* Back button */}
            <button
                onClick={() => navigate("/products")}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#6b7280",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    marginBottom: 24,
                    padding: 0,
                    transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#0d9488")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
            >
                <FiArrowLeft size={15} />
                Back to Products
            </button>

            {/* Main 2-column layout */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1.5fr",
                    gap: 40,
                    alignItems: "start",
                }}
            >
                {/* ── LEFT COLUMN: image + stock + actions ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                    {/* Image box — smaller */}
                    <div
                        style={{
                            background: "#0d9488",
                            borderRadius: 14,
                            border: "1px solid rgba(255,255,255,0.12)",
                            padding: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: 260,
                        }}
                    >
                        <img
                            src={product.image_url}
                            alt={product.product_name}
                            style={{
                                maxWidth: "100%",
                                maxHeight: 260,
                                objectFit: "contain",
                                display: "block",
                            }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/400x400?text=No+Image";
                            }}
                        />
                    </div>

                    {/* Price */}
                    <p
                        style={{
                            fontSize: "1.6rem",
                            fontWeight: 700,
                            color: "#0d9488",
                            margin: 0,
                            letterSpacing: "-0.01em",
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        ₹{Number(product.price).toLocaleString()}
                    </p>

                    {/* Stock badge */}
                    <div>
                        {inStock ? (
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4,
                                    background: "#f0fdf4",
                                    color: "#16a34a",
                                    border: "1px solid #bbf7d0",
                                    fontSize: "0.65rem",
                                    fontWeight: 600,
                                    padding: "3px 8px",
                                    borderRadius: 99,
                                    fontFamily: "'Inter', sans-serif",
                                    letterSpacing: "0.02em",
                                }}
                            >
                                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
                                In Stock
                            </span>
                        ) : (
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4,
                                    background: "#fef2f2",
                                    color: "#dc2626",
                                    border: "1px solid #fecaca",
                                    fontSize: "0.65rem",
                                    fontWeight: 600,
                                    padding: "3px 8px",
                                    borderRadius: 99,
                                    fontFamily: "'Inter', sans-serif",
                                    letterSpacing: "0.02em",
                                }}
                            >
                                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#dc2626", display: "inline-block" }} />
                                Out of Stock
                            </span>
                        )}
                    </div>


                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 10 }}>
                        <button
                            onClick={handleAddToCart}
                            disabled={!inStock}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                background: inStock ? "#f0fdfa" : "#e5e7eb",
                                color: inStock ? "#0d9488" : "#9ca3af",
                                border: inStock ? "1px solid rgba(13,148,136,0.25)" : "none",
                                borderRadius: 10,
                                padding: "11px 0",
                                fontSize: "0.88rem",
                                fontWeight: 600,
                                fontFamily: "'Inter', sans-serif",
                                cursor: inStock ? "pointer" : "not-allowed",
                                transition: "background 0.2s",
                                flex: 1,
                            }}
                            onMouseEnter={(e) => {
                                if (inStock) e.currentTarget.style.background = "#ccfbf1";
                            }}
                            onMouseLeave={(e) => {
                                if (inStock) e.currentTarget.style.background = "#f0fdfa";
                            }}
                        >
                            <FiShoppingCart size={15} />
                            Add to Cart
                        </button>

                        <button
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                background: "#fff",
                                color: "#374151",
                                border: "1px solid #e2e8f0",
                                borderRadius: 10,
                                padding: "11px 18px",
                                fontSize: "0.88rem",
                                fontWeight: 600,
                                fontFamily: "'Inter', sans-serif",
                                cursor: "pointer",
                                transition: "border-color 0.2s, color 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#fca5a5";
                                e.currentTarget.style.color = "#e11d48";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "#e2e8f0";
                                e.currentTarget.style.color = "#374151";
                            }}
                        >
                            <FiHeart size={15} />
                            Wishlist
                        </button>
                    </div>
                </div>

                {/* ── RIGHT COLUMN: product info ── */}
                <div style={{ display: "flex", flexDirection: "column" }}>

                    {/* Brand */}
                    <p
                        style={{
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            color: "#0d9488",
                            letterSpacing: "0.07em",
                            textTransform: "uppercase",
                            margin: 0,
                        }}
                    >
                        {product.brand}
                    </p>

                    {/* Product Name */}
                    <h1
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            color: "#0f172a",
                            margin: "8px 0 14px",
                            lineHeight: 1.35,
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {product.product_name}
                    </h1>

                    {/* Divider */}
                    <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "0 0 16px" }} />

                    {/* Description */}
                    <p
                        style={{
                            fontSize: "0.875rem",
                            color: "#4b5563",
                            lineHeight: 1.75,
                            margin: 0,
                        }}
                    >
                        {product.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;