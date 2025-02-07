import Breadcrumb from "@/Components/Dashboard/Breadcrumb";
import IconButton from "@/Components/Dashboard/Buttons/IconButton";
import PrimaryButton from "@/Components/Dashboard/Buttons/PrimaryButton";
import DataTableComponent from "@/Components/Dashboard/DataTable";
import { IconEdit, IconTrash } from "@/Components/IconSvg";
import PreviewImage from "@/Components/PreviewImage";
import { ProductInterface } from "@/Interfaces/Product";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import React, { useMemo, useState } from "react";

type Props = {
    products: {
        data: ProductInterface[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function Product({ products }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const openModal = (url: string) => {
        setImageUrl(url);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const columns = useMemo(
        () => [
            {
                name: "Titulo",
                cell: (row: ProductInterface) => row.title,
                sortable: true,
            },
            {
                name: "Slug",
                cell: (row: ProductInterface) => row.slug,
            },
            {
                name: "Stock",
                cell: (row: ProductInterface) => row.stock,
                sortable: true,
            },
            {
                name: "Precio",
                cell: (row: ProductInterface) => row.price,
            },
            {
                name: "Descuento",
                cell: (row: ProductInterface) => row.discount,
            },

            {
                name: "Categoria",
                cell: (row: ProductInterface) => row.cat_info.title,
                sortable: true,
            },
            {
                name: "Marca",
                cell: (row: ProductInterface) =>
                    row.brand ? row.brand.title : "Unidefined",
                sortable: true,
            },
            {
                name: "Imagen",
                cell: (row: ProductInterface) => (
                    <img
                        onClick={() => openModal(row.photo)}
                        src={row.photo}
                        alt={row.title}
                        className="w-32 h-20 object-cover rounded-lg shadow transition-transform duration-300 ease-in-out hover:scale-150 hover:z-[99]"
                    />
                ),
            },
            {
                name: "Condición",
                cell: (row: ProductInterface) => row.condition,
            },
            {
                name: "Estado",
                cell: (row: ProductInterface) => (
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
                sortable: true,
            },
            {
                name: "Acciones",
                cell: (row: ProductInterface) => (
                    <div className="flex gap-2">
                        <IconButton
                            event={() =>
                                router.get(route("product.edit", row.id))
                            }
                            color="bg-blue-700"
                            icon={<IconEdit />}
                        />
                        <IconButton
                            event={() => modalDeleteOpen(row.id)}
                            color="bg-red-700"
                            icon={<IconTrash />}
                        />
                    </div>
                ),
                ignoreRowClick: true,
            },
        ],
        [products]
    );

    const modalDeleteOpen = (id: number) => {};
    const handlePageChange = (page: number) => {
        // Usa Inertia para navegar a la nueva página
        router.get(route("product.index"), { page: page });
    };

    return (
        <Authenticated>
            <Head title="Product" />
            <Breadcrumb pageName="Productos" />
            <div className="mx-auto max-w-7xl">
                <div className="shadow rounded-2xl sm:p-4 bg-gray-500/10">
                    <DataTableComponent
                        columns={columns}
                        data={products.data}
                        children={
                            <PrimaryButton
                                onClick={() =>
                                    router.get(route("product.create"))
                                }
                            >
                                Nuevo
                            </PrimaryButton>
                        }
                        current_page={products.current_page}
                        last_page={products.last_page}
                        per_page={products.per_page}
                        total={products.total}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
            <PreviewImage
                imageUrl={imageUrl}
                isOpen={isOpen}
                onClose={closeModal}
            />
        </Authenticated>
    );
}
