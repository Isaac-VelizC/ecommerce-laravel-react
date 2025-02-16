import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import axios from "axios";

const SalesChart = () => {
    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        handlesSalesData();
    }, []);
    
    const handlesSalesData = async () => {
        const response = await axios.get("/api/sales-data");
        setSalesData(response.data);
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">
                Ventas de los Últimos 7 Días
            </h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="total_sales"
                        stroke="#8884d8"
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesChart;
