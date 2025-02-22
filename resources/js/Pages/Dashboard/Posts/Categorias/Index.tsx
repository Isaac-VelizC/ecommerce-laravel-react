import Breadcrumb from "@/Components/Dashboard/Breadcrumb";
import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import SecondaryButton from "@/Components/Dashboard/Buttons/SecondaryButton";
import DataTableComponent from "@/Components/Dashboard/DataTable";
import { IconEdit, IconTrash } from "@/Components/IconSvg";
import Modal from "@/Components/Modal";
import { PostCategoryInterface } from "@/Interfaces/PostCategory";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import ModalCategory from "./ModalCategory";

type Props = {
    postCategories: {
        data: PostCategoryInterface[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function Index({ postCategories }: Props) {
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [selectCategoryPost, setSelectCategoryPost] =
        useState<PostCategoryInterface | null>();
    const [categoryPostList, setCategoryPostList] = useState<
        PostCategoryInterface[]
    >(postCategories.data);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const columns = useMemo(
        () => [
            {
                name: "N°",
                cell: (_: PostCategoryInterface, i: number) => (i = i + 1),
                width: "50px",
            },
            {
                name: "Titulo",
                cell: (row: PostCategoryInterface) => row.title,
                sortable: true,
            },
            {
                name: "Slug",
                cell: (row: PostCategoryInterface) => row.slug,
            },
            {
                name: "Estado",
                cell: (row: PostCategoryInterface) => (
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
                cell: (row: PostCategoryInterface) => (
                    <div className="flex gap-4">
                        <IconEdit
                            color="black"
                            size={16}
                            event={() => handleEditarCategory(row)}
                        />
                        <IconTrash
                            color="black"
                            size={16}
                            event={() => handleDeleteCategory(row)}
                        />
                    </div>
                ),
                ignoreRowClick: true,
                width: "150px",
            },
        ],
        [categoryPostList]
    );

    const handleDeleteCategory = (row: PostCategoryInterface) => {
        setShowModalDelete(true);
        setSelectCategoryPost(row);
    };

    const handleEditarCategory = (row: PostCategoryInterface) => {
        setShowModalEdit(true);
        setSelectCategoryPost(row);
    };

    const handleDelete = async () => {
        if (selectCategoryPost) {
            try {
                const response = await axios.delete(
                    route("post.categories.delete", selectCategoryPost.id)
                );
                if (response.data.success) {
                    setCategoryPostList(
                        categoryPostList.filter(
                            (cat) => cat.id !== selectCategoryPost.id
                        )
                    );
                    setShowModalDelete(false);
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error al eliminar la categoria: ", error);
            }
        }
    };

    const handleCloseModal = () => {
        setShowModalDelete(false);
        setShowModalEdit(false);
        setSelectCategoryPost(null);
    };

    const handleCategoryAdded = (updatedCategory: PostCategoryInterface) => {
        setCategoryPostList(
            categoryPostList.map((item) => {
                if (item.id === updatedCategory.id) {
                    return updatedCategory;
                }
                return item;
            })
        );
    };

    const handlePageChange = (page: number) => {
        router.get(route("post.categories.index"), { page: page });
    };

    const breadcrumbLinks = [
        { href: route("post.categories.index"), label: "Categorias" },
    ];

    return (
        <Authenticated>
            <Head title="Categoiras" />
            <Breadcrumb pageName="Posts Categorias" links={breadcrumbLinks}/>
            <div className="mx-auto max-w-7xl">
                <div className="shadow rounded-2xl sm:p-4 bg-gray-500/10">
                    <DataTableComponent
                        columns={columns}
                        data={categoryPostList}
                        current_page={postCategories.current_page}
                        last_page={postCategories.last_page}
                        per_page={postCategories.per_page}
                        total={postCategories.total}
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
                        ¿Estás seguro de que deseas eliminar este Categoria?
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
            <ModalCategory
                show={showModalEdit}
                closeModal={handleCloseModal}
                categoria={selectCategoryPost}
                onCategoryAdded={handleCategoryAdded}
            />
        </Authenticated>
    );
}
