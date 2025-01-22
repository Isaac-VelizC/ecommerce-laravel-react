import Breadcrumb from "@/Components/Client/Breadcrumb";
import Instagram from "@/Containers/Instagram";
import Client from "@/Layouts/ClientLayout";
import { Head } from "@inertiajs/react";
import React from "react";

type Props = {};

export default function Contact({}: Props) {
    const breadcrumbLinks = [
        { href: "./index.html", label: "Home" },
        { href: "./contact.html", label: "Contact" },
    ];

    return (
        <Client>
            <Head title="Contact" />
            <Breadcrumb links={breadcrumbLinks} />
            <section className="pt-20 pb-20 contact">
                <div className="mx-4 sm:mx-10 xl:mx-44">
                    <div className="flex flex-wrap">
                        <div className="w-full lg:w-1/2 md:w-1/2 p-4">
                            <div className="contact__content">
                                <div className="contact__address mb-11">
                                    <h5 className="text-gray-900 text-lg font-semibold uppercase mb-5">
                                        Contact info
                                    </h5>
                                    <ul>
                                        <li className="relative mb-5 list-none">
                                            <h6 className="text-gray-900 font-semibold mb-2 flex items-center">
                                                <i className="fa fa-map-marker text-[#ca1515] text-base mr-2"></i>
                                                Address
                                            </h6>
                                            <p className="text-gray-600 text-sm">
                                                160 Pennsylvania Ave NW,
                                                Washington, Castle, PA
                                                16101-5161
                                            </p>
                                        </li>
                                        <li className="relative mb-5 list-none">
                                            <h6 className="text-gray-900 font-semibold mb-2 flex items-center">
                                                <i className="fa fa-phone text-[#ca1515] text-base mr-2"></i>
                                                Phone
                                            </h6>
                                            <p className="text-gray-600 text-sm">
                                                <span className="mr-6">
                                                    125-711-811
                                                </span>
                                                <span>125-668-886</span>
                                            </p>
                                        </li>
                                        <li className="relative mb-5 list-none">
                                            <h6 className="text-gray-900 font-semibold mb-2 flex items-center">
                                                <i className="fa fa-headphones text-[#ca1515] text-base mr-2"></i>
                                                Support
                                            </h6>
                                            <p className="text-gray-600 text-sm">
                                                Support.photography@gmail.com
                                            </p>
                                        </li>
                                    </ul>
                                </div>

                                <div className="contact__form">
                                    <h5 className="text-gray-900 text-lg font-semibold uppercase mb-9">
                                        SEND MESSAGE
                                    </h5>
                                    <form action="#">
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            className="border border-[#e1e1e1] rounded-lg h-[50px] w-full px-[20px] text-gray-600 text-sm mb-5"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Email"
                                            className="border border-[#e1e1e1] rounded-lg h-[50px] w-full px-[20px] text-gray-600 text-sm mb-5"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Website"
                                            className="border border-[#e1e1e1] rounded-lg h-[50px] w-full px-[20px] text-gray-600 text-sm mb-5"
                                        />
                                        <textarea
                                            placeholder="Message"
                                            className="border border-[#e1e1e1] rounded-lg h-[130px] w-full px-[20px] pt-[12px] text-gray-600 text-sm mb-[14px] resize-none"
                                        ></textarea>
                                        <button
                                            type="submit"
                                            className="site-btn bg-[#F7941D] text-white rounded-md h-[50px]"
                                        >
                                            Send Message
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Mapa */}
                        <div className="w-full lg:w-1/2 md:w-1/2 p-4">
                            <div className="contact__map h-[780px]">
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
