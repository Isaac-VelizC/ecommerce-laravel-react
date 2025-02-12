import Breadcrumb from "@/Components/Client/Breadcrumb";
import TextInput from "@/Components/Client/TextInput";
import Instagram from "@/Containers/Instagram";
import Client from "@/Layouts/ClientLayout";
import { Head } from "@inertiajs/react";
import React from "react";

type PropsInputLabel = {
    value: string;
    required?: boolean;
};

const InputLabel = ({ value, required = true }: PropsInputLabel) => {
    return (
        <p className="font-medium mb-2">
            {value} {required && <span className="text-[#ca1515]">*</span>}
        </p>
    );
};

type Props = {};

export default function Checkout({}: Props) {
    const breadcrumbLinks = [
        { href: "/", label: "Home" },
        { href: "#", label: "Verificar" },
    ];

    return (
        <Client>
            <Head title="Verificar" />
            <Breadcrumb links={breadcrumbLinks} />
            <section className="pt-20 pb-20 contact">
                <div className="mx-4 sm:mx-10 xl:mx-44">
                    <form action="#" className="checkout__form">
                        <div className="grid grid-cols-12 lg:gap-6">
                            <div className="lg:col-span-8">
                                <h5 className="font-semibold uppercase pb-4 mb-6 border-b border-solid">
                                    Billing detail
                                </h5>
                                <div className="grid grid-cols-12">
                                    <div className="sm:col-span-6 mr-2">
                                        <InputLabel value="First Name" />
                                        <TextInput name="first_name" />
                                    </div>
                                    <div className="sm:col-span-6 ml-2">
                                        <InputLabel value="Last Name" />
                                        <TextInput name="last_name" />
                                    </div>
                                    <div className="col-span-12">
                                        <div className="checkout__form__input">
                                            <InputLabel value="Country" />
                                            <TextInput name="country" />
                                        </div>
                                        <div className="checkout__form__input">
                                            <InputLabel value="Address" />
                                            <TextInput
                                                name="address"
                                                placeholder="Street Address"
                                            />
                                            <TextInput
                                                name="address"
                                                placeholder="Apartment. suite, unite ect ( optinal )"
                                            />
                                        </div>
                                        <div className="checkout__form__input">
                                            <InputLabel value="Town/City" />
                                            <TextInput name="city" />
                                        </div>
                                        <div className="checkout__form__input">
                                            <InputLabel value="Country/State" />
                                            <TextInput name="state" />
                                        </div>
                                        <div className="checkout__form__input">
                                            <InputLabel value="Postcode/Zip" />
                                            <TextInput name="postcode" />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-6 mr-2">
                                        <InputLabel value="Phone" />
                                        <TextInput name="phone" />
                                    </div>
                                    <div className="sm:col-span-6 ml-2">
                                        <InputLabel value="Email" />
                                        <TextInput name="email" />
                                    </div>
                                    <div className="col-span-12">
                                        <div className="">
                                            <label
                                                htmlFor="acc"
                                                className="text-sm block pl-6 font-medium relative cursor-pointer mb-4"
                                            >
                                                Create an acount?
                                                <input
                                                    type="checkbox"
                                                    id="acc"
                                                    
                                                className="absolute left-0 w-3 h-3 top-1 rounded-sm"
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                            <p className="text-xs mb-2">
                                                Create am acount by entering the
                                                information below. If you are a
                                                returing customer login at the{" "}
                                                <br />
                                                top of the page
                                            </p>
                                        </div>
                                        <div className="checkout__form__input">
                                            <InputLabel value="Account Password" />
                                            <TextInput name="password" />
                                        </div>
                                        <div className="text-sm block pl-6 font-medium relative cursor-pointer mb-4">
                                            <label>
                                                Note about your order, e.g,
                                                special noe for delivery
                                                <input
                                                    type="checkbox"
                                                    id="note"
                                                    
                                                className="absolute left-0 w-3 h-3 top-1 rounded-sm"
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
                                        <div className="checkout__form__input">
                                            <InputLabel value="Oder notes" />
                                            <TextInput
                                                name=""
                                                placeholder="Note about your order, e.g, special noe for delivery"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-4">
                                <div className="p-7 bg-gray-100">
                                    <h5 className="font-semibold uppercase pb-4 mb-6 border-b border-solid">
                                        Your order
                                    </h5>
                                    <div className="border-b border-solid pb-6">
                                        <ul>
                                            <li className="text-sm font-semibold overflow-hidden mb-3 leading-6">
                                                <span className=" float-left">
                                                    Product
                                                </span>
                                                <span className="float-right">
                                                    Total
                                                </span>
                                            </li>
                                            <li className="flex justify-between text-sm font-medium text-gray-600 overflow-hidden mb-3 leading-6">
                                                01. Chain buck bag{" "}
                                                <span className="font-semibold text-gray-900">
                                                    $ 300.0
                                                </span>
                                            </li>
                                            <li className="flex justify-between text-sm font-medium text-gray-600 overflow-hidden mb-3 leading-6">
                                                02. Zip-pockets pebbled
                                                <br /> tote briefcase{" "}
                                                <span className="font-semibold text-gray-900">
                                                    $ 170.0
                                                </span>
                                            </li>
                                            <li className="flex justify-between text-sm font-medium text-gray-600 overflow-hidden mb-3 leading-6">
                                                03. Black jean{" "}
                                                <span className="font-semibold text-gray-900">
                                                    $ 170.0
                                                </span>
                                            </li>
                                            <li className="flex justify-between text-sm font-medium text-gray-600 overflow-hidden mb-3 leading-6">
                                                04. Cotton shirt{" "}
                                                <span className="font-semibold text-gray-900">
                                                    $ 110.0
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="pt-3 border-b border-solid pb-2 mb-4">
                                        <ul>
                                            <li className="text-base font-semibold overflow-hidden mb-3 leading-9">
                                                Subtotal{" "}
                                                <span className="float-right text-[#ca1515]">
                                                    $ 750.0
                                                </span>
                                            </li>
                                            <li className="text-base font-semibold overflow-hidden mb-3 leading-9">
                                                Total{" "}
                                                <span className="float-right text-[#ca1515]">
                                                    $ 750.0
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="mb-6">
                                        <label
                                            htmlFor="o-acc"
                                            className="block pl-6 text-sm font-medium relative cursor-pointer mb-3"
                                        >
                                            Create an acount?
                                            <input
                                                type="checkbox"
                                                id="o-acc"
                                                className="absolute left-0 w-3 h-3 top-1 rounded-sm"
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                        <p className="text-gray-600 text-xs leading-5">
                                            Create am acount by entering the
                                            information below. If you are a
                                            returing customer login at the top
                                            of the page.
                                        </p>
                                        <label htmlFor="check-payment" className="block pl-6 text-sm font-medium relative cursor-pointer mb-3">
                                            Cheque payment
                                            <input
                                                type="checkbox"
                                                id="check-payment"
                                                className="absolute left-0 w-3 h-3 top-1 rounded-sm"
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label htmlFor="paypal" className="block pl-6 text-sm font-medium relative cursor-pointer mb-3">
                                            PayPal
                                            <input
                                                type="checkbox"
                                                id="paypal"
                                                className="absolute left-0 w-3 h-3 top-1 rounded-sm"
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
                                    <button type="submit" className="site-btn w-full">
                                        Place oder
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
            <Instagram />
        </Client>
    );
}
