import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getCart } from "../services/cartService";
import { getWishlist } from "../services/wishlistService";
import { useAuth } from "./AuthContext";

const CartWishlistContext = createContext();

export const CartWishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [wishlistItems, setWishlistItems] = useState([]);

    const refreshCounts = useCallback(async () => {
        if (!user) {
            setCartCount(0);
            setWishlistCount(0);
            setWishlistItems([]);
            return;
        }
        try {
            const [cartData, wishlistData] = await Promise.all([
                getCart(),
                getWishlist(),
            ]);
            setCartCount(cartData.data?.items?.length ?? 0);
            setWishlistCount(wishlistData.data?.items?.length ?? 0);
            
            // Extract product IDs for the wishlist
            const items = wishlistData.data?.items || [];
            setWishlistItems(items.map(item => item.product_id));
        } catch {
            // silently fail — user may not be logged in yet
        }
    }, [user]);

    useEffect(() => {
        refreshCounts();
    }, [refreshCounts]);

    return (
        <CartWishlistContext.Provider value={{ cartCount, wishlistCount, wishlistItems, refreshCounts }}>
            {children}
        </CartWishlistContext.Provider>
    );
};

export const useCartWishlist = () => useContext(CartWishlistContext);
