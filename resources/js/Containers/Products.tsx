import React, { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/Components/Client/ProductCard";
import { ProductInterface } from "@/Interfaces/Product";
import { CategoryInterface } from "@/Interfaces/Category";

type Props = {
    products: ProductInterface[];
    categorias: CategoryInterface[];
};

const Products: React.FC<Props> = ({ products, categorias }) => {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    // Filtrar productos por categoría seleccionada
    const filteredProducts = selectedCategory
        ? products.filter((product) => product.cat_id === selectedCategory)
        : products;

    // Variantes para la animación de la lista de productos
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }, // Retraso entre cada carta
        },
    };

    // Variantes para cada tarjeta de producto
    const cardVariants = {
        hidden: { opacity: 0, y: 50, rotate: -5, scale: 0.8 }, // Sale desde abajo con leve rotación
        visible: {
            opacity: 1,
            y: 0,
            rotate: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 100, damping: 10 },
        },
    };

    return (
        <section className="product pt-[60px] pb-[50px]">
            <div className="mx-4 sm:mx-10 xl:mx-44">
                <div className="flex flex-wrap mb-[50px]">
                    <div className="w-full lg:w-1/4 md:w-1/3 p-0">
                        <div className="section-title mb-[20px]">
                            <h4 className="text-[20px]">Productos Nuevos</h4>
                        </div>
                    </div>
                    <div className="w-full lg:w-3/4 md:w-2/3 p-0 md:text-right">
                        <ul className="inline-flex">
                            <li
                                className={`cursor-pointer text-[10px] lg:text-lg text-[#111111] mr-3 md:mr-[35px] relative ${
                                    !selectedCategory ? "font-bold border-b-2 border-accent" : ""
                                }`}
                                onClick={() => setSelectedCategory(null)}
                            >
                                Todos
                            </li>
                            {categorias.map((cat, index) => (
                                <li
                                    key={index}
                                    className={`cursor-pointer text-[10px] lg:text-lg text-[#111111] mr-3 md:mr-[35px] relative ${
                                        selectedCategory === cat.id ? "font-bold border-b-2 border-accent" : ""
                                    }`}
                                    onClick={() => setSelectedCategory(cat.id)}
                                >
                                    {cat.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Productos Filtrados con Animación de Cartas */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    key={selectedCategory} // Clave para que se reinicie la animación al cambiar de categoría
                >
                    {filteredProducts.length <= 0 ? (
                        <div className="col-span-4">
                            <p className="text-center">No hay productos en esta categoría</p>
                        </div>
                    ) : (
                        filteredProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                variants={cardVariants} // Aplica la animación de carta
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default Products;
