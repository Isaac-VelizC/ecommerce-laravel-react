import Breadcrumb from "@/Components/Dashboard/Breadcrumb";
import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import SecondaryButton from "@/Components/Dashboard/Buttons/SecondaryButton";
import DataTableComponent from "@/Components/Dashboard/DataTable";
import { IconTrash } from "@/Components/IconSvg";
import Modal from "@/Components/Modal";
import { ProductReviewInterface } from "@/Interfaces/ProducReview";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

type Props = {
    reviews: {
        data: ProductReviewInterface[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function Index({ reviews }: Props) {
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [selectReview, setSelectReview] = useState<number | null>();
    const [reviewList, setreviewList] = useState<ProductReviewInterface[]>(
        reviews.data
    );
    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={`fa fa-star ${
                        i <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                ></i>
            );
        }
        return stars;
    };

    const columns = useMemo(
        () => [
            {
                name: "S.N.",
                cell: (row: ProductReviewInterface) => row.id,
                width: "60px",
            },
            {
                name: "Reseña Por",
                cell: (row: ProductReviewInterface) => row.user_info.name,
            },
            {
                name: "Producto",
                cell: (row: ProductReviewInterface) => row.product.title,
            },
            {
                name: "Reseña",
                cell: (row: ProductReviewInterface) => row.review,
            },
            {
                name: "Estrellas",
                cell: (row: ProductReviewInterface) => renderStars(row.rate),
                width: "100px",
            },
            {
                name: "Fecha",
                cell: (row: ProductReviewInterface) => row.created_at,
            },
            {
                name: "Estado",
                cell: (row: ProductReviewInterface) => (
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
                width: "100px",
            },
            {
                name: "Acciones",
                cell: (row: ProductReviewInterface) => (
                    <IconTrash
                        color="black"
                        size={16}
                        event={() => handleDeleteBanner(row.id)}
                    />
                ),
                ignoreRowClick: true,

                width: "100px",
            },
        ],
        [reviewList]
    );

    const handleDeleteBanner = (id: number) => {
        setShowModalDelete(true);
        setSelectReview(id);
    };

    const handleDelete = async () => {
        if (reviewList) {
            try {
                const response = await axios.delete(
                    route("review.delete", reviewList)
                );
                if (response.data.success) {
                    setreviewList(
                        reviewList.filter((item) => item.id !== selectReview)
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
        setSelectReview(null);
    };

    const handlePageChange = (page: number) => {
        router.get(route("shipping.index"), { page: page });
    };

    return (
        <Authenticated>
            <Head title="Reviews" />
            <Breadcrumb pageName="Reseñas" />
            <div className="mx-auto max-w-7xl">
                <div className="shadow rounded-2xl sm:p-4 bg-gray-500/10">
                    <DataTableComponent
                        columns={columns}
                        data={reviewList}
                        current_page={reviews.current_page}
                        last_page={reviews.last_page}
                        per_page={reviews.per_page}
                        total={reviews.total}
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
                        ¿Estás seguro de que deseas eliminar esta reseña? Esta
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
