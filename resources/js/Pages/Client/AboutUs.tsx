import Breadcrumb from "@/Components/Client/Breadcrumb";
import Instagram from "@/Containers/Instagram";
import Services from "@/Containers/Services";
import Client from "@/Layouts/ClientLayout";
import { Head } from "@inertiajs/react";
import React from "react";

type Props = {};

export default function AboutUs({}: Props) {
    const breadcrumbLinks = [
        { href: "/", label: "Home" },
        { href: "#", label: "Sobre Nosotros" },
    ];
    return (
        <Client>
            <Head title="Sobre Nosotros" />
            <Breadcrumb links={breadcrumbLinks} />
            <Services />
            <section className="mt-4 pt-20 pb-20 bg-gray-100">
                <div className="mx-4 sm:mx-10 xl:mx-44">
                    <div className="relative flex flex-col lg:flex-row items-center lg:items-stretch bg-white shadow-lg rounded-lg overflow-hidden">
                        {/* Imagen con overlay */}
                        <div className="relative lg:w-1/2 h-96 lg:h-auto">
                            <img
                                src="https://i.pinimg.com/736x/36/cb/f8/36cbf8ec3065a731612ad4f32a690a03.jpg"
                                alt="AshStyle"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
                        </div>

                        {/* Contenido */}
                        <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center bg-white">
                            <span className="text-sm text-gray-500 uppercase tracking-wide">
                                About Us
                            </span>
                            <h1 className="text-4xl lg:text-5xl font-cookie text-gray-900 mt-2 mb-6 leading-tight">
                                Bienvenido a{" "}
                                <span className="text-accent">AshStyle</span>,
                                tu destino de jabones artesanales de lujo.
                            </h1>
                            <p className="text-gray-700 leading-relaxed">
                                Creemos en el poder de los ingredientes
                                naturales para nutrir y rejuvenecer tu piel.
                                Nuestros jabones están elaborados con esmero,
                                utilizando solo los mejores botánicos y aceites
                                esenciales. Cada barra es un testimonio de
                                nuestro compromiso con la calidad y la
                                sostenibilidad.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Instagram />
        </Client>
    );
}
