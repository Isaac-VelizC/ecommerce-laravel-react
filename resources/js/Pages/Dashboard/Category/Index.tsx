import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import Breadcrumb from "@/Components/Dashboard/Breadcrumb";
import DataTableComponent from "@/Components/Dashboard/DataTable";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/Dashboard/Buttons/SecondaryButton";
import { CategoryInterface } from "@/Interfaces/Category";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import axios from "axios";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { IconEdit, IconTrash } from "@/Components/IconSvg";
import PrimaryButton from "@/Components/Dashboard/Buttons/PrimaryButton";

type Props = {
    categories: {
        data: CategoryInterface[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function Category({ categories }: Props) {
    const [modalDelete, setModalDelete] = useState(false);
    const [selectId, setselectId] = useState<number | null>();
    const [categoryList, setCategoryList] = useState<CategoryInterface[]>(
        categories.data
    );
    const columns = useMemo(
        () => [
            {
                name: "Titulo",
                cell: (row: CategoryInterface) => row.title,
                sortable: true,
            },
            {
                name: "Imagen",
                cell: (row: CategoryInterface) => (
                    <img
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
                name: "Slug",
                cell: (row: CategoryInterface) => row.slug,
            },
            {
                name: "is parent",
                cell: (row: CategoryInterface) =>
                    row.is_parent == true ? "Sí" : "No",
            },
            {
                name: "Parent Category",
                cell: (row: CategoryInterface) =>
                    row.parent_info?.title ?? "unkanow",
            },
            {
                name: "Estado",
                cell: (row: CategoryInterface) => (
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
                cell: (row: CategoryInterface) => (
                    <div className="flex gap-4">
                        <IconEdit
                            color="black"
                            size={16}
                            event={() =>
                                router.get(route("category.edit", row.id))
                            }
                        />
                        <IconTrash
                            color="black"
                            size={16}
                            event={() => modalDeleteOpen(row.id)}
                        />
                    </div>
                ),
                ignoreRowClick: true,
            },
        ],
        [categoryList]
    );

    const modalDeleteOpen = ($id: number) => {
        setselectId($id);
        setModalDelete(true);
    };

    const closeModalDelete = () => {
        setselectId(null);
        setModalDelete(false);
    };

    const handleDelete = async () => {
        if (selectId) {
            try {
                const response = await axios.delete(
                    route("category.delete", selectId)
                );
                if (response.data.success) {
                    toast.success(response.data.message);
                    setCategoryList(
                        categoryList.filter(
                            (category) => category.id !== selectId
                        )
                    );
                    setModalDelete(false);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    };

    const handlePageChange = (page: number) => {
        router.get(route("banner.index"), { page: page });
    };

    return (
        <Authenticated>
            <Head title="Category" />
            <Breadcrumb pageName="Categorias" />
            <div className="mx-auto max-w-7xl">
                <div className="shadow rounded-2xl sm:p-4 bg-gray-500/10">
                    <DataTableComponent
                        columns={columns}
                        data={categoryList}
                        children={
                            <PrimaryButton
                                onClick={() =>
                                    router.get(route("category.create"))
                                }
                            >
                                Nuevo
                            </PrimaryButton>
                        }
                        current_page={categories.current_page}
                        last_page={categories.last_page}
                        per_page={categories.per_page}
                        total={categories.total}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
            <Modal show={modalDelete} onClose={closeModalDelete} maxWidth="sm">
                <div className="p-4">
                    <h2 className="font-semibold text-lg mb-4 text-text">
                        Confirmar Eliminación
                    </h2>
                    <p className="text-sx text-gray-400">
                        ¿Estás seguro de que deseas eliminar esta categoría?
                        Esta acción no se puede deshacer.
                    </p>
                    <div className="flex justify-center gap-4 mb-3 mt-5">
                        <DangerButton onClick={handleDelete}>
                            Eliminar
                        </DangerButton>
                        <SecondaryButton onClick={closeModalDelete}>
                            Cancelar
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>
        </Authenticated>
    );
}
