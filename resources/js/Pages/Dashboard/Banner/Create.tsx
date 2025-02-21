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
import { FormBannerType } from "@/Interfaces/Banner";
import { toast } from "react-toastify";
import EditorText from "@/Components/Dashboard/Form/EditorText";
import RadioInput from "@/Components/Dashboard/Form/RadioInput";

type Props = {
    banner?: FormBannerType;
    isEditing: boolean;
};

export default function Create({ banner, isEditing }: Props) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const initialData = banner || {
        id: null,
        title: "",
        description: "",
        photo: "",
        photoFile: null,
        status: "active",
    };
    const { data, setData, post, processing, errors, reset } =
        useForm(initialData);

    useEffect(() => {
        if (isEditing) {
            setImagePreview(banner!.photo as string);
        }
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setData("photoFile", file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!isEditing && !data.photoFile)
            return alert("Selecciona una imagen");
        try {
            const routeUrl =
                isEditing && data?.id
                    ? route("banner.update", data.id)
                    : route("banner.store");
            //const method = isEditing && data?.id ? put : post;
            // Enviar los datos al backend
            post(routeUrl, {
                forceFormData: true,
                onSuccess: () => {
                    //if (flash.message.success) toast.success(flash.message.success);
                    //if (flash.message.error) toast.error(flash.message.error);
                    reset();
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
                                htmlFor="photoFile"
                                value="Imagen"
                                required={!isEditing}
                            />
                            <InputFile
                                id="photoFile"
                                name="photoFile"
                                onChange={handleFileChange}
                                className="w-full mt-1 block"
                                accept="image/*"
                                required={!isEditing}
                            />
                            <InputError
                                message={errors.photoFile}
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
                                Volver
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
