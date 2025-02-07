import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import PrimaryButton from "@/Components/Dashboard/Buttons/PrimaryButton";
import Card from "@/Components/Dashboard/Card";
import Checkbox from "@/Components/Dashboard/Form/Checkbox";
import EditorText from "@/Components/Dashboard/Form/EditorText";
import InputError from "@/Components/Dashboard/Form/InputError";
import InputFile from "@/Components/Dashboard/Form/InputFile";
import InputLabel from "@/Components/Dashboard/Form/InputLabel";
import InputSelect from "@/Components/Dashboard/Form/InputSelect";
import RadioInput from "@/Components/Dashboard/Form/RadioInput";
import TextInput from "@/Components/Dashboard/Form/TextInput";
import { BrandInterface } from "@/Interfaces/Brand";
import { CategoryInterface } from "@/Interfaces/Category";
import { FormProductType } from "@/Interfaces/Product";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
    brands: BrandInterface[];
    categories: CategoryInterface[];
    product?: FormProductType;
    isEditing: boolean;
};

export default function Create({
    product,
    isEditing,
    brands,
    categories,
}: Props) {
    const [subCategories, setSubCategories] = useState<CategoryInterface[]>([]); // Estado para los hijos
    const [showSubSelect, setShowSubSelect] = useState(false); // Controlar visibilidad
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<{
        value: number;
        label: string;
    } | null>(null);
    const [selectedCondition, setSelectedCondition] = useState<{
        value: string;
        label: string;
    }>();
    const [selectedCategory, setSelectedCategory] = useState<{
        value: number;
        label: string;
    } | null>(null);

    const [selectedSubCategory, setSelectedSubCategory] = useState<{
        value: number;
        label: string;
    } | null>(null);
    const CLOUD_NAME = "dcvaqzmt9";
    const UPLOAD_PRESET = "ecommerce-laravel-react";
    const initialData = product || {
        id: null,
        title: "",
        summary: "",
        description: "",
        photo: "",
        cat_id: "",
        child_cat_id: "",
        price: null,
        brand_id: null,
        discount: null,
        status: "active",
        size: "",
        stock: null,
        is_featured: true,
        condition: "",
    };

    useEffect(() => {
        if (isEditing && product) {
            if (product?.photo) {
                setImagePreview(product.photo);
            }
            if (product?.child_cat_id) {
                handleCategoriesParent(product.cat_id);
            }
            if (product.cat_id) {
                const catPost = categories.find(
                    (item) => item.id === parseInt(product.cat_id)
                );

                if (catPost) {
                    setSelectedCategory({
                        value: catPost.id,
                        label: catPost.title,
                    });
                } else {
                    setSelectedCategory(null);
                }
            } else {
                setSelectedCategory(null);
            }
            if (product.child_cat_id) {
                const subCatPost = subCategories.find(
                    (item) => item.id === parseInt(product.child_cat_id)
                );

                if (subCatPost) {
                    setSelectedSubCategory({
                        value: subCatPost.id,
                        label: subCatPost.title,
                    });
                } else {
                    setSelectedSubCategory(null);
                }
            } else {
                setSelectedSubCategory(null);
            }
            if (product.brand_id) {
                const brandPost = brands.find(
                    (item) => item.id === parseInt(product.brand_id)
                );

                if (brandPost) {
                    setSelectedBrand({
                        value: brandPost.id,
                        label: brandPost.title,
                    });
                } else {
                    setSelectedBrand(null);
                }
            } else {
                setSelectedBrand(null);
            }
            if (product.condition) {
                setSelectedCondition({
                    value: product.condition,
                    label: product.condition,
                });
            } else {
                setSelectedBrand(null);
            }
        }
    }, [isEditing, product]);

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

    const handleCategoryChange = async (
        selectedOption: { value: number; label: string } | null
    ) => {
        setSelectedCategory(selectedOption);
        setData(
            "cat_id",
            selectedOption ? selectedOption.value.toString() : ""
        );
        const selectedCategory = selectedOption?.value;

        if (selectedCategory) {
            await handleCategoriesParent(selectedCategory.toString());
        } else {
            resetSubCategories();
        }
    };

    const handleCategoriesParent = async (selectedCategory: string) => {
        try {
            const { data } = await axios.get<CategoryInterface[]>(
                `/api/categories/${selectedCategory}/children`
            );
            updateSubCategories(data);
        } catch (error) {
            console.error("Error fetching subcategories", error);
            resetSubCategories();
        }
    };

    const updateSubCategories = (categories: CategoryInterface[]) => {
        if (categories.length > 0) {
            setSubCategories(categories);
            setShowSubSelect(true);
        } else {
            resetSubCategories();
        }
    };

    const resetSubCategories = () => {
        setSubCategories([]);
        setShowSubSelect(false);
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
                    ? route("product.update", data.id)
                    : route("product.store");
            const method = isEditing && data?.id ? put : post;
            // Enviar los datos al backend
            method(routeUrl, {
                onSuccess: () => {
                    toast.error("Producto registrado con exito!");
                    reset();
                    setShowSubSelect(false);
                    setSubCategories([]);
                    setImage(null);
                    setImagePreview(null);
                },
                onError: () => {
                    toast.error("Error al enviar los datos del producto");
                },
            });
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            toast.error("Error al subir la imagen");
        }
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData((prevData) => ({
            ...prevData,
            status: e.target.value,
        }));
    };

    // Crear las opciones en el formato que espera react-select
    const BrandsOptions = brands.map((brand) => ({
        value: brand.id,
        label: brand.title,
    }));

    const CategoriesOptions = categories.map((cat) => ({
        value: cat.id,
        label: cat.title,
    }));

    const CategoriesParentsOptions = subCategories.map((catSub) => ({
        value: catSub.id,
        label: catSub.title,
    }));

    const handleBrandChange = (
        selectedOption: { value: number; label: string } | null
    ) => {
        setSelectedBrand(selectedOption);
        setData("brand_id", selectedOption?.value?.toString() || null);
    };

    const handleConditionChange = (selectedOption: {
        value: string;
        label: string;
    }) => {
        setSelectedCondition(selectedOption);
        setData("condition", selectedOption.value.toString());
    };

    const handleSubCategoryChange = (selectedOption: {
        value: number;
        label: string;
    }) => {
        setSelectedSubCategory(selectedOption);
        setData("child_cat_id", selectedOption.value.toString());
    };

    const exitFormPage = () => {
        reset();
        setImagePreview(null);
        setSubCategories([]);
        router.get("/products");
    };

    return (
        <Authenticated>
            <Head title="Producto Create" />
            <Card>
                <h4 className="font-semibold text-text">
                    {isEditing ? "Editar" : "Agregar "} Producto
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
                    <div>
                        <InputLabel
                            htmlFor="summary"
                            value="Descripción corta"
                            required
                        />
                        <EditorText
                            id="summary"
                            value={data.summary}
                            onEditorChange={(e: string) =>
                                setData("summary", e)
                            }
                        />
                        <InputError message={errors.summary} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="description" value="Descripción" />
                        <EditorText
                            id="description"
                            value={data.description}
                            onEditorChange={(e: string) =>
                                setData("description", e)
                            }
                        />
                        <InputError
                            message={errors.description}
                            className="mt-2"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="mt-2">
                            <InputLabel
                                htmlFor="is_featured"
                                value="Is Parent"
                            />
                            <div className="flex mt-1">
                                <Checkbox
                                    id="is_featured"
                                    name="is_featured"
                                    onChange={(e) =>
                                        setData("is_featured", e.target.checked)
                                    }
                                    checked={data.is_featured}
                                />
                                <p className="ml-2 text-sm font-semibold">Si</p>
                            </div>
                            <InputError
                                message={errors.is_featured}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="cat_id"
                                value="Categoria del Producto"
                                required
                            />
                            <InputSelect
                                id="cat_id"
                                name="cat_id"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                options={CategoriesOptions}
                            />
                            <InputError
                                message={errors.cat_id}
                                className="mt-2"
                            />
                        </div>
                        {showSubSelect && (
                            <div>
                                <InputLabel
                                    htmlFor="child_cat_id"
                                    value="Subcategoría"
                                />
                                <InputSelect
                                    id="child_cat_id"
                                    name="child_cat_id"
                                    value={selectedSubCategory}
                                    onChange={handleSubCategoryChange}
                                    options={CategoriesParentsOptions}
                                />
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="mt-2 md:mt-0">
                            <InputLabel
                                htmlFor="condition"
                                value="Condicion del Producto"
                                required
                            />
                            <InputSelect
                                id="condition"
                                name="condition"
                                value={selectedCondition}
                                onChange={handleConditionChange}
                                options={[
                                    { value: "default", label: "Defecto" },
                                    {
                                        value: "new",
                                        label: "Nuevo",
                                    },
                                    {
                                        value: "hot",
                                        label: "Viejo",
                                    },
                                ]}
                            />
                            <InputError
                                message={errors.condition}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="brand"
                                value="Marca del Producto"
                                required
                            />
                            <InputSelect
                                id="brand"
                                name="brand"
                                value={selectedBrand}
                                onChange={handleBrandChange}
                                options={BrandsOptions}
                            />
                            <InputError
                                message={errors.brand_id}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                        <div>
                            <InputLabel
                                htmlFor="stock"
                                value="Cantidad del Producto"
                                required
                            />
                            <TextInput
                                id="stock"
                                //type="number"
                                name="stock"
                                value={data.stock || "0"}
                                min={1}
                                onChange={(e) =>
                                    setData("stock", parseFloat(e.target.value))
                                }
                                className="w-full mt-1 block"
                                required
                            />
                            <InputError
                                message={errors.stock}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="price"
                                value="Precio del Producto"
                                required
                            />
                            <TextInput
                                id="price"
                                //type="number"
                                name="price"
                                value={data.price || 0}
                                min={0}
                                onChange={(e) =>
                                    setData("price", parseFloat(e.target.value))
                                }
                                className="w-full mt-1 block"
                                required
                            />
                            <InputError
                                message={errors.price}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="discount"
                                value="Descuento del Producto"
                                required
                            />
                            <TextInput
                                id="discount"
                                //type="number"
                                name="discount"
                                value={data.discount || 0}
                                min={0}
                                max={100}
                                onChange={(e) =>
                                    setData(
                                        "discount",
                                        parseFloat(e.target.value)
                                    )
                                }
                                className="w-full mt-1 block"
                                required
                            />
                            <InputError
                                message={errors.discount}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
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
                                required={isEditing ? false : true}
                            />
                            <InputError
                                message={errors.photo}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="status"
                                value="Estado del Producto"
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
                                onClick={() => exitFormPage()}
                                className="mr-2"
                            >
                                Reset
                            </DangerButton>
                            <PrimaryButton
                                className="ml-2"
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? "Guardando" : "Enviar"}
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
            </Card>
        </Authenticated>
    );
}
