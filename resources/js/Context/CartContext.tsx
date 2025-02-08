import { CartInterface } from "@/Interfaces/Cart";
import React, { createContext, useContext, useState } from "react";

// Definir el contexto
interface CartContextType {
    cart: CartInterface[];
    setCart: React.Dispatch<React.SetStateAction<CartInterface[]>>;
}

// Crear contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook para usar el contexto
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart debe ser usado dentro de un CartProvider");
    }
    return context;
};

// Proveedor del carrito
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartInterface[]>([]);

    return (
        <CartContext.Provider value={{ cart, setCart }}>
            {children}
        </CartContext.Provider>
    );
};
