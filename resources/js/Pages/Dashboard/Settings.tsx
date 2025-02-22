import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import PrimaryButton from "@/Components/Dashboard/Buttons/PrimaryButton";
import Card from "@/Components/Dashboard/Card";
import EditorText from "@/Components/Dashboard/Form/EditorText";
import InputError from "@/Components/Dashboard/Form/InputError";
import InputFile from "@/Components/Dashboard/Form/InputFile";
import InputLabel from "@/Components/Dashboard/Form/InputLabel";
import TextInput from "@/Components/Dashboard/Form/TextInput";
import { SettingInterface } from "@/Interfaces/Settings";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
    infoApp: SettingInterface;
};

const Settings: React.FC<Props> = ({ infoApp }) => {
    const [imagePreviewLogo, setImagePreviewLogo] = useState<string | null>(
        null
    );
    const [imagePreviewPhoto, setImagePreviewPhoto] = useState<string | null>(
        null
    );
    const { data, post, setData, errors, reset, processing } =
        useForm<SettingInterface>(infoApp);

    useEffect(() => {
        if (infoApp.logo || infoApp.photo) {
            setImagePreviewLogo(infoApp.logo);
            setImagePreviewPhoto(infoApp.photo);
        }
    }, []);

    const handleFileChangeLogo = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            setData("logoFile", file);
            const reader = new FileReader();
            reader.onloadend = () =>
                setImagePreviewLogo(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleFileChangePhoto = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            setData("photoFile", file);
            const reader = new FileReader();
            reader.onloadend = () =>
                setImagePreviewPhoto(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateForm = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            // Enviar los datos al backend
            post(route("settings.update"), {
                onSuccess: () => {
                    toast.success("Información registrado con exito!");
                    setImagePreviewLogo(null);
                },
                onError: () => {
                    toast.error("Error al enviar los datos");
                },
            });
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            toast.error("Error al subir la imagen");
        }
    };

    const handleEditorChange = (content: string) => {
        setData("description", content);
    };

    return (
        <Authenticated>
            <Head title="Settings" />
            <Card>
                <form onSubmit={handleUpdateForm}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
                        <div>
                            <InputLabel
                                htmlFor="email"
                                required
                                value="Correo Electrónico"
                            />
                            <TextInput
                                id="email"
                                name="email"
                                required
                                value={data.email}
                                placeholder="Correo Electrónico"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="w-full mt-1 block"
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="address"
                                required
                                value="Dirección"
                            />
                            <TextInput
                                id="address"
                                name="address"
                                required
                                value={data.address}
                                placeholder="Correo Electrónico"
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                                className="w-full mt-1 block"
                            />
                            <InputError
                                message={errors.address}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="phone"
                                required
                                value="Numero de Telefono"
                            />
                            <TextInput
                                id="phone"
                                name="phone"
                                required
                                value={data.phone}
                                placeholder="+XX XXXXXXXX"
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                                className="w-full mt-1 block"
                            />
                            <InputError
                                message={errors.phone}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="mb-2">
                        <InputLabel
                            htmlFor="short_des"
                            value="Descripción Corta"
                        />
                        <textarea
                            id="short_des"
                            name="short_des"
                            value={data.short_des}
                            onChange={(e) =>
                                setData("short_des", e.target.value)
                            }
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-700 bg-gray-500/20 dark:text-gray-300 dark:focus:border-cyan-600 dark:focus:ring-cyan-600"
                        />
                        <InputError
                            message={errors.short_des}
                            className="mt-2"
                        />
                    </div>
                    <div>
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="logo" value="Logo" required />
                            <InputFile
                                id="logo"
                                name="logo"
                                onChange={handleFileChangeLogo}
                                className="w-full mt-1 block"
                                accept="image/*"
                            />
                            <InputError
                                message={errors.logo}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="photo"
                                value="Logo Letras"
                                required
                            />
                            <InputFile
                                id="photo"
                                name="photo"
                                onChange={handleFileChangePhoto}
                                className="w-full mt-1 block"
                                accept="image/*"
                            />
                            <InputError
                                message={errors.photo}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div
                        id="holder"
                        className="flex justify-around"
                        style={{ marginTop: "15px" }}
                    >
                        {imagePreviewLogo && (
                            <div className="">
                                <div
                                    className=" relative rounded-full bg-cover w-22 h-22"
                                    style={{
                                        backgroundImage: `url(${imagePreviewLogo})`,
                                        backgroundPosition: "center",
                                    }}
                                ></div>
                                <h1 className="text-text text-xs font-bold text-center">
                                    Logo
                                </h1>
                            </div>
                        )}
                        {imagePreviewPhoto && (
                            <div className="items-center">
                                <img
                                    className="relative"
                                    src={imagePreviewPhoto}
                                    alt="Logo Name"
                                    width={200}
                                />
                                <h1 className="text-text text-xs font-bold text-center">
                                    Logo Name
                                </h1>
                            </div>
                        )}
                        <div className="flex md:block justify-end mt-4">
                            <DangerButton
                                type="reset"
                                onClick={() => reset()}
                                className="mr-2"
                            >
                                Cancelar
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
};

export default Settings;
