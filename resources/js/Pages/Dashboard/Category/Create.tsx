import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import Card from "@/Components/Dashboard/Card";
import Checkbox from "@/Components/Dashboard/Form/Checkbox";
import InputError from "@/Components/Dashboard/Form/InputError";
import InputFile from "@/Components/Dashboard/Form/InputFile";
import InputLabel from "@/Components/Dashboard/Form/InputLabel";
import InputSelect from "@/Components/Dashboard/Form/InputSelect";
import TextInput from "@/Components/Dashboard/Form/TextInput";
import PrimaryButton from "@/Components/Dashboard/Buttons/PrimaryButton";
import { CategoryInterface, FormCategoryType } from "@/Interfaces/Category";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EditorText from "@/Components/Dashboard/Form/EditorText";
import RadioInput from "@/Components/Dashboard/Form/RadioInput";
import axios from "axios";

type Props = {
    category?: FormCategoryType;
    parent_cats: CategoryInterface[];
    isEditing: boolean;
};

export default function Create({ isEditing, category, parent_cats }: Props) {
    const CLOUD_NAME = "dcvaqzmt9";
    const UPLOAD_PRESET = "ecommerce-laravel-react";
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const initialData = category || {
        id: null,
        title: "",
        summary: "",
        photo: "",
        is_parent: true,
        parent_id: null,
        status: "active",
    };
    const { data, setData, post, put, processing, errors, reset } =
        useForm(initialData);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const uploadImageToCloudinary = async (): Promise<string | null> => {
        if (!image) {
            alert("Selecciona una imagen");
            return null;
        }

        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", UPLOAD_PRESET); // Debe coincidir con Cloudinary
        formData.append("folder", "my_uploads"); // Opcional, para organizar imágenes

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            return response.data.secure_url;
        } catch (error) {
            console.error("Error subiendo imagen:", error);
            alert("Error subiendo imagen");
            return null;
        }
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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            if (image) {
                if (isEditing && data.photo) {
                    const publicId = data.photo.split("/").pop()?.split(".")[0];
                    await deleteImageFromCloudinary(publicId || "");
                }
                const uploadedImageUrl = await uploadImageToCloudinary();
                if (!uploadedImageUrl) return;
                data.photo = uploadedImageUrl;
            }

            const routeUrl =
                isEditing && data?.id
                    ? route("category.update", data.id)
                    : route("category.store");
            const method = isEditing && data?.id ? put : post;
            // Enviar los datos al backend
            method(routeUrl, {
                onSuccess: () => {
                    toast.success("Categoria registrado con exito!");
                    reset();
                    setImage(null);
                    setImagePreview(null);
                },
                onError: () => {
                    toast.error("Error al enviar los datos del categoria");
                },
            });
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            toast.error("Error al enviar los datos");
        }
    };

    const handleEditorChange = (content: string) => {
        setData({ ...data, summary: content });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData((prevData) => ({
            ...prevData,
            status: e.target.value,
        }));
    };

    const handleCancelForm = () => {
        reset();
        router.get(route("category.index"));
    };

    return (
        <Authenticated>
            <Head title="Categoria" />
            <Card>
                <h4 className="font-semibold text-text">
                    {isEditing ? "Editar" : "Añadir"} Categoria
                </h4>
                <form className="py-4" onSubmit={handleSubmit}>
                    <div>
                        <InputLabel htmlFor="title" value="Titulo" required />
                        <TextInput
                            id="title"
                            name="title"
                            placeholder="Enter title"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="w-full mt-1 block"
                            required
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>
                    <div className="mt-2">
                        <InputLabel htmlFor="summary" value="Descripción" />
                        <EditorText
                            id="summary"
                            value={data.summary}
                            onEditorChange={handleEditorChange}
                        />
                        <InputError message={errors.summary} className="mt-2" />
                    </div>
                    <div className="mt-2">
                        <InputLabel htmlFor="is_parent" value="Is Parent" />
                        <div className="flex mt-1">
                            <Checkbox
                                id="is_parent"
                                name="is_parent"
                                onChange={(e) =>
                                    setData("is_parent", e.target.checked)
                                }
                                checked={data.is_parent}
                            />
                            <p className="ml-2 text-sm font-semibold">Si</p>
                        </div>
                        <InputError
                            message={errors.is_parent}
                            className="mt-2"
                        />
                    </div>
                    <AnimatePresence>
                        {!data.is_parent && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <InputLabel
                                    htmlFor="parent_id"
                                    value="Categorias"
                                />
                                <InputSelect
                                    id="parent_id"
                                    name="parent_id"
                                    value={data.parent_id || ""}
                                    onChange={(e) =>
                                        setData(
                                            "parent_id",
                                            parseInt(e.target.value)
                                        )
                                    }
                                    className="w-full mt-1 block"
                                    required
                                >
                                    {parent_cats.length <= 0 ? (
                                        <option value="">No hay Datos</option>
                                    ) : (
                                        parent_cats.map((item) => (
                                            <option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.title}
                                            </option>
                                        ))
                                    )}
                                </InputSelect>
                                <InputError
                                    message={errors.parent_id}
                                    className="mt-2"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                            <InputLabel
                                htmlFor="photo"
                                value="Imagen"
                                required
                            />
                            <InputFile
                                id="photo"
                                name="photo"
                                onChange={handleFileChange}
                                className="w-full mt-1 block"
                                accept="image/*"
                            />
                            <InputError
                                message={errors.photo}
                                className="mt-2"
                            />
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
                                    checked={data.status === "active"}
                                    onChange={handleStatusChange}
                                />
                                <RadioInput
                                    label="Inactivo"
                                    name="status"
                                    value="inactive"
                                    checked={data.status === "inactive"}
                                    onChange={handleStatusChange}
                                />
                            </div>
                            <InputError
                                message={errors.status}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="flex md:flex-row flex-col justify-between my-4">
                        <div id="holder" style={{ marginTop: "15px" }}>
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Vista previa"
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "150px",
                                    }}
                                />
                            )}
                        </div>
                        <div className="flex md:block justify-end mt-4">
                            <DangerButton
                                type="reset"
                                onClick={() => handleCancelForm()}
                                className="mr-2"
                            >
                                Reset
                            </DangerButton>
                            <PrimaryButton
                                className="ml-2"
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? "Guardando" : "Guardar"}
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
            </Card>
        </Authenticated>
    );
}
