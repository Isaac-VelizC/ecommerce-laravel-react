import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/Dashboard/Form/InputLabel";
import TextInput from "@/Components/Dashboard/Form/TextInput";
import InputError from "@/Components/Dashboard/Form/InputError";
import SecondaryButton from "@/Components/Dashboard/Buttons/SecondaryButton";
import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import { PostTagInterface } from "@/Interfaces/PostTag";

type Props = {
    show: boolean;
    closeModal: () => void;
    onTagAdded: (tag: PostTagInterface) => void; // Nueva prop
};

export default function ModalTag({
    show,
    closeModal,
    onTagAdded,
}: Props) {
    const [title, setTitle] = useState("");
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<{ title?: string }>({});

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setProcessing(true);

        try {
            const response = await axios.post("/api/posts/tags", { title });
            onTagAdded(response.data.tag);
            toast.success("Etiqueta creada con éxito!");
            setTitle(""); // Limpiar el input
            closeModal(); // Cerrar el modal
        } catch (error: any) {
            console.error("Error al crear etiqueta:", error);
            setErrors(error.response?.data?.errors || {});
            toast.error("Error al crear etiqueta");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Modal show={show} maxWidth="lg" onClose={closeModal}>
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-text">
                    Crear Nueva Etiqueta
                </h2>
                <div className="mt-6">
                    <InputLabel
                        htmlFor="title"
                        value="Nombre de la etiqueta"
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
                        {processing ? "Enviando..." : "Guardar"}
                    </DangerButton>
                </div>
            </form>
        </Modal>
    );
}
