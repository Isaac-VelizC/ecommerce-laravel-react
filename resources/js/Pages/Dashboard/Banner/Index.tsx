import Breadcrumb from "@/Components/Dashboard/Breadcrumb";
import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import PrimaryButton from "@/Components/Dashboard/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Dashboard/Buttons/SecondaryButton";
import DataTableComponent from "@/Components/Dashboard/DataTable";
import { IconEdit, IconTrash } from "@/Components/IconSvg";
import Modal from "@/Components/Modal";
import PreviewImage from "@/Components/PreviewImage";
import { BannerInterface } from "@/Interfaces/Banner";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

type Props = {
    banners: {
        data: BannerInterface[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function Banner({ banners }: Props) {
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [selectBanner, setSelectBanner] = useState<BannerInterface | null>();
    const [bannerList, setBannerList] = useState<BannerInterface[]>(
        banners.data
    );
    const [isOpen, setIsOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const columns = useMemo(
        () => [
            {
                name: "Titulo",
                cell: (row: BannerInterface) => row.title,
                sortable: true,
            },
            {
                name: "Imagen",
                cell: (row: BannerInterface) => (
                    <img
                        onClick={() => openModal(row.photo!)}
                        src={row.photo!}
                        alt={row.title}
                        className="w-32 h-20 object-cover rounded-lg shadow transition-transform duration-300 ease-in-out hover:scale-150 hover:z-[99]"
                    />
                ),
            },
            {
                name: "Slug",
                cell: (row: BannerInterface) => row.slug,
            },
            {
                name: "Estado",
                cell: (row: BannerInterface) => (
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
                cell: (row: BannerInterface) => (
                    <div className="flex gap-4">
                        <IconEdit
                            color="black"
                            size={16}
                            event={() =>
                                router.get(route("banner.edit", row.id))
                            }
                        />
                        <IconTrash
                            color="black"
                            size={16}
                            event={() => handleDeleteBanner(row)}
                        />
                    </div>
                ),
                ignoreRowClick: true,
                width: "120px",
            },
        ],
        [bannerList]
    );

    const openModal = (url: string) => {
        setImageUrl(url);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleDeleteBanner = (row: BannerInterface) => {
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

    const handlePageChange = (page: number) => {
        router.get(route("banner.index"), { page: page });
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
                            <PrimaryButton
                                onClick={() =>
                                    router.get(route("banner.create"))
                                }
                            >
                                Nuevo
                            </PrimaryButton>
                        }
                        current_page={banners.current_page}
                        last_page={banners.last_page}
                        per_page={banners.per_page}
                        total={banners.total}
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
            <PreviewImage
                imageUrl={imageUrl}
                isOpen={isOpen}
                onClose={closeModal}
            />
        </Authenticated>
    );
}
