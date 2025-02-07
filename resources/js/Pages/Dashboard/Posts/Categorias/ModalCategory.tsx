import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/Dashboard/Form/InputLabel";
import TextInput from "@/Components/Dashboard/Form/TextInput";
import InputError from "@/Components/Dashboard/Form/InputError";
import SecondaryButton from "@/Components/Dashboard/Buttons/SecondaryButton";
import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import { PostCategoryInterface } from "@/Interfaces/PostCategory";

type Props = {
    show: boolean;
    closeModal: () => void;
    onCategoryAdded: (category: PostCategoryInterface) => void;
    categoria?: PostCategoryInterface | null;
};

export default function ModalCategory({
    show,
    closeModal,
    onCategoryAdded,
    categoria
}: Props) {
    const [title, setTitle] = useState("");
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<{ title?: string }>({});

    useEffect(() => {
        if (categoria) {
            setTitle(categoria.title);
        }
    },[categoria])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setProcessing(true);

        try {
            let response;
            if (categoria) {
                // Editar categoría existente
                response = await axios.put(`/api/posts/categories/update/${categoria.id}`, { title });
                toast.success(response.data.message);
            } else {
                // Crear nueva categoría
                response = await axios.post("/api/posts/categories", { title });
                toast.success(response.data.message);
            }
            onCategoryAdded(response.data.category);
            closeModal();
        } catch (error: any) {
            console.error("Error al crear/actualizar categoría:", error);
            setErrors(error.response?.data?.errors || {});
            toast.error("Error al crear/actualizar categoría");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Modal show={show} maxWidth="lg" onClose={closeModal}>
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-text">
                    {categoria ? 'Editar Categoría' : 'Crear Nueva Categoría'}
                </h2>
                <div className="mt-6">
                    <InputLabel
                        htmlFor="title"
                        value="Nombre de la Categoría"
                    />
                    <TextInput
                        id="title"
                        type="text"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full"
                        placeholder="Ingresa el título"
                    />
                    <InputError message={errors.title} className="mt-2" />
                </div>
                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={closeModal}>
                        Cancelar
                    </SecondaryButton>
                    <DangerButton className="ms-3" disabled={processing}>
                        {processing ? "Enviando..." : (categoria ? "Actualizar" : "Guardar")}
                    </DangerButton>
                </div>
            </form>
        </Modal>
    );
}
