import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import PrimaryButton from "@/Components/Dashboard/Buttons/PrimaryButton";
import Card from "@/Components/Dashboard/Card";
import InputError from "@/Components/Dashboard/Form/InputError";
import InputLabel from "@/Components/Dashboard/Form/InputLabel";
import InputSelect from "@/Components/Dashboard/Form/InputSelect";
import RadioInput from "@/Components/Dashboard/Form/RadioInput";
import TextInput from "@/Components/Dashboard/Form/TextInput";
import FullScreenLoader from "@/Components/FullScreenLoader";
import { FormCouponType } from "@/Interfaces/Coupon";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
    coupon?: FormCouponType;
    isEditing: boolean;
};

export default function Create({ coupon, isEditing }: Props) {
    const [selectedType, setSelectedType] = useState<{
        value: number;
        label: string;
    }>();
    const initialData = coupon || {
        id: null,
        code: "",
        type: "",
        value: null,
        status: "active",
    };

    useEffect(() => {
        if (isEditing) {
            setSelectedType({
                value: coupon?.type === "Fijo" ? 1 : 2,
                label: coupon?.type || "",
            });
        }
    }, []);

    const { data, setData, post, put, processing, errors, reset } =
        useForm(initialData);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const routeUrl =
                isEditing && data?.id
                    ? route("coupon.update", data.id)
                    : route("coupon.store");
            const method = isEditing && data?.id ? put : post;
            // Enviar los datos al backend
            method(routeUrl, {
                onSuccess: () => {
                    toast.success("Cupón registrado con exito!");
                    reset();
                },
                onError: () => {
                    toast.error("Error al enviar los datos del cupón");
                },
            });
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            toast.error("Error al subir la imagen");
        }
    };

    const handleCancelForm = () => {
        reset();
        router.get(route("coupon.index"));
    };

    const handleTypeCouponChange = (selectedOption: {
        value: number;
        label: string;
    }) => {
        setSelectedType(selectedOption);
        setData("type", selectedOption.value.toString());
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData((prevData) => ({
            ...prevData,
            status: e.target.value,
        }));
    };

    return (
        <Authenticated>
            <Head title="Cupón Create" />
            <FullScreenLoader show={processing} />
            <Card>
                <h4 className="font-semibold text-text">
                    {isEditing ? "Editar" : "Agregar "} Cupón
                </h4>
                <form className="py-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-1 gap-4">
                        <div className="mt-1">
                            <InputLabel
                                htmlFor="code"
                                value="Codigo"
                                required
                            />
                            <TextInput
                                id="code"
                                name="code"
                                placeholder="Ingrese el codigo"
                                value={data.code}
                                onChange={(e) =>
                                    setData("code", e.target.value)
                                }
                                className="w-full mt-1 block"
                                required
                            />
                            <InputError
                                message={errors.code}
                                className="mt-2"
                            />
                        </div>
                        <div className="mt-1">
                            <InputLabel
                                htmlFor="code"
                                value="Tipo de cupón"
                                required
                            />
                            <InputSelect
                                id="type"
                                name="type"
                                value={selectedType}
                                onChange={handleTypeCouponChange}
                                options={[
                                    { value: "Fijo", label: "Fijo" },
                                    {
                                        value: "Porcentaje",
                                        label: "Porcentaje",
                                    },
                                ]}
                            />
                            <InputError
                                message={errors.type}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-1 gap-4">
                        <div className="mt-1">
                            <InputLabel
                                htmlFor="value"
                                value="Valor del Cupón"
                                required
                            />
                            <TextInput
                                id="value"
                                name="value"
                                placeholder="Ingrese el valor"
                                value={data.value || 0}
                                onChange={(e) =>
                                    setData("value", parseInt(e.target.value))
                                }
                                className="w-full mt-1 block"
                                min={1}
                                required
                            />
                            <InputError
                                message={errors.value}
                                className="mt-2"
                            />
                        </div>
                        <div className="mt-1">
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
                </form>
            </Card>
        </Authenticated>
    );
}
