import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import PrimaryButton from "@/Components/Dashboard/Buttons/PrimaryButton";
import Card from "@/Components/Dashboard/Card";
import InputError from "@/Components/Dashboard/Form/InputError";
import InputFile from "@/Components/Dashboard/Form/InputFile";
import InputLabel from "@/Components/Dashboard/Form/InputLabel";
import InputSelect from "@/Components/Dashboard/Form/InputSelect";
import TextInput from "@/Components/Dashboard/Form/TextInput";
import {
    ColorsInterface,
    ProductInterface,
    ProductInventaryInterface,
    SizesInterface,
} from "@/Interfaces/Product";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import Breadcrumb from "@/Components/Dashboard/Breadcrumb";
import TableInventary from "@/Components/Dashboard/TableInventary";

type PropsInventary = {
    product: ProductInterface;
    colors: ColorsInterface[];
    sizes: SizesInterface[];
    isEditing: boolean;
    inventaries: ProductInventaryInterface[];
};

export default function FormInventary({
    product,
    colors,
    sizes,
    isEditing,
    inventaries,
}: PropsInventary) {
    const [listInventario, setListInventario] =
        useState<ProductInventaryInterface[]>(inventaries);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<{
        value: number;
        label: string;
    } | null>(null);
    const [selectedSize, setSelectedSize] = useState<{
        value: number;
        label: string;
    } | null>(null);

    const initialData = {
        id: null,
        quantity: 1,
        imagen: null as unknown as File | null,
        product_id: product.id,
        talla_id: null as unknown as number,
        color_id: null as unknown as number,
    };

    const { data, setData, processing, errors, reset } = useForm(initialData);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setData("imagen", file);
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
                    ? route("product.update", data.id)
                    : "/products/inventary";

            const response = await axios.post(routeUrl, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                toast.success(response.data.success);
                reset();
                setSelectedColor(null);
                setSelectedSize(null);
                setImagePreview(null);
                setListInventario((prevList) => [
                    ...prevList,
                    response.data.item,
                ]);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const { errors } = error.response.data;
                if (errors) {
                    // Mostrar el mensaje de error específico para product_id
                    if (errors.product_id && errors.product_id.length > 0) {
                        toast.error(errors.product_id[0]); // Muestra el primer mensaje de error
                    } else {
                        toast.error("Ocurrió un error en la validación.");
                    }
                } else {
                    toast.error("Ocurrió un error inesperado.");
                }
            } else {
                toast.error("Ocurrió un error, vuelve a intentarlo.");
            }
        }
    };

    // Crear las opciones en el formato que espera react-select
    const ColorsOptions = colors.map((color) => ({
        value: color.id,
        label: color.name,
    }));

    const SizesOptions = sizes.map((size) => ({
        value: size.id,
        label: size.name,
    }));

    const handleColorChange = (
        selectedOption: { value: number; label: string } | null
    ) => {
        setSelectedColor(selectedOption);
        setData("color_id", selectedOption!.value);
    };

    const handleSizeChange = (selectedOption: {
        value: number;
        label: string;
    }) => {
        setSelectedSize(selectedOption);
        setData("talla_id", selectedOption!.value);
    };

    const exitFormPage = () => {
        reset();
        setImagePreview(null);
        router.get("/products");
    };
    return (
        <Authenticated>
            <Head title="Producto Create" />
            <Breadcrumb pageName="Inventario" />
            <Card>
                <h4 className="font-semibold text-text">
                    Registrar Inventario
                </h4>
                <form className="py-4" onSubmit={handleSubmit}>
                    <InputError message={errors.product_id} className="mt-2" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="talla_id"
                                value="Talla de la Prenda"
                                required
                            />
                            <InputSelect
                                id="talla_id"
                                name="talla_id"
                                value={selectedSize}
                                onChange={handleSizeChange}
                                options={SizesOptions}
                            />
                            <InputError
                                message={errors.talla_id}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="color_id"
                                value="Color de la Prenda"
                                required
                            />
                            <InputSelect
                                id="color_id"
                                name="color_id"
                                value={selectedColor}
                                onChange={handleColorChange}
                                options={ColorsOptions}
                            />
                            <InputError
                                message={errors.color_id}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
                        <div>
                            <InputLabel
                                htmlFor="imagen"
                                value="Imagen"
                                required
                            />
                            <InputFile
                                id="imagen"
                                name="imagen"
                                onChange={handleFileChange}
                                className="w-full mt-1 block"
                                accept="image/*"
                                required={isEditing ? false : true}
                            />
                            <InputError
                                message={errors.imagen}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="quantity"
                                value="Cantidad de la Prenda"
                                required
                            />
                            <TextInput
                                id="quantity"
                                name="quantity"
                                value={data.quantity || 0}
                                min={0}
                                max={100}
                                onChange={(e) =>
                                    setData(
                                        "quantity",
                                        parseFloat(e.target.value)
                                    )
                                }
                                className="w-full mt-1 block"
                                required
                            />
                            <InputError
                                message={errors.quantity}
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
                                onClick={() => exitFormPage()}
                                className="mr-2"
                            >
                                Terminar
                            </DangerButton>
                            <PrimaryButton
                                className="ml-2"
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? "Guardando" : "Agregar"}
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
            </Card>
            <br className="py-4" />
            <Card>
                <TableInventary inventaries={listInventario} />
            </Card>
        </Authenticated>
    );
}
