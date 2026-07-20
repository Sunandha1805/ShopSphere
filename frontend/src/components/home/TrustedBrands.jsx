const brands = [
    "boAt",
    "Ambrane",
    "Samsung",
    "Portronics",
    "Noise",
    "Realme",
];

const TrustedBrands = () => {
    return (
        <section className="py-20 bg-gray-50">

            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-12">

                    <h2 className="text-4xl font-bold text-gray-900">
                        Trusted Brands
                    </h2>

                    <p className="mt-3 text-gray-500">
                        Shop products from the most trusted names in consumer electronics.
                    </p>

                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

                    {brands.map((brand) => (

                        <div
                            key={brand}
                            className="
                                bg-white
                                border
                                border-gray-100
                                rounded-2xl
                                py-8
                                flex
                                items-center
                                justify-center
                                font-bold
                                text-xl
                                text-gray-700
                                shadow-sm
                                hover:shadow-lg
                                hover:border-teal-500
                                hover:text-teal-600
                                hover:-translate-y-1
                                transition-all
                                duration-300
                            "
                        >
                            {brand}
                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
};

export default TrustedBrands;