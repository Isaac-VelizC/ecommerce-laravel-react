import CardCount from "@/Components/Dashboard/CardCount";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { usePage } from "@inertiajs/react";
import Card from "@/Components/Dashboard/Card";
import SalesChart from "@/Components/Dashboard/Charts/SalesChart";
import TopProductsChart from "@/Components/Dashboard/Charts/TopProductsChart";

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF4567",
    "#19FFA6",
];

export default function Dashboard() {
    const { users } = usePage().props as unknown as {
        users: { day_name: string; count: number }[];
    };
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [totalCategories, setTotalCategories] = useState<number>(0);
    const [totalUsersActives, setTotalUsersActives] = useState<number>(0);
    const [totalOrders, setTotalOrders] = useState<number>(0);

    useEffect(() => {
        const fetchTotals = async () => {
            try {
                const response = await axios.get("/dashboard/totals");
                setTotalProducts(response.data.totalProducts);
                setTotalCategories(response.data.totalCategories);
                setTotalUsersActives(response.data.totalUsersActives);
                setTotalOrders(response.data.totalOrders);
            } catch (error) {
                console.error("Error fetching totals:", error);
            }
        };

        fetchTotals();
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <CardCount
                    icon={<i className="fa fa-box w-6 h-6" />}
                    value={totalProducts}
                    label="Total Productos"
                    variant="default"
                />
                <CardCount
                    icon={<i className="fa fa-tags w-6 h-6" />}
                    value={totalCategories}
                    label="Categorías"
                    variant="success"
                />
                <CardCount
                    icon={<i className="fa fa-users w-6 h-6" />}
                    value={totalUsersActives}
                    label="Usuarios Activos"
                    variant="warning"
                />
                <CardCount
                    icon={<i className="fa fa-shopping-cart w-6 h-6" />}
                    value={totalOrders}
                    label="Pedidos Pendientes"
                    variant="danger"
                />
            </div>

            <div className="py-12">
                <div className="grid grid-cols-12 lg:gap-4">
                    <Card className="col-span-12 lg:col-span-8">
                        <SalesChart />
                    </Card>
                    <Card className="col-span-12 lg:col-span-4">
                        <h4 className="text-base font-semibold">
                            Registrados los ultimos 7 dias
                        </h4>
                        <div className="flex justify-center">
                            <PieChart width={400} height={400}>
                                <Pie
                                    data={users}
                                    dataKey="count"
                                    nameKey="day_name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={150}
                                    fill="#8884d8"
                                    label
                                >
                                    {users.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </div>
                    </Card>
                </div>
                <div className="">
                    <TopProductsChart />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
