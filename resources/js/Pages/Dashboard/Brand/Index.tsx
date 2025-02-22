import Breadcrumb from "@/Components/Dashboard/Breadcrumb";
import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import PrimaryButton from "@/Components/Dashboard/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Dashboard/Buttons/SecondaryButton";
import Card from "@/Components/Dashboard/Card";
import DataTableComponent from "@/Components/Dashboard/DataTable";
import InputError from "@/Components/Dashboard/Form/InputError";
import InputLabel from "@/Components/Dashboard/Form/InputLabel";
import RadioInput from "@/Components/Dashboard/Form/RadioInput";
import TextInput from "@/Components/Dashboard/Form/TextInput";
import { IconEdit, IconTrash } from "@/Components/IconSvg";
import Modal from "@/Components/Modal";
import { BrandInterface, formBrandType } from "@/Interfaces/Brand";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type Props = {
    brands: {
        data: BrandInterface[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function Brand({ brands }: Props) {
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [selectBrand, setSelectBrand] = useState<number | null>();
    const [brandsList, setBrandsList] = useState(brands.data || []);
    const [formView, setFormView] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, post, put, processing, errors, reset } =
        useForm<formBrandType>({
            id: null,
            title: "",
            status: "active",
        });

    useEffect(() => {
        setBrandsList(brands.data);
    }, [brands.data]);

    const columns = useMemo(
        () => [
            {
                name: "N°",
                cell: (_: BrandInterface, i: number) => (i = i + 1),
            },
            {
                name: "Titulo",
                selector: (row: BrandInterface) => row.title,
                sortable: true,
            },
            {
                name: "Slug",
                selector: (row: BrandInterface) => row.slug || "N/A",
            },
            {
                name: "Estado",
                cell: (row: BrandInterface) => (
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
                cell: (row: BrandInterface) => (
                    <div className="flex gap-4">
                        <IconEdit
                            color="black"
                            size={16}
                            event={() => handleEdit(row)}
                        />
                        <IconTrash
                            color="black"
                            size={16}
                            event={() => handleDeleteBrand(row.id)}
                        />
                    </div>
                ),
                ignoreRowClick: true,
            },
        ],
        []
    );

    const cancelarForm = () => {
        setIsEditing(false);
        setFormView(false);
        reset();
        setData({
            id: null,
            title: "",
            status: "",
        });
    };

    const handleEdit = useCallback(
        (brand: BrandInterface) => {
            setData(brand);
            setIsEditing(true);
            setFormView(true);
        },
        [setData]
    );

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const routeUrl =
                isEditing && data?.id
                    ? route("brand.update", data.id)
                    : route("brand.store");
            const method = isEditing && data?.id ? put : post;
            // Enviar los datos al backend
            method(routeUrl, {
                onSuccess: ({ props }) => {
                    props.errors;
                    toast.success("Marca registrado con exito!");
                    setIsEditing(false);
                    setFormView(false);
                    reset();
                },
                onError: () => {
                    toast.error("Error al enviar los datos del marca");
                },
            });
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            toast.error("Error al enviar los datos");
        }
    };

    const handleDeleteBrand = (id: number) => {
        setShowModalDelete(true);
        setSelectBrand(id);
    };

    const handleDelete = async () => {
        if (selectBrand) {
            try {
                const response = await axios.delete(
                    route("brand.delete", selectBrand)
                );
                if (response.data.success) {
                    setBrandsList(
                        brandsList.filter((brand) => brand.id !== selectBrand)
                    );
                    setShowModalDelete(false);
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error al eliminar la marca: ", error);
            }
        }
    };

    const handleCloseModal = () => {
        setShowModalDelete(false);
        setSelectBrand(null);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData((prevData) => ({
            ...prevData,
            status: e.target.value,
        }));
    };

    const handlePageChange = (page: number) => {
        router.get(route("brand.index"), { page: page });
    };

    const breadcrumbLinks = [
        { href: route('brand.index'), label: "Marcas" },
    ];

    return (
        <Authenticated>
            <Head title="Brands" />
            <Breadcrumb pageName="Marcas" links={breadcrumbLinks} />
            <AnimatePresence>
                {formView ? (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card>
                            <h4 className="font-semibold text-text">
                                {isEditing ? "Editar" : "Agregar"} Marca
                            </h4>
                            <form className="py-4" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel
                                            htmlFor="title"
                                            value="Titulo"
                                            required
                                        />
                                        <TextInput
                                            id="title"
                                            name="title"
                                            placeholder="Ingrese el título"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                            className="w-full block"
                                            required
                                        />
                                        <InputError message={errors.title} />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="status"
                                            value="Estado"
                                            required
                                        />
                                        <div className="flex space-x-4 p-4">
                                            <RadioInput
                                                label="Activo"
                                                name="status"
                                                value="active"
                                                checked={
                                                    data.status === "active"
                                                }
                                                onChange={handleStatusChange}
                                            />
                                            <RadioInput
                                                label="Inactivo"
                                                name="status"
                                                value="inactive"
                                                checked={
                                                    data.status === "inactive"
                                                }
                                                onChange={handleStatusChange}
                                            />
                                        </div>
                                        <InputError message={errors.status} />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <DangerButton
                                        type="reset"
                                        onClick={() => cancelarForm()}
                                    >
                                        Cancelar
                                    </DangerButton>
                                    <PrimaryButton
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Enviando..."
                                            : isEditing
                                            ? "Actualizar"
                                            : "Guardar"}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                ) : null}
            </AnimatePresence>
            <div className="mx-auto max-w-7xl mt-6">
                <div className="shadow rounded-2xl sm:p-4 bg-gray-500/10">
                    <DataTableComponent
                        columns={columns}
                        data={brandsList}
                        children={
                            <PrimaryButton onClick={() => setFormView(true)}>
                                Nuevo
                            </PrimaryButton>
                        }
                        current_page={brands.current_page}
                        last_page={brands.last_page}
                        per_page={brands.per_page}
                        total={brands.total}
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
                        ¿Estás seguro de que deseas eliminar esta marca? Esta
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
