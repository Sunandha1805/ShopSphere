import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiGrid } from "react-icons/fi";
import { getCategories } from "../../services/categoryService";

// Map DB category_name → local image in /public/categories/
const CATEGORY_IMAGE = {
    "Electronics":          "/categories/electronics.png",
    "Laptops":              "/categories/laptops.png",
    "Automotive":           "/categories/automotive.png",
    "Health":               "/categories/health.png",
    "Home & Kitchen":       "/categories/home-kitchen.png",
    "Music":                "/categories/music.png",
    "Office":               "/categories/office.png",
    "Toys":                 "/categories/toys.png",
    // add more as needed
};

const CategorySection = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                setCategories(response.data.filter(c => c.product_count > 0));
            } catch (error) {
                console.error("Failed to load categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-gray-900">Shop by Category</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-2xl h-52 animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold text-gray-900">
                        Shop by Category
                    </h2>
                    <p className="mt-3 text-gray-500">
                        Browse products across our most popular categories.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                    {categories.map((category) => {
                        const imgSrc = CATEGORY_IMAGE[category.category_name];

                        return (
                            <div
                                key={category.category_id}
                                onClick={() =>
                                    navigate(`/products?category=${category.category_id}&page=1`)
                                }
                                className="group cursor-pointer bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                            >
                                {/* Image area */}
                                <div className="w-full h-36 bg-gray-50 flex items-center justify-center overflow-hidden">
                                    {imgSrc ? (
                                        <img
                                            src={imgSrc}
                                            alt={category.category_name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center">
                                            <FiGrid size={28} className="text-teal-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Text */}
                                <div className="px-4 py-3">
                                    <h3 className="font-semibold text-gray-800 group-hover:text-teal-600 transition text-sm leading-tight">
                                        {category.category_name}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {category.product_count}{" "}
                                        {category.product_count === 1 ? "product" : "products"}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default CategorySection;