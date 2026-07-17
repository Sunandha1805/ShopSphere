import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../components/product/ProductCard";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getProducts();
            setProducts(data.data);
        } catch (error) {
            console.error(error);
            setError("Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <p className="text-lg font-medium">Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-20">
                <h2 className="text-red-600 text-xl font-semibold">
                    {error}
                </h2>
            </div>
        );
    }

    return (
        <div style={{ padding: "8px 16px" }}>
            <h1
                style={{
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: "#134e4a",
                    fontFamily: "'Inter', sans-serif",
                    marginBottom: "1.5rem",
                    letterSpacing: "-0.01em",
                }}
            >
                Products
            </h1>

            {products.length === 0 ? (
                <div className="text-center mt-20">
                    <h2 className="text-2xl font-semibold">
                        No products found.
                    </h2>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <ProductCard
                            key={product.product_id}
                            product={product}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;