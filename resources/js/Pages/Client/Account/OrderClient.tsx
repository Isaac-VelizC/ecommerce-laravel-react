import { OrderInterface } from "@/Interfaces/Order";
import AccountLayout from "@/Layouts/AccountLayout";
import React, { useState } from "react";

type Props = {
    orders: {
        data: OrderInterface[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function OrderClient({ orders }: Props) {
    const [listOrders, setListOrders] = useState(orders.data);
    return (
        <AccountLayout>
            <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                Pedidos
            </div>
        </AccountLayout>
    );
}
