import { Alert } from "@/Components/Client/alerts";
import Breadcrumb from "@/Components/Client/Breadcrumb";
import TextInput from "@/Components/Client/TextInput";
import InputError from "@/Components/Dashboard/Form/InputError";
import FullScreenLoader from "@/Components/FullScreenLoader";
import Instagram from "@/Containers/Instagram";
import { useSettings } from "@/Context/SettingsContext";
import { PropMessage } from "@/Interfaces/Message";
import Client from "@/Layouts/ClientLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

type Props = {};

export default function Contact({}: Props) {
    const { settings } = useSettings();
    const [message, setMessage] = useState<PropMessage>({
        type: "info",
        message: "",
    });
    const breadcrumbLinks = [
        { href: "/", label: "Home" },
        { href: "#", label: "Contact" },
    ];

    const initialData = {
        name: "",
        subject: "",
        email: "",
        phone: "",
        message: "",
    };
    const { data, setData, post, processing, errors, reset } =
        useForm(initialData);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            // Enviar los datos al backend
            post(route("contact.store"), {
                onSuccess: () => {
                    setMessage({
                        type: "success",
                        message: "Mensaje enviado con éxito",
                    });
                    reset();
                },
                onError: () => {
                    setMessage({
                        type: "error",
                        message: "Mensaje enviado con éxito",
                    });
                },
            });
        } catch (error) {
            console.error("Error al subir la imagen:", error);
        }
    };

    return (
        <Client>
            <Head title="Contact" />
            <Breadcrumb links={breadcrumbLinks} />
            <section className="pt-20 pb-20 contact">
                <div className="mx-4 sm:mx-10 xl:mx-44">
                    <FullScreenLoader show={processing} />
                    {message.message && (
                        <div className="my-4">
                            <Alert
                                type={message.type}
                                message={message.message}
                                closeAlert={() =>
                                    setMessage({ type: "info", message: "" })
                                }
                            />
                        </div>
                    )}
                    <div className="flex flex-wrap">
                        <div className="w-full lg:w-1/2 md:w-1/2 p-4">
                            <div>
                                <div className="mb-11">
                                    <h5 className="text-gray-900 text-lg font-semibold uppercase mb-5">
                                        Información del contacto
                                    </h5>
                                    <ul>
                                        <li className="relative mb-5 list-none">
                                            <h6 className="text-gray-900 font-semibold mb-2 flex items-center">
                                                <i className="fa fa-map-marker text-accent text-base mr-2"></i>
                                                Dirección
                                            </h6>
                                            <p className="text-gray-600 text-sm">
                                                {settings && settings.address}
                                            </p>
                                        </li>
                                        <li className="relative mb-5 list-none">
                                            <h6 className="text-gray-900 font-semibold mb-2 flex items-center">
                                                <i className="fa fa-phone text-accent text-base mr-2"></i>
                                                Telefono
                                            </h6>
                                            <p className="text-gray-600 text-sm">
                                                <span className="mr-6">
                                                    {settings && settings.phone}
                                                </span>
                                            </p>
                                        </li>
                                        <li className="relative mb-5 list-none">
                                            <h6 className="text-gray-900 font-semibold mb-2 flex items-center">
                                                <i className="fa fa-headphones text-accent text-base mr-2"></i>
                                                Soporte
                                            </h6>
                                            <p className="text-gray-600 text-sm">
                                                {settings && settings.email}
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-gray-900 text-lg font-semibold uppercase mb-9">
                                        ENVIAR MENSAJE
                                    </h5>
                                    <form onSubmit={handleSubmit}>
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            placeholder="Nombre"
                                        />
                                        <InputError message={errors.name} />
                                        <TextInput
                                            id="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            placeholder="E-mail"
                                        />
                                        <InputError message={errors.email} />
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <div>
                                                <TextInput
                                                    id="phone"
                                                    name="phone"
                                                    value={data.phone}
                                                    onChange={(e) =>
                                                        setData(
                                                            "phone",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Telefono"
                                                />

                                                <InputError
                                                    message={errors.phone}
                                                />
                                            </div>
                                            <div>
                                                <TextInput
                                                    id="subject"
                                                    name="subject"
                                                    value={data.subject}
                                                    onChange={(e) =>
                                                        setData(
                                                            "subject",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Asunto"
                                                />
                                                <InputError
                                                    message={errors.subject}
                                                />
                                            </div>
                                        </div>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={data.message}
                                            onChange={(e) =>
                                                setData(
                                                    "message",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Message"
                                            className="border border-[#e1e1e1] rounded-lg h-[130px] w-full px-[20px] pt-[12px] text-gray-600 text-sm mb-[14px] resize-none  focus:border-accent focus:ring-accent"
                                        ></textarea>
                                        <InputError message={errors.message} />
                                        <button
                                            type="submit"
                                            className="site-btn rounded-md h-[50px]"
                                        >
                                            {processing
                                                ? "Enviando Mensaje"
                                                : "Enviar Mensaje"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Mapa */}
                        <div className="w-full lg:w-1/2 md:w-1/2 p-4">
                            <div className="h-[780px]">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48158.305462977965!2d-74.13283844036356!3d41.02757295168286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2e440473470d7%3A0xcaf503ca2ee57958!2sSaddle%20River%2C%20NJ%2007458%2C%20USA!5e0!3m2!1sen!2sbd!4v1575917275626!5m2!1sen!2sbd"
                                    height={780}
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Instagram />
        </Client>
    );
}
