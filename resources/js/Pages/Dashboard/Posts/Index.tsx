import Breadcrumb from "@/Components/Dashboard/Breadcrumb";
import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import IconButton from "@/Components/Dashboard/Buttons/IconButton";
import PrimaryButton from "@/Components/Dashboard/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Dashboard/Buttons/SecondaryButton";
import DataTableComponent from "@/Components/Dashboard/DataTable";
import { IconEdit, IconTrash } from "@/Components/IconSvg";
import Modal from "@/Components/Modal";
import PreviewImage from "@/Components/PreviewImage";
import { PostInterface } from "@/Interfaces/Post";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

type Props = {
    posts: {
        data: PostInterface[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function Index({ posts }: Props) {
    const CLOUD_NAME = "dcvaqzmt9";
    //const UPLOAD_PRESET = "ecommerce-laravel-react";
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [selectPost, setSelectPost] = useState<PostInterface | null>();
    const [postsList, setPostsList] = useState<PostInterface[]>(posts.data);
    const [isOpen, setIsOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const columns = useMemo(
        () => [
            {
                name: "Titulo",
                cell: (row: PostInterface) => row.title,
                sortable: true,
            },
            {
                name: "Categoria",
                cell: (row: PostInterface) => row.cat_info.title,
                sortable: true,
            },
            {
                name: "Etiqueta",
                cell: (row: PostInterface) => row.tags,
                sortable: true,
            },
            {
                name: "Autor",
                cell: (row: PostInterface) => row.author_info.name,
                sortable: true,
            },
            {
                name: "Imagen",
                cell: (row: PostInterface) => (
                    <img
                        onClick={() => openModal(row.photo)}
                        src={
                            row.photo ??
                            "https://cdn-icons-png.flaticon.com/512/13434/13434972.png"
                        }
                        alt={row.title}
                        className="w-20 h-20 object-cover rounded-lg shadow transition-transform duration-300 ease-in-out hover:scale-150 hover:z-[99]"
                    />
                ),
            },
            {
                name: "Estado",
                cell: (row: PostInterface) => (
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
                cell: (row: PostInterface) => (
                    <div className="flex gap-2">
                        <IconButton
                            event={() => router.get(route("post.edit", row.id))}
                            color="bg-blue-700"
                            icon={<IconEdit />}
                        />
                        <IconButton
                            event={() => handleDeletePost(row)}
                            color="bg-red-700"
                            icon={<IconTrash />}
                        />
                    </div>
                ),
                ignoreRowClick: true,
            },
        ],
        [postsList]
    );

    const openModal = (url: string) => {
        setImageUrl(url);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleDeletePost = (row: PostInterface) => {
        setShowModalDelete(true);
        setSelectPost(row);
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
        if (selectPost) {
            try {
                const response = await axios.delete(
                    route("post.delete", selectPost.id)
                );
                if (response.data.success) {
                    if (selectPost.photo) {
                        const publicId = selectPost.photo
                            .split("/")
                            .pop()
                            ?.split(".")[0];
                        await deleteImageFromCloudinary(publicId || "");
                    }
                    setPostsList(
                        postsList.filter((post) => post.id !== selectPost.id)
                    );
                    setShowModalDelete(false);
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error al eliminar la publicación: ", error);
            }
        }
    };

    const handleCloseModal = () => {
        setShowModalDelete(false);
        setSelectPost(null);
    };

    const handlePageChange = (page: number) => {
        router.get(route("post.index"), { page: page });
    };

    return (
        <Authenticated>
            <Head title="Posts" />
            <Breadcrumb pageName="Publicaciones" />
            <div className="mx-auto max-w-7xl">
                <div className="shadow rounded-2xl sm:p-4 bg-gray-500/10">
                    <DataTableComponent
                        columns={columns}
                        data={postsList}
                        children={
                            <PrimaryButton
                                onClick={() => router.get(route("post.create"))}
                            >
                                Nuevo
                            </PrimaryButton>
                        }
                        current_page={posts.current_page}
                        last_page={posts.last_page}
                        per_page={posts.per_page}
                        total={posts.total}
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
                        ¿Estás seguro de que deseas eliminar esta publicación?
                        Esta acción no se puede deshacer.
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
