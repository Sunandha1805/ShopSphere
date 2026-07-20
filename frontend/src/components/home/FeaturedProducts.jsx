import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

import ProductCard from "../product/ProductCard";
import { getProducts } from "../../services/productService";

const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
        <div className="bg-gray-100 h-48" />
        <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="h-5 bg-gray-100 rounded w-1/3" />
        </div>
    </div>
);

const FeaturedProducts = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            // Use page=1, limit=8 — let the backend slice, not the client
            const response = await getProducts(1, 8);
            setProducts(response.data);  // ← API returns { data: [...], pagination: {...} }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900">
                            Featured Products
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Discover our best-selling electronics and accessories.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/products")}
                        className="flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition-colors"
                    >
                        View All
                        <FiArrowRight />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                        : products.map((product) => (
                            <ProductCard
                                key={product.product_id}
                                product={product}
                            />
                        ))
                    }
                </div>

            </div>
        </section>
    );
};

export default FeaturedProducts;
