import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import axios from "axios";

type Product = {
    name: string;
    total_sold: number;
};

const TopProductsChart = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        handleTopProducts();
    }, []);

    const handleTopProducts = async () => {
        await axios
            .get("/api/top-products")
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching top products:", error);
            });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Productos Más Vendidos</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={products} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="total_sold" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TopProductsChart;
