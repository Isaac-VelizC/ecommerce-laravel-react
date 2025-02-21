import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import PrimaryButton from "@/Components/Dashboard/Buttons/PrimaryButton";
import Card from "@/Components/Dashboard/Card";
import InputError from "@/Components/Dashboard/Form/InputError";
import InputFile from "@/Components/Dashboard/Form/InputFile";
import InputLabel from "@/Components/Dashboard/Form/InputLabel";
import InputSelect from "@/Components/Dashboard/Form/InputSelect";
import RadioInput from "@/Components/Dashboard/Form/RadioInput";
import TextInput from "@/Components/Dashboard/Form/TextInput";
import { FormUserType } from "@/Interfaces/User";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
    user?: FormUserType;
    isEditing: boolean;
};

export default function Create({ user, isEditing }: Props) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<{
        value: string;
        label: string;
    }>();
    const initialData = user || {
        id: null,
        name: "",
        email: "",
        password: "",
        photo: "",
        photoFile: null,
        role: "",
        status: "active",
    };
    const { data, setData, post, put, processing, errors, reset } =
        useForm(initialData);

    useEffect(() => {
        if (isEditing) {
            setImagePreview(user!.photo);
            if (user?.role) {
                setSelectedRole({ value: user.role, label: user.role });
            }
        }
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setData('photoFile', file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const routeUrl =
                isEditing && data?.id
                    ? route("user.update", data.id)
                    : route("user.store");
            // Enviar los datos al backend
            post(routeUrl, {
                onSuccess: () => {
                    toast.success("Usuario registrado con exito!");
                    reset();
                    setImagePreview(null);
                },
                onError: () => {
                    toast.error("Error al enviar los datos del usuario");
                },
            });
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            toast.error("Error al subir la imagen");
        }
    };

    const handleCancelForm = () => {
        reset();
        router.get(route("user.index"));
    };

    const handleRoleUserChange = (selectedOption: {
        value: string;
        label: string;
    }) => {
        setSelectedRole(selectedOption);
        setData("role", selectedOption.value.toString());
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData((prevData) => ({
            ...prevData,
            status: e.target.value,
        }));
    };

    return (
        <Authenticated>
            <Head title="Nuevo Usuario" />
            <Card>
                <h4 className="font-semibold text-text">
                    {isEditing ? "Editar" : "Agregar "} Usuario
                </h4>
                <form className="py-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-1 gap-4">
                        <div className="mt-1">
                            <InputLabel
                                htmlFor="name"
                                value="Nombre de usuario"
                                required
                            />
                            <TextInput
                                id="name"
                                name="name"
                                placeholder="Ingrese el nombre de usuario"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="w-full mt-1 block"
                                required
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>
                        <div className="mt-1">
                            <InputLabel
                                htmlFor="email"
                                value="Correo Electronico"
                                required
                            />
                            <TextInput
                                id="email"
                                name="email"
                                placeholder="Ingrese el correo electronico"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="w-full mt-1 block"
                                required
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-1 gap-4">
                        <div className="mt-1">
                            <div className="flex gap-4">
                                <InputLabel
                                    htmlFor="password"
                                    value="Contraseña"
                                    required={!isEditing}
                                />
                                <h6 className="text-orange-400 text-xs mt-1">Solo ingresa la contraseña si requiere cambiar</h6>
                            </div>
                            <TextInput
                                id="password"
                                name="password"
                                placeholder="Ingrese la contraseña"
                                value={data.password}
                                type="password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="w-full mt-1 block"
                                required={!isEditing}
                            />
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>
                        <div className="mt-1">
                            <InputLabel htmlFor="role" value="Rol" required />
                            <InputSelect
                                id="role"
                                name="role"
                                value={selectedRole}
                                onChange={handleRoleUserChange}
                                options={[
                                    { value: "admin ", label: "Admin" },
                                    {
                                        value: "user",
                                        label: "User",
                                    },
                                ]}
                            />
                            <InputError
                                message={errors.role}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-1 gap-4">
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
                                required
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
                                        width: "150px",
                                        height: "150px",
                                        borderRadius: "100%",
                                        objectFit: 'cover'
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
