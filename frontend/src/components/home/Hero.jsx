import { FiArrowRight, FiShoppingBag, FiShield, FiTruck, FiRefreshCw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const TRUST_ITEMS = [
    { icon: <FiShield size={13} />, label: "Secure Payments" },
    { icon: <FiTruck size={13} />, label: "Fast Delivery" },
    { icon: <FiRefreshCw size={13} />, label: "Easy Returns" },
];

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white rounded-3xl overflow-hidden">

            <div className="max-w-7xl mx-auto px-8 py-10 lg:py-16">

                <div className="grid lg:grid-cols-2 items-center gap-12">

                    {/* Left Content */}
                    <div>

                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                            Power Up
                            <br />
                            Your Everyday
                            <br />
                            Devices
                        </h1>

                        <p className="mt-6 text-lg text-teal-50 leading-8 max-w-xl">
                            Discover high-quality charging cables,
                            adapters, headphones and electronic
                            accessories from trusted brands at
                            affordable prices.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 mt-10">
                            <button
                                onClick={() => navigate("/products")}
                                className="bg-white text-teal-700 px-7 py-4 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-100 transition shadow-lg shadow-black/10"
                            >
                                <FiShoppingBag />
                                Shop Now
                            </button>

                            <button
                                onClick={() => navigate("/products")}
                                className="border border-white/70 px-7 py-4 rounded-xl font-semibold flex items-center gap-2 hover:bg-white hover:text-teal-700 transition"
                            >
                                Browse Products
                                <FiArrowRight />
                            </button>
                        </div>

                        {/* Trust indicators */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8">
                            {TRUST_ITEMS.map((item, i) => (
                                <span key={i} className="flex items-center gap-1.5 text-sm text-white/80">
                                    <span className="text-emerald-300">{item.icon}</span>
                                    {item.label}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="hidden lg:flex justify-center items-center">
                        <img
                            src="/hero-tech.png"
                            alt="Tech Accessories"
                            className="w-[440px] rounded-2xl shadow-2xl shadow-black/20"
                            style={{
                                animation: "float 4s ease-in-out infinite",
                            }}
                        />
                    </div>

                </div>

            </div>

            {/* Float animation */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-14px); }
                }
            `}</style>

        </section>
    );
};

export default Hero;