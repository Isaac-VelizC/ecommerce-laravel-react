import Breadcrumb from "@/Components/Dashboard/Breadcrumb";
import IconButton from "@/Components/Dashboard/Buttons/IconButton";
import DataTableComponent from "@/Components/Dashboard/DataTable";
import { IconTrash } from "@/Components/IconSvg";
import { OrderInterface } from "@/Interfaces/Order";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import React, { useMemo, useState } from "react";

type Props = {
    orders: {
        data: OrderInterface[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function Index({ orders }: Props) {
    const [ordersList, setOrdersList] = useState<OrderInterface[]>(orders.data);
    const columns = useMemo(
        () => [
            {
                name: "S.N.",
                cell: (row: OrderInterface) => row.id,
                width: '70px'
            },
            {
                name: "N. Orden",
                cell: (row: OrderInterface) => row.order_number,
            },
            {
                name: "nombre",
                cell: (row: OrderInterface) =>
                    row.first_name + " " + row.last_name,
            },
            {
                name: "E-mail",
                cell: (row: OrderInterface) => row.email,
            },
            {
                name: "Cantidad",
                cell: (row: OrderInterface) => row.quantity,
                width: '100px'
            },
            {
                name: "Envio",
                cell: (row: OrderInterface) => `$${parseInt(row.shipping.price).toFixed(2)}` ,
                width: '100px'
            },
            {
                name: "Monto Total",
                cell: (row: OrderInterface) => `$${row.total_amount.toFixed(2)}`,
                width: '120px'
            },
            {
                name: "Estado",
                cell: (row: OrderInterface) => (
                    <div className="badges">
                        <button
                            className={
                                row.status === "inactive" ? "red" : "green"
                            }
                        >
                            {row.status}
                        </button>
                    </div>
                ),
                width: '100px'
            },
            {
                name: "Acciones",
                cell: (row: OrderInterface) => (
                    <>
                        <IconButton
                            event={() => modalDeleteOpen(row.id)}
                            color="bg-red-700"
                            icon={<IconTrash />}
                        />
                        <IconButton
                            event={() => router.get(route('order.show', row.id))}
                            color="bg-yellow-700"
                            icon={<IconTrash />}
                        />
                    </>
                ),
                ignoreRowClick: true,
                width: '100px'
            },
        ],
        [ordersList]
    );

    const modalDeleteOpen = (id: number) => {};
    const handlePageChange = (page: number) => {
        // Usa Inertia para navegar a la nueva página
        router.get(route("product.index"), { page: page });
    };

    return (
        <Authenticated>
            <Head title="Order" />
            <Breadcrumb pageName="Pedidos" />
            <div className="mx-auto max-w-7xl">
                <div className="shadow rounded-2xl sm:p-4 bg-gray-500/10">
                    <DataTableComponent
                        columns={columns}
                        data={ordersList}
                        current_page={orders.current_page}
                        last_page={orders.last_page}
                        per_page={orders.per_page}
                        total={orders.total}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </Authenticated>
    );
}
