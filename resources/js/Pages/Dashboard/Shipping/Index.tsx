import Breadcrumb from '@/Components/Dashboard/Breadcrumb'
import DangerButton from '@/Components/Dashboard/Buttons/DangerButton'
import IconButton from '@/Components/Dashboard/Buttons/IconButton'
import PrimaryButton from '@/Components/Dashboard/Buttons/PrimaryButton'
import SecondaryButton from '@/Components/Dashboard/Buttons/SecondaryButton'
import DataTableComponent from '@/Components/Dashboard/DataTable'
import { IconEdit, IconTrash } from '@/Components/IconSvg'
import Modal from '@/Components/Modal'
import { ShippingInterface } from '@/Interfaces/Shipping'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
import axios from 'axios'
import React, { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

type Props = {
    shippings: ShippingInterface[];
}

export default function Index({ shippings }: Props) {
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [selectBanner, setSelectBanner] = useState<ShippingInterface | null>();
    const [bannerList, setBannerList] = useState<ShippingInterface[]>(shippings);

    const columns = useMemo(
        () => [
            {
                name: "Titulo",
                cell: (row: ShippingInterface) => row.type,
                sortable: true,
            },
            {
                name: "Slug",
                cell: (row: ShippingInterface) => row.price,
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
                                router.get(route("banner.edit", row.id))
                            }
                            color="bg-blue-700"
                            icon={<IconEdit />}
                        />
                        <IconButton
                            event={() => handleDeleteBanner(row)}
                            color="bg-red-700"
                            icon={<IconTrash />}
                        />
                    </div>
                ),
                ignoreRowClick: true,
            },
        ],
        [bannerList]
    );
    const handleDeleteBanner = (row: ShippingInterface) => {
        setShowModalDelete(true);
        setSelectBanner(row);
    };

    const handleDelete = async () => {
        if (selectBanner) {
            try {
                const response = await axios.delete(
                    route("banner.delete", selectBanner.id)
                );
                if (response.data.success) {
                    setBannerList(
                        bannerList.filter(
                            (banner) => banner.id !== selectBanner.id
                        )
                    );
                    setShowModalDelete(false);
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error al eliminar el banner: ", error);
            }
        }
    };

    const handleCloseModal = () => {
        setShowModalDelete(false);
        setSelectBanner(null);
    };

  return (
    <Authenticated>
            <Head title="Banners" />
            <Breadcrumb pageName="Banner" />
            <div className="mx-auto max-w-7xl">
                <div className="shadow rounded-2xl sm:p-4 bg-gray-500/10">
                    <DataTableComponent
                        columns={columns}
                        data={bannerList}
                        children={
                            <PrimaryButton onClick={() => router.get(route("banner.create"))}>Nuevo</PrimaryButton>
                        }
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
                        ¿Estás seguro de que deseas eliminar este banner? Esta
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
  )
}