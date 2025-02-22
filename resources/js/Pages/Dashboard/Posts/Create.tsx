import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import IconButton from "@/Components/Dashboard/Buttons/IconButton";
import PrimaryButton from "@/Components/Dashboard/Buttons/PrimaryButton";
import Card from "@/Components/Dashboard/Card";
import EditorText from "@/Components/Dashboard/Form/EditorText";
import InputError from "@/Components/Dashboard/Form/InputError";
import InputFile from "@/Components/Dashboard/Form/InputFile";
import InputLabel from "@/Components/Dashboard/Form/InputLabel";
import InputSelect from "@/Components/Dashboard/Form/InputSelect";
import TextInput from "@/Components/Dashboard/Form/TextInput";
import { IconPlus } from "@/Components/IconSvg";
import { FormPostType } from "@/Interfaces/Post";
import { PostCategoryInterface } from "@/Interfaces/PostCategory";
import { PostTagInterface } from "@/Interfaces/PostTag";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalCategory from "./Categorias/ModalCategory";
import ModalTag from "./Tags/ModalTag";
import { MultiValue } from "react-select";
import RadioInput from "@/Components/Dashboard/Form/RadioInput";
import FullScreenLoader from "@/Components/FullScreenLoader";

type Props = {
    categories: PostCategoryInterface[];
    tags: PostTagInterface[];
    postItem?: FormPostType;
    isEditing: boolean;
};

type TagOption = { value: string; label: string };

export default function Create({
    categories,
    tags,
    postItem,
    isEditing,
}: Props) {
    const [selectedCategory, setSelectedCategory] = useState<{
        value: number;
        label: string;
    } | null>(null);
    const [selectedTag, setSelectedTag] = useState<TagOption[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [createCategory, setCreateCategory] = useState<boolean>(false);
    const [createTag, setCreateTag] = useState<boolean>(false);
    const initialData = postItem || {
        id: null,
        title: "",
        summary: "",
        description: "",
        photo: "",
        photoFile: null,
        status: "active",
        post_cat_id: null,
        tags: [] as string[],
    };

    useEffect(() => {
        if (isEditing && postItem) {
            if (postItem.photo) {
                setImagePreview(postItem.photo);
            }

            if (postItem.post_cat_id) {
                const catPost = categories.find(
                    (item) => item.id === postItem.post_cat_id
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
            if (postItem.tags) {
                const tagList = postItem.tags.split(','); // Divide la cadena en un array de tags
                const selectedTags = [];
    
                for (const tagTitle of tagList) {
                    const trimmedTagTitle = tagTitle.trim(); // Elimina espacios en blanco al principio y al final
    
                    const tagPost = tags.find(item => item.title === trimmedTagTitle);
    
                    if (tagPost) {
                        selectedTags.push({ value: tagPost.title, label: tagPost.title });
                    } else {
                        console.warn(`Tag with title "${trimmedTagTitle}" not found in available tags.`);
                    }
                }
    
                setSelectedTag(selectedTags);
            } else {
                setSelectedTag([]);
            }
        }
    }, [isEditing, postItem, categories, tags]);

    const { data, setData, post, processing, errors, reset } =
        useForm(initialData);

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
            data.tags = selectedTag.map((tag) => tag.value);
            const routeUrl =
                isEditing && data?.id
                    ? route("post.update", data.id)
                    : route("post.store");
            // Enviar los datos al backend
            post(routeUrl, {
                onSuccess: () => {
                    toast.error("Publicacion registrado con exito!");
                    reset();
                    setImagePreview(null);
                },
                onError: () => {
                    toast.error("Error al enviar los datos de la publicación");
                },
            });
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            toast.error("Error al subir la imagen");
        }
    };

    const exitFormPage = () => {
        reset();
        setImagePreview(null);
        router.get("/posts");
    };

    const CloseModal = () => {
        setCreateCategory(false);
        setCreateTag(false);
    };

    const handleCategoryAdded = (newCategory: PostCategoryInterface) => {
        categories.push(newCategory);
        setSelectedCategory({
            value: newCategory.id,
            label: newCategory.title,
        });
        //setData("post_cat_id", newCategory.id);
        data.post_cat_id = newCategory.id;
    };

    const handleTagAdded = (newTags: PostTagInterface) => {
        selectedTag.push({ value: newTags.title, label: newTags.title });
    };

    const handleCategoryChange = (
        selectedOption: { value: number; label: string } | null
    ) => {
        setSelectedCategory(selectedOption);
        setData("post_cat_id", selectedOption?.value!);
    };

    const handleTagChange = (selectedOptions: MultiValue<TagOption>) => {
        setSelectedTag(selectedOptions as TagOption[]);
    };
    // Crear las opciones en el formato que espera react-select
    const categoryOptions = categories.map((categorie) => ({
        value: categorie.id,
        label: categorie.title,
    }));

    const tagsOptions = tags.map((tag) => ({
        value: tag.title,
        label: tag.title,
    }));

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData((prevData) => ({
            ...prevData,
            status: e.target.value,
        }));
    };

    return (
        <Authenticated>
            <Head title="Post Create" />
            <FullScreenLoader show={processing} />
            <Card>
                <h4 className="font-semibold text-text">
                    {isEditing ? "Editar" : "Agregar "} Publicación
                </h4>
                <form className="py-4" onSubmit={handleSubmit}>
                    <div>
                        <InputLabel htmlFor="title" value="Titulo" required />
                        <TextInput
                            id="title"
                            name="title"
                            placeholder="Introduce el título"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="w-full mt-1 block"
                            required
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>
                    <div className="mt-2">
                        <InputLabel
                            htmlFor="summary"
                            value="Descripción corta"
                            required
                        />
                        <EditorText
                            id="summary"
                            height={200}
                            value={data.summary}
                            onEditorChange={(e: string) =>
                                setData("summary", e)
                            }
                        />
                        <InputError message={errors.summary} className="mt-2" />
                    </div>
                    <div className="mt-2">
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
                        <div>
                            <InputLabel
                                htmlFor="post_cat_id"
                                value="Categorias"
                                required
                            />
                            <div className="flex items-center gap-4">
                                <InputSelect
                                    id="post_cat_id"
                                    name="post_cat_id"
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    options={categoryOptions}
                                />
                                <IconButton
                                    color="bg-accent"
                                    icon={<IconPlus />}
                                    event={() => setCreateCategory(true)}
                                />
                            </div>
                            <InputError
                                message={errors.post_cat_id}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="tags"
                                value="Etiquetas"
                                required
                            />
                            <div className="flex items-center gap-4">
                                <InputSelect
                                    id="tags"
                                    name="tags"
                                    valueMultiple={selectedTag}
                                    onChange={handleTagChange}
                                    options={tagsOptions}
                                    multiple={true}
                                />
                                <IconButton
                                    color="bg-accent"
                                    icon={<IconPlus />}
                                    event={() => setCreateTag(true)}
                                />
                            </div>
                            <InputError
                                message={errors.tags}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
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
                                Cancelar
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
            <ModalCategory
                show={createCategory}
                closeModal={CloseModal}
                onCategoryAdded={handleCategoryAdded}
            />
            <ModalTag
                show={createTag}
                closeModal={CloseModal}
                onTagAdded={handleTagAdded}
            />
        </Authenticated>
    );
}
