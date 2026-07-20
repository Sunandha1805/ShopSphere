import Hero from "../components/home/Hero";
import CategorySection from "../components/home/CategorySection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import FeaturesSection from "../components/home/FeaturesSection";
import TrustedBrands from "../components/home/TrustedBrands";

const Home = () => {
    return (
        <>
            <Hero />
            <CategorySection />
            <FeaturedProducts />
            <FeaturesSection />
            <TrustedBrands />
        </>
    );
};

export default Home;