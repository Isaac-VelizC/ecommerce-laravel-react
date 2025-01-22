import DangerButton from "@/Components/DangerButton";
import Card from "@/Components/Dashboard/Card";
import InputError from "@/Components/Dashboard/Form/InputError";
import InputFile from "@/Components/Dashboard/Form/InputFile";
import InputLabel from "@/Components/Dashboard/Form/InputLabel";
import InputSelect from "@/Components/Dashboard/Form/InputSelect";
import TextInput from "@/Components/Dashboard/Form/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

type Props = {};

export default function Create({}: Props) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        description: "",
        photo: null as File | null,
        status: "",
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setData("photo", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await post(route('banner.store'), {
          onSuccess({ props}) {
            console.log('Benner Creado con exito');
          },
          onError() {
            alert('Error al crear banner')
          }
        })
    };

    return (
        <Authenticated>
            <Head title="Banner Create" />
            <Card>
                <h4 className="font-semibold">Add Banner</h4>
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
                        <InputLabel htmlFor="description" value="Descripción" />
                        <textarea
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.description}
                            className="mt-2"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <InputSelect
                                id="status"
                                name="status"
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                                className="w-full mt-1 block"
                                required
                            >
                                <option value="">Seleccione un estado</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </InputSelect>
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
                            <DangerButton type="reset" onClick={() => reset()} className="mr-2">
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
