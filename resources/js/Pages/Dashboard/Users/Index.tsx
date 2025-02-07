import Breadcrumb from "@/Components/Dashboard/Breadcrumb";
import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import IconButton from "@/Components/Dashboard/Buttons/IconButton";
import PrimaryButton from "@/Components/Dashboard/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Dashboard/Buttons/SecondaryButton";
import DataTableComponent from "@/Components/Dashboard/DataTable";
import { IconEdit, IconTrash } from "@/Components/IconSvg";
import Modal from "@/Components/Modal";
import PreviewImage from "@/Components/PreviewImage";
import { UserInterface } from "@/Interfaces/User";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

type Props = {
    users: {
            data: UserInterface[];
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
};

export default function Index({ users }: Props) {
    const CLOUD_NAME = "dcvaqzmt9";
    const UPLOAD_PRESET = "ecommerce-laravel-react";
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [selectUser, setSelectUser] = useState<UserInterface | null>();
    const [userList, setUserList] = useState<UserInterface[]>(users.data);
    const [isOpen, setIsOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const columns = useMemo(
        () => [
            {
                name: "Perfil",
                cell: (row: UserInterface) => (
                    <img
                        onClick={() => openModal(row.photo)}
                        src={row.photo}
                        alt={row.name}
                        className="w-12 h-12 p-1 rounded-full object-cover shadow transition-transform duration-300 ease-in-out hover:scale-150 hover:z-[99]"
                    />
                ),
                width: "80px"
            },
            {
                name: "Nombre de usuario",
                cell: (row: UserInterface) => row.name,
                sortable: true,
            },
            {
                name: "E-mail",
                cell: (row: UserInterface) => row.email,
            },

            {
                name: "Rol",
                cell: (row: UserInterface) => row.role,
            },
            {
                name: "Estado",
                cell: (row: UserInterface) => (
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
                cell: (row: UserInterface) => (
                    <div className="flex gap-2">
                        <IconButton
                            event={() => router.get(route("user.edit", row.id))}
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
        [userList]
    );

    const openModal = (url: string) => {
        setImageUrl(url);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleDeleteBanner = (row: UserInterface) => {
        setShowModalDelete(true);
        setSelectUser(row);
    };

    const deleteImageFromCloudinary = async (publicId: string) => {
        try {
            await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/delete_by_token`,
                { public_id: publicId }
            );
            console.log("Imagen eliminada correctamente");
        } catch (error) {
            console.error("Error al eliminar la imagen:", error);
        }
    };

    const handleDelete = async () => {
        if (selectUser) {
            try {
                const response = await axios.delete(
                    route("banner.delete", selectUser.id)
                );
                if (response.data.success) {
                    if (selectUser.photo) {
                        const publicId = selectUser.photo
                            .split("/")
                            .pop()
                            ?.split(".")[0];
                        await deleteImageFromCloudinary(publicId || "");
                    }
                    setUserList(
                        userList.filter((item) => item.id !== selectUser.id)
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
        setSelectUser(null);
    };

    const handlePageChange = (page: number) => {
        router.get(route("user.index"), { page: page });
    };

    return (
        <Authenticated>
            <Head title="Usuarios" />
            <Breadcrumb pageName="Usuarios" />
            <div className="mx-auto max-w-7xl">
                <div className="shadow rounded-2xl sm:p-4 bg-gray-500/10">
                    <DataTableComponent
                        columns={columns}
                        data={userList}
                        children={
                            <PrimaryButton
                                onClick={() => router.get(route("user.create"))}
                            >
                                Nuevo
                            </PrimaryButton>
                        }
                        current_page={users.current_page}
                        last_page={users.last_page}
                        per_page={users.per_page}
                        total={users.total}
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
                        <SecondaryButton onClick={handleCloseModal}>
                            Cancelar
                        </SecondaryButton>
                        <DangerButton onClick={handleDelete}>
                            Eliminar
                        </DangerButton>
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
