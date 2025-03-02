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
            <section className="pt-4 pb-20">
                <h1 className="text-2xl font-bold">Historial de Pedidos</h1>
                <div className="flex flex-wrap overflow-x-auto mb-4">
                    <table className="w-full border-collapse">
                        <thead className="border-b border-gray-200">
                            <tr className="text-xs lg:text-base font-medium uppercase text-text">
                                <th className="py-6 px-3 text-left">Product</th>
                                <th className="py-6 px-3 text-center">Price</th>
                                <th className="py-6 px-3 text-center">
                                    Quantity
                                </th>
                                <th className="py-6 px-3 text-center">Total</th>
                                <th className="py-6 px-3"></th>
                            </tr>
                        </thead>

                        <tbody className="text-sm">
                            {listOrders.length <= 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-4 text-center text-gray-500 h-60"
                                    >
                                        Carrito Vacío
                                    </td>
                                </tr>
                            ) : (
                                listOrders.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-gray-200"
                                    >
                                        <td className="py-4 px-2">
                                            <h6 className="text-gray-800">
                                                {item.first_name}
                                            </h6>
                                        </td>
                                        <td className="py-4 px-2 text-center text-red-600 font-semibold">
                                            ${item.total_amount}{" "}
                                        </td>
                                        <td className="py-4 px-2 text-center">
                                                67
                                        </td>
                                        <td className="py-4 px-2 text-center font-semibold text-red-600">
                                            ${item.quantity}
                                        </td>
                                        <td className="py-4 px-2 text-center">
                                            <span className="h-5 md:h-10 w-5 md:w-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center cursor-pointer">
                                                x
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </AccountLayout>
    );
}
