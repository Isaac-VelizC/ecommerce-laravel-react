import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import Card from "@/Components/Dashboard/Card";
import InputError from "@/Components/Dashboard/Form/InputError";
import InputLabel from "@/Components/Dashboard/Form/InputLabel";
import TextInput from "@/Components/Dashboard/Form/TextInput";
import PrimaryButton from "@/Components/Dashboard/Buttons/PrimaryButton";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { toast } from "react-toastify";
import RadioInput from "@/Components/Dashboard/Form/RadioInput";
import { FormShippingType } from "@/Interfaces/Shipping";
import FullScreenLoader from "@/Components/FullScreenLoader";

type Props = {
    shipping?: FormShippingType;
    isEditing: boolean;
};

export default function Create({ shipping, isEditing }: Props) {
    const initialData = shipping || {
        id: null,
        type: "",
        price: "",
        status: "active",
    };
    const { data, setData, post, put, processing, errors, reset } =
        useForm(initialData);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const routeUrl =
                isEditing && data?.id
                    ? route("shipping.update", data.id)
                    : route("shipping.store");
            const method = isEditing && data?.id ? put : post;
            // Enviar los datos al backend
            method(routeUrl, {
                onSuccess: () => {
                    toast.success("Hubo un error");
                    reset();
                },
                onError: () => {
                    toast.error("Error al enviar los datos del tipo de envio");
                },
            });
        } catch (error) {
            console.error("Error al guardar los datos:", error);
            toast.error("Error al guardar los datos");
        }
    };

    const handleCancelForm = () => {
        reset();
        router.get(route("shipping.index"));
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData((prevData) => ({
            ...prevData,
            status: e.target.value,
        }));
    };

    return (
        <Authenticated>
            <Head title="Shipping Create" />
            <FullScreenLoader show={processing} />
            <Card>
                <h4 className="font-semibold text-text">
                    {isEditing ? "Editar" : "Agregar "} Envio
                </h4>
                <form className="py-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-1 gap-4">
                        <div className="mt-1">
                            <InputLabel
                                htmlFor="type"
                                value="Tipo de envio"
                                required
                            />
                            <TextInput
                                id="type"
                                name="type"
                                placeholder="Ingresa el nombre"
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                                className="w-full mt-1 block"
                                required
                            />
                            <InputError
                                message={errors.type}
                                className="mt-2"
                            />
                        </div>
                        <div className="mt-1">
                            <InputLabel htmlFor="price" value="Precio del envio" required/>
                            <TextInput
                                id="price"
                                name="price"
                                type="number"
                                min={1}
                                placeholder="Ingresa el precio"
                                value={data.price}
                                onChange={(e) =>
                                    setData("price", e.target.value)
                                }
                                className="w-full mt-1 block"
                                required
                            />
                            <InputError message={errors.price} className="mt-2"/>
                        </div>
                    </div>
                    <div className="md:mt-3">
                        <InputLabel htmlFor="status" value="Estado" required />
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
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    <div className="flex justify-end mt-4">
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
                </form>
            </Card>
        </Authenticated>
    );
}
