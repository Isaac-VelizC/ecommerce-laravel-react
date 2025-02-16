import Breadcrumb from "@/Components/Dashboard/Breadcrumb";
import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import IconButton from "@/Components/Dashboard/Buttons/IconButton";
import PrimaryButton from "@/Components/Dashboard/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Dashboard/Buttons/SecondaryButton";
import DataTableComponent from "@/Components/Dashboard/DataTable";
import { IconEdit, IconTrash } from "@/Components/IconSvg";
import Modal from "@/Components/Modal";
import { ShippingInterface } from "@/Interfaces/Shipping";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

type Props = {
    shippings: {
        data: ShippingInterface[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function Index({ shippings }: Props) {
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [selectShipping, setSelectShipping] = useState<number | null>();
    const [shippingList, setShippingList] = useState<ShippingInterface[]>(shippings.data);

    const columns = useMemo(
        () => [
            {
                name: "Titulo",
                cell: (row: ShippingInterface) => row.type,
                sortable: true,
            },
            {
                name: "Precio",
                cell: (row: ShippingInterface) => {
                    // Formatear el precio a dos decimales y agregar el símbolo de dólar
                    return `$${parseInt(row.price).toFixed(2)}`;
                },
            },            
            {
                name: "Estado",
                cell: (row: ShippingInterface) => (
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
                cell: (row: ShippingInterface) => (
                    <div className="flex gap-2">
                        <IconButton
                            event={() =>
                                router.get(route("shipping.edit", row.id))
                            }
                            color="bg-blue-700"
                            icon={<IconEdit />}
                        />
                        <IconButton
                            event={() => handleDeleteBanner(row.id)}
                            color="bg-red-700"
                            icon={<IconTrash />}
                        />
                    </div>
                ),
                ignoreRowClick: true,
            },
        ],
        [shippingList]
    );

    const handleDeleteBanner = (id: number) => {
        setShowModalDelete(true);
        setSelectShipping(id);
    };

    const handleDelete = async () => {
        if (selectShipping) {
            try {
                const response = await axios.delete(
                    route("shipping.delete", selectShipping)
                );
                if (response.data.success) {
                    setShippingList(
                        shippingList.filter(
                            (item) => item.id !== selectShipping
                        )
                    );
                    setShowModalDelete(false);
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error al eliminar el tipo de envío: ", error);
            }
        }
    };

    const handleCloseModal = () => {
        setShowModalDelete(false);
        setSelectShipping(null);
    };

    const handlePageChange = (page: number) => {
        router.get(route("shipping.index"), { page: page });
    };

    return (
        <Authenticated>
            <Head title="Shippings" />
            <Breadcrumb pageName="Envios" />
            <div className="mx-auto max-w-7xl">
                <div className="shadow rounded-2xl sm:p-4 bg-gray-500/10">
                    <DataTableComponent
                        columns={columns}
                        data={shippingList}
                        children={
                            <PrimaryButton
                                onClick={() =>
                                    router.get(route("shipping.create"))
                                }
                            >
                                Nuevo
                            </PrimaryButton>
                        }
                        current_page={shippings.current_page}
                        last_page={shippings.last_page}
                        per_page={shippings.per_page}
                        total={shippings.total}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
            <Modal
                show={showModalDelete}
                onClose={handleCloseModal}
                maxWidth="sm"
            >
                <div className="p-4">
                    <h2 className="font-semibold text-lg mb-4 text-text">
                        Confirmar Eliminación
                    </h2>
                    <p className="text-sx text-gray-400">
                        ¿Estás seguro de que deseas eliminar este tipo de envio? Esta
                        acción no se puede deshacer.
                    </p>
                    <div className="flex justify-center gap-4 mb-3 mt-5">
                        <DangerButton onClick={handleDelete}>
                            Eliminar
                        </DangerButton>
                        <SecondaryButton onClick={handleCloseModal}>
                            Cancelar
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>
        </Authenticated>
    );
}
