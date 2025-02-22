import Breadcrumb from "@/Components/Dashboard/Breadcrumb";
import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import PrimaryButton from "@/Components/Dashboard/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Dashboard/Buttons/SecondaryButton";
import DataTableComponent from "@/Components/Dashboard/DataTable";
import { IconEdit, IconTrash } from "@/Components/IconSvg";
import Modal from "@/Components/Modal";
import { CouponInterface } from "@/Interfaces/Coupon";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

type Props = {
    coupons: {
        data: CouponInterface[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function Coupon({ coupons }: Props) {
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [selectCoupon, setSelectCoupon] = useState<CouponInterface | null>();
    const [couponList, setCouponList] = useState<CouponInterface[]>(
        coupons.data
    );
    const columns = useMemo(
        () => [
            {
                name: "Codigo",
                cell: (row: CouponInterface) => row.code,
                sortable: true,
            },
            {
                name: "Tipo",
                cell: (row: CouponInterface) => row.type,
            },

            {
                name: "Valor",
                cell: (row: CouponInterface) => row.value,
            },
            {
                name: "Estado",
                cell: (row: CouponInterface) => (
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
                cell: (row: CouponInterface) => (
                    <div className="flex gap-4">
                        <IconEdit
                            color="black"
                            size={16}
                            event={() =>
                                router.get(route("coupon.edit", row.id))
                            }
                        />
                        <IconTrash
                            color="black"
                            size={16}
                            event={() => handleDeleteCoupon(row)}
                        />
                    </div>
                ),
                ignoreRowClick: true,
            },
        ],
        [couponList]
    );

    const handleDeleteCoupon = (row: CouponInterface) => {
        setShowModalDelete(true);
        setSelectCoupon(row);
    };

    const handleDelete = async () => {
        if (selectCoupon) {
            try {
                const response = await axios.delete(
                    route("coupon.delete", selectCoupon.id)
                );
                if (response.data.success) {
                    setCouponList(
                        couponList.filter((item) => item.id !== selectCoupon.id)
                    );
                    setShowModalDelete(false);
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error al eliminar el Cupón: ", error);
            }
        }
    };

    const handleCloseModal = () => {
        setShowModalDelete(false);
        setSelectCoupon(null);
    };

    const handlePageChange = (page: number) => {
        router.get(route("coupon.index"), { page: page });
    };

    const breadcrumbLinks = [
        { href: route('coupon.index'), label: "Lista cupones" },
    ];

    return (
        <Authenticated>
            <Head title="Cupones" />
            <Breadcrumb pageName="Cupón" links={breadcrumbLinks}/>
            <div className="mx-auto max-w-7xl">
                <div className="shadow rounded-2xl sm:p-4 bg-gray-500/10">
                    <DataTableComponent
                        columns={columns}
                        data={couponList}
                        children={
                            <PrimaryButton
                                onClick={() =>
                                    router.get(route("coupon.create"))
                                }
                            >
                                Nuevo
                            </PrimaryButton>
                        }
                        current_page={coupons.current_page}
                        last_page={coupons.last_page}
                        per_page={coupons.per_page}
                        total={coupons.total}
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
                        ¿Estás seguro de que deseas eliminar el cupón? Esta
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
