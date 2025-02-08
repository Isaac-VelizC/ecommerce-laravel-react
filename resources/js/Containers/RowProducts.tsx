import React from "react";
import ProductCard from "@/Components/Client/ProductCard";
import { ProductInterface } from "@/Interfaces/Product";

type Props = {
    products: ProductInterface[];
};

const RowProducts: React.FC<Props> = ({ products }) => {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, index) => (
                <ProductCard key={index} product={product} />
            ))}
        </section>
    );
};

export default RowProducts;
