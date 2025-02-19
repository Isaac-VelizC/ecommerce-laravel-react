import Breadcrumb from "@/Components/Dashboard/Breadcrumb";
import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import SecondaryButton from "@/Components/Dashboard/Buttons/SecondaryButton";
import DataTableComponent from "@/Components/Dashboard/DataTable";
import { IconTrash } from "@/Components/IconSvg";
import Modal from "@/Components/Modal";
import { PostTagInterface } from "@/Interfaces/PostTag";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

type Props = {
    postTags: {
        data: PostTagInterface[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function Index({ postTags }: Props) {
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [selectTag, setSelectTag] = useState<PostTagInterface | null>();
    const [tagList, setTagList] = useState<PostTagInterface[]>(postTags.data);
    const columns = useMemo(
        () => [
            {
                name: "N°",
                cell: (_: PostTagInterface, i: number) => (i = i + 1),
                width: "50px",
            },
            {
                name: "Titulo",
                cell: (row: PostTagInterface) => row.title,
                sortable: true,
            },
            {
                name: "Slug",
                cell: (row: PostTagInterface) => row.slug,
            },
            {
                name: "Estado",
                cell: (row: PostTagInterface) => (
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
                cell: (row: PostTagInterface) => (
                    <IconTrash
                        color="black"
                        size={16}
                        event={() => handleDeleteTag(row)}
                    />
                ),
                ignoreRowClick: true,
                width: "150px",
            },
        ],
        [tagList]
    );

    const handleDeleteTag = (row: PostTagInterface) => {
        setShowModalDelete(true);
        setSelectTag(row);
    };

    const handleDelete = async () => {
        if (selectTag) {
            try {
                const response = await axios.delete(
                    route("post.tags.delete", selectTag.id)
                );
                if (response.data.success) {
                    setTagList(
                        tagList.filter((tag) => tag.id !== selectTag.id)
                    );
                    setShowModalDelete(false);
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error al eliminar la etiqueta: ", error);
            }
        }
    };

    const handleCloseModal = () => {
        setShowModalDelete(false);
        setSelectTag(null);
    };

    const handlePageChange = (page: number) => {
        router.get(route("post.tags.index"), { page: page });
    };

    return (
        <Authenticated>
            <Head title="Etiquetas" />
            <Breadcrumb pageName="Etiquetas de publicación" />
            <div className="mx-auto max-w-7xl">
                <div className="shadow rounded-2xl sm:p-4 bg-gray-500/10">
                    <DataTableComponent
                        columns={columns}
                        data={tagList}
                        current_page={postTags.current_page}
                        last_page={postTags.last_page}
                        per_page={postTags.per_page}
                        total={postTags.total}
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
                    <p className="text-sx text-gray-500">
                        ¿Estás seguro de que deseas eliminar esta etiqueta? Esta
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
        </Authenticated>
    );
}
