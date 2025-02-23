import Procesando from "@/Common/Procesando";
import Breadcrumb from "@/Components/Client/Breadcrumb";
import CouponModal from "@/Components/Client/CouponModal";
import TextInput from "@/Components/Client/TextInput";
import InputError from "@/Components/Dashboard/Form/InputError";
import Instagram from "@/Containers/Instagram";
import { CartInterface } from "@/Interfaces/Cart";
import { CouponInterface } from "@/Interfaces/Coupon";
import { ShippingInterface } from "@/Interfaces/Shipping";
import Client from "@/Layouts/ClientLayout";
import { Head, useForm } from "@inertiajs/react";
import { ChangeEvent, useState } from "react";

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

type CheckoutProps = {
    shippings: ShippingInterface[];
    coupons: CouponInterface[];
    dataCart: {
        productos: CartInterface[];
        sub_total: number;
        tax: number;
        discount: number;
        total: number;
    };
};

export default function Checkout({
    dataCart,
    coupons,
    shippings,
}: CheckoutProps) {
    const { productos, sub_total, tax, discount, total } = dataCart;
    const [showCardForm, setShowCardForm] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [priceShippingSelect, setpriceShippingSelect] = useState<number>(
        parseInt(shippings[0].price)
    );
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    //const [cargando, setCargando] = useState(false);
    const breadcrumbLinks = [
        { href: "/", label: "Home" },
        { href: "#", label: "Verificar" },
    ];

    const initialData = {
        sub_total: sub_total,
        coupon: "",
        total_amount: total - discount,
        quantity: null,
        shipping_id: shippings[0].id,
        payment_method: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        country: "",
        post_code: "",
        address1: "",
        address2: "",
        expiry_date: "",
        card_number: "",
        cvv: null,
    };

    const { data, setData, post, processing, errors, reset } =
        useForm(initialData);

    // Función para manejar cambios en el método de pago
    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPaymentMethod(value);
        setData("payment_method", value);
        setShowCardForm(value === "card"); // Muestra el formulario solo si es tarjeta
    };

    const applyDiscount = (code: string, discount: number) => {
        setAppliedDiscount(discount);
        setAppliedCoupon(code);
        setData("total_amount", total - discount);
        setData("coupon", code); // Guardar en el backend
    };

    // Función para remover el descuento
    const removeDiscount = () => {
        setAppliedDiscount(0);
        setAppliedCoupon(null); // Borra el cupón aplicado
    };

    const shippingSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = parseInt(e.target.value, 10); // Convierte el valor a número
        const selectedShipping = shippings.find(
            (shipping) => shipping.id === selectedValue
        );
        setData("shipping_id", selectedValue);
        if (selectedShipping?.price !== undefined) {
            setpriceShippingSelect(parseInt(selectedShipping.price));
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            // Enviar los datos al backend
            post(route("cart.order"), {
                onSuccess: () => {
                    reset();
                    console.log("exito");
                },
                onError: () => {
                    console.log("Error al enviar los datos");
                    //toast.error("Error al enviar los datos del banner");
                },
            });
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            //toast.error("Error al subir la imagen");
        }
    };

    return (
        <>
            {processing && <Procesando />}
            <Client>
                <Head title="Verificar" />
                <Breadcrumb links={breadcrumbLinks} />

                <CouponModal
                    show={showModal}
                    onCloseModal={() => setShowModal(false)}
                    coupons={coupons}
                    total={total}
                    applyDiscount={applyDiscount}
                />
                <section className="pt-20 pb-20 contact">
                    <div className="mx-4 sm:mx-10 xl:mx-44">
                        <div className="w-full">
                            <h6 className="text-sm py-3 bg-[#f5f5f5] text-[#444444] border-t-2 border-[#ca1515] text-center mb-13">
                                <span className="icon_tag_alt"></span> ¿Tienes
                                un cupón?
                                <span
                                    onClick={() => setShowModal(true)}
                                    className="cursor-pointer underline"
                                >
                                    {" "}
                                    Haz clic aquí para introduce tu código.
                                </span>
                            </h6>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="checkout__form"
                        >
                            <div className="grid grid-cols-12 lg:gap-6">
                                <div className="col-span-full lg:col-span-8">
                                    <h5 className="font-semibold uppercase pb-4 mb-6 border-b border-solid">
                                        Detalle de facturación
                                    </h5>
                                    <div className="grid grid-cols-12">
                                        <div className="col-span-full sm:col-span-6 sm:mr-2">
                                            <InputLabel value="First Name" />
                                            <TextInput
                                                id="first_name"
                                                name="first_name"
                                                value={data.first_name}
                                                onChange={(e) =>
                                                    setData(
                                                        "first_name",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full mt-1 block"
                                                required
                                            />
                                            <InputError
                                                message={errors.first_name}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div className="col-span-full sm:col-span-6 sm:ml-2">
                                            <InputLabel value="Last Name" />
                                            <TextInput
                                                id="last_name"
                                                name="last_name"
                                                value={data.last_name}
                                                onChange={(e) =>
                                                    setData(
                                                        "last_name",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full mt-1 block"
                                                required
                                            />

                                            <InputError
                                                message={errors.last_name}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div className="col-span-12">
                                            <div>
                                                <InputLabel value="Country" />
                                                <TextInput
                                                    id="country"
                                                    name="country"
                                                    value={data.country}
                                                    onChange={(e) =>
                                                        setData(
                                                            "country",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full mt-1 block"
                                                    required
                                                />

                                                <InputError
                                                    message={errors.country}
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div>
                                                <InputLabel value="Address" />
                                                <TextInput
                                                    id="address1"
                                                    name="address1"
                                                    value={data.address1}
                                                    onChange={(e) =>
                                                        setData(
                                                            "address1",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full mt-1 block"
                                                    placeholder="Dirección"
                                                    required
                                                />
                                                <InputError
                                                    message={errors.address1}
                                                    className="mt-2"
                                                />
                                                <TextInput
                                                    id="address2"
                                                    name="address2"
                                                    value={data.address2}
                                                    onChange={(e) =>
                                                        setData(
                                                            "address2",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full mt-1 block"
                                                    placeholder="Departamento. suite, unir, etc. (opcional)"
                                                />

                                                <InputError
                                                    message={errors.address2}
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div>
                                                <InputLabel value="Postcode/Zip" />
                                                <TextInput
                                                    id="post_code"
                                                    name="post_code"
                                                    value={data.post_code}
                                                    onChange={(e) =>
                                                        setData(
                                                            "post_code",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full mt-1 block"
                                                    required
                                                />

                                                <InputError
                                                    message={errors.post_code}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-full sm:col-span-6 sm:mr-2">
                                            <InputLabel value="Phone" />
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
                                                className="w-full mt-1 block"
                                                required
                                            />

                                            <InputError
                                                message={errors.phone}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div className="col-span-full sm:col-span-6 sm:ml-2">
                                            <InputLabel value="Email" />
                                            <TextInput
                                                id="email"
                                                name="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full mt-1 block"
                                                required
                                            />

                                            <InputError
                                                message={errors.email}
                                                className="mt-2"
                                            />
                                        </div>

                                        {/*<div className="col-span-12">
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
                                        <div>
                                            <InputLabel value="Account Password" />
                                            <TextInput name="password" />
                                        </div>
                                    </div>*/}
                                    </div>
                                </div>
                                <div className="col-span-full lg:col-span-4">
                                    <div className="p-7 bg-gray-100">
                                        <h5 className="font-semibold uppercase pb-4 mb-6 border-b border-solid">
                                            Tu pedido
                                        </h5>
                                        <div className="border-b border-solid pb-6">
                                            <ul>
                                                <li className="text-sm font-semibold overflow-hidden mb-3 leading-6">
                                                    <span className=" float-left">
                                                        Producto
                                                    </span>
                                                    <span className="float-right">
                                                        Total
                                                    </span>
                                                </li>
                                                {productos.map(
                                                    (item, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex justify-between text-sm font-medium text-gray-600 overflow-hidden mb-3 leading-6"
                                                        >
                                                            {index + 1}.{" "}
                                                            {item.product.title}{" "}
                                                            <span className="font-semibold text-gray-900">
                                                                $ {item.price}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                        <div className="pt-3 border-b border-solid pb-3 mb-4">
                                            <label
                                                htmlFor="shipping"
                                                className="text-sm font-semibold"
                                            >
                                                Tipo de envío
                                            </label>
                                            <select
                                                id="shipping"
                                                name="shipping"
                                                className="w-full mt-2 rounded-lg border-none bg-gray-200 font-medium text-sm"
                                                value={data.shipping_id}
                                                onChange={shippingSelectChange}
                                            >
                                                {shippings.map(
                                                    (item, index) => (
                                                        <option
                                                            key={index}
                                                            value={item.id}
                                                            selected={
                                                                index === 0
                                                            }
                                                        >
                                                            {`${item.type}, precio $${item.price}`}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                        <div className="pt-3 border-b border-solid pb-2 mb-4">
                                            <ul>
                                                <li className="text-base font-semibold overflow-hidden mb-2 leading-8">
                                                    Subtotal{" "}
                                                    <span className="float-right text-[#ca1515]">
                                                        $ {sub_total}
                                                    </span>
                                                </li>
                                                <li className="text-base font-semibold overflow-hidden mb-2 leading-8">
                                                    Tax{" "}
                                                    <span className="float-right text-[#ca1515]">
                                                        $ {tax}
                                                    </span>
                                                </li>
                                                <li className="text-base font-semibold overflow-hidden mb-2 leading-8">
                                                    Costo Envio{" "}
                                                    <span className="float-right text-[#ca1515]">
                                                        $ {priceShippingSelect}
                                                    </span>
                                                </li>
                                                {appliedDiscount > 0 && (
                                                    <li className="text-base font-semibold overflow-hidden mb-2 leading-8">
                                                        Cupon{" "}
                                                        <span className="text-xs text-gray-600 font-normal">
                                                            {appliedCoupon}
                                                        </span>
                                                        <span
                                                            className="ml-3 text-xs text-gray-600 cursor-pointer"
                                                            onClick={
                                                                removeDiscount
                                                            } // Llama a la función al hacer clic
                                                        >
                                                            X
                                                        </span>
                                                        <span className="float-right text-[#ca1515]">
                                                            ${" "}
                                                            {appliedDiscount.toFixed(
                                                                2
                                                            )}
                                                        </span>
                                                    </li>
                                                )}
                                                <li className="text-base font-semibold overflow-hidden mb-2 leading-8">
                                                    Total{" "}
                                                    <span className="text-xs text-gray-600 font-normal">
                                                        Mas impuestos
                                                    </span>
                                                    <span className="float-right text-[#ca1515]">
                                                        ${" "}
                                                        {(
                                                            priceShippingSelect +
                                                            (total -
                                                                appliedDiscount)
                                                        ).toFixed(2)}
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="mb-6">
                                            <label className="block pl-6 text-sm font-medium relative cursor-pointer mb-3">
                                                PayPal
                                                <input
                                                    id="paypal"
                                                    type="radio"
                                                    name="payment"
                                                    value="paypal"
                                                    checked={
                                                        paymentMethod ===
                                                        "paypal"
                                                    }
                                                    onChange={
                                                        handlePaymentChange
                                                    }
                                                    className="absolute left-0 w-3 h-3 top-1 rounded-sm"
                                                />
                                            </label>
                                            <label className="block pl-6 text-sm font-medium relative cursor-pointer mb-3">
                                                Cheque payment
                                                <input
                                                    id="cod"
                                                    type="radio"
                                                    name="payment"
                                                    value="cod"
                                                    checked={
                                                        paymentMethod === "cod"
                                                    }
                                                    onChange={
                                                        handlePaymentChange
                                                    }
                                                    className="absolute left-0 w-3 h-3 top-1 rounded-sm"
                                                />
                                            </label>
                                            <label className="block pl-6 text-sm font-medium relative cursor-pointer mb-3">
                                                Tarjeta de crédito/débito
                                                <input
                                                    id="card"
                                                    type="radio"
                                                    name="payment"
                                                    value="card"
                                                    checked={
                                                        paymentMethod === "card"
                                                    }
                                                    onChange={
                                                        handlePaymentChange
                                                    }
                                                    className="absolute left-0 w-3 h-3 top-1 rounded-sm"
                                                />
                                            </label>
                                            {showCardForm && (
                                                <div className="w-full">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <InputLabel value="Expiry Date" />
                                                            <TextInput
                                                                id="expiry_date"
                                                                name="expiry_date"
                                                                value={
                                                                    data.expiry_date
                                                                }
                                                                onChange={(e) =>
                                                                    setData(
                                                                        "expiry_date",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="MM/YY"
                                                            />

                                                            <InputError
                                                                message={
                                                                    errors.expiry_date
                                                                }
                                                                className="mt-2"
                                                            />
                                                        </div>
                                                        {/*<div>
                                                        <InputLabel value="CVV" />
                                                        <TextInput
                                                            id="cvv"
                                                            name="cvv"
                                                            value={data.cvv | 0}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "cvv",
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                            placeholder="123"
                                                        />

                                                        <InputError
                                                            message={errors.cvv}
                                                            className="mt-2"
                                                        />
                                                    </div>*/}
                                                    </div>
                                                    <div>
                                                        <InputLabel value="Card Number" />
                                                        <TextInput
                                                            id="card_number"
                                                            name="card_number"
                                                            value={
                                                                data.card_number
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "card_number",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="1234 5678 9012 3456"
                                                        />

                                                        <InputError
                                                            message={
                                                                errors.card_number
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="submit"
                                            className="site-btn w-full"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? "Procesando Pedido...."
                                                : "Realizar pedido"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
                <Instagram />
            </Client>
        </>
    );
}
