import {
    FiTruck,
    FiShield,
    FiRefreshCw,
    FiAward,
} from "react-icons/fi";

const features = [
    {
        id: 1,
        icon: <FiTruck size={36} />,
        title: "Fast Delivery",
        description:
            "Quick and reliable delivery across India with real-time order tracking.",
    },
    {
        id: 2,
        icon: <FiShield size={36} />,
        title: "Secure Payments",
        description:
            "Shop confidently with secure payment options and encrypted transactions.",
    },
    {
        id: 3,
        icon: <FiAward size={36} />,
        title: "Premium Quality",
        description:
            "Carefully selected electronics and accessories from trusted brands.",
    },
    {
        id: 4,
        icon: <FiRefreshCw size={36} />,
        title: "Easy Returns",
        description:
            "Simple return and refund process to ensure a hassle-free shopping experience.",
    },
];

const FeaturesSection = () => {
    return (
        <section className="py-20">

            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-14">

                    <h2 className="text-4xl font-bold text-gray-900">
                        Why Choose ShopSphere?
                    </h2>

                    <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
                        We make online shopping simple, secure, and convenient,
                        offering high-quality products backed by reliable service.
                    </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {features.map((feature) => (

                        <div
                            key={feature.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center hover:-translate-y-2 hover:shadow-lg transition-all duration-300"
                        >

                            <div className="w-16 h-16 mx-auto rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900">
                                {feature.title}
                            </h3>

                            <p className="mt-3 text-gray-500 leading-7">
                                {feature.description}
                            </p>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
};

export default FeaturesSection;