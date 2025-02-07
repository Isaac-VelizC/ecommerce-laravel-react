import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import Card from "@/Components/Dashboard/Card";
import InputError from "@/Components/Dashboard/Form/InputError";
import InputFile from "@/Components/Dashboard/Form/InputFile";
import InputLabel from "@/Components/Dashboard/Form/InputLabel";
import TextInput from "@/Components/Dashboard/Form/TextInput";
import PrimaryButton from "@/Components/Dashboard/Buttons/PrimaryButton";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { FormBannerType } from "@/Interfaces/Banner";
import { toast } from "react-toastify";
import EditorText from "@/Components/Dashboard/Form/EditorText";
import RadioInput from "@/Components/Dashboard/Form/RadioInput";

type Props = {
    banner?: FormBannerType;
    isEditing: boolean;
};

export default function Create({ banner, isEditing }: Props) {
    const CLOUD_NAME = "dcvaqzmt9";
    const UPLOAD_PRESET = "ecommerce-laravel-react";
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const initialData = banner || {
        id: null,
        title: "",
        description: "",
        photo: "",
        status: "active",
    };
    const { data, setData, post, put, processing, errors, reset } =
        useForm(initialData);

    useEffect(() => {
        if (isEditing) {
            setImagePreview(banner!.photo);
        }
    }, []);

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
        if (!isEditing && !image) return alert("Selecciona una imagen");
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
                    ? route("banner.update", data.id)
                    : route("banner.store");
            const method = isEditing && data?.id ? put : post;
            // Enviar los datos al backend
            method(routeUrl, {
                onSuccess: () => {
                    toast.success("Banner registrado con exito!");
                    reset();
                    setImage(null);
                    setImagePreview(null);
                },
                onError: () => {
                    toast.error("Error al enviar los datos del banner");
                },
            });
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            toast.error("Error al subir la imagen");
        }
    };

    const handleCancelForm = () => {
        reset();
        router.get(route("banner.index"));
    };

    const handleEditorChange = (content: string) => {
        setData({ ...data, description: content });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData((prevData) => ({
            ...prevData,
            status: e.target.value,
        }));
    };

    return (
        <Authenticated>
            <Head title="Banner Create" />
            <Card>
                <h4 className="font-semibold text-text">
                    {isEditing ? "Editar" : "Agregar "} Banner
                </h4>
                <form className="py-4" onSubmit={handleSubmit}>
                    <div className="mt-1">
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

                    <div className="mt-1">
                        <InputLabel htmlFor="description" value="Descripción" />
                        <EditorText
                            id="description"
                            value={data.description}
                            onEditorChange={handleEditorChange}
                        />
                        <InputError
                            message={errors.description}
                            className="mt-2"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 mt-1 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="photo"
                                value="Imagen"
                                required={!isEditing}
                            />
                            <InputFile
                                id="photo"
                                name="photo"
                                onChange={handleFileChange}
                                className="w-full mt-1 block"
                                accept="image/*"
                                required={!isEditing}
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
