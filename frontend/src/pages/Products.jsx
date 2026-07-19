import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductCard from "../components/product/ProductCard";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [totalPages, setTotalPages] = useState(1);

    // Sync page with URL: /products?page=3
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Math.max(parseInt(searchParams.get("page")) || 1, 1);

    const setCurrentPage = (page) => {
        setSearchParams({ page });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    const fetchProducts = async (page) => {
        try {
            setLoading(true);
            setError("");

            const data = await getProducts(page, 12);
            setProducts(data.data);
            if (data.pagination) {
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error(error);
            setError("Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, currentPage + 2);

        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push("...");
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
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
                <div className="text-center mt-20 bg-white rounded-2xl border border-gray-100 p-12 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        No products found.
                    </h2>
                    <p className="text-gray-500 text-sm">Check back later for new arrivals.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard
                                key={product.product_id}
                                product={product}
                            />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-1.5 mt-10 mb-6">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 bg-white hover:border-teal-500 hover:text-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                ‹
                            </button>
                            
                            <div className="flex items-center gap-1">
                                {getPageNumbers().map((page, index) => (
                                    page === "..." ? (
                                        <span key={`dots-${index}`} className="w-8 text-center text-gray-400 text-sm">…</span>
                                    ) : (
                                        <button
                                            key={`page-${page}`}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 ${
                                                currentPage === page
                                                ? "bg-teal-600 text-white shadow-sm"
                                                : "bg-white text-gray-600 border border-gray-200 hover:border-teal-400 hover:text-teal-600"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 bg-white hover:border-teal-500 hover:text-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                ›
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Products;