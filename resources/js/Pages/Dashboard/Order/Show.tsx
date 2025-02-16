import Breadcrumb from "@/Components/Dashboard/Breadcrumb";
import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import SecondaryButton from "@/Components/Dashboard/Buttons/SecondaryButton";
import Card from "@/Components/Dashboard/Card";
import { OrderInterface } from "@/Interfaces/Order";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";

type Props = {
    order: OrderInterface;
};

export default function Show({ order }: Props) {
    const handleDownloadPDF = async () => {
        try {
            const response = await axios.get(`/order/pdf/${order.id}`, {
                responseType: "blob",
            });
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${order.order_number}-${order.first_name}.pdf`); 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error al descargar el PDF:", error);
        }
    };
    
    return (
        <Authenticated>
            <Head title="Pedido" />
            <Breadcrumb pageName={order.order_number} />
            <div className="flex justify-end py-8 gap-4">
                <DangerButton>Delete</DangerButton>
                <SecondaryButton onClick={() => handleDownloadPDF()}>
                    Generar PDF
                </SecondaryButton>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <h3 className="text-lg text-center uppercase font-semibold">
                        Información del Pedido
                    </h3>
                    <table className="min-w-full mt-6">
                        <tbody>
                            <tr>
                                <td className="p-2">Número de Pedido</td>
                                <td className="p-2 font-semibold">
                                    : {order.order_number}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2">Fecha de Pedido</td>
                                <td className="p-2 font-semibold">: Fecha</td>
                            </tr>
                            <tr>
                                <td className="p-2">Cantidad</td>
                                <td className="p-2 font-semibold">
                                    : {order.quantity}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2">Estado del pedido</td>
                                <td className="p-2 font-semibold">
                                    : {order.status}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2">Precio de Envío</td>
                                <td className="p-2 font-semibold">
                                    : {order.total_amount}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2">Cupón</td>
                                <td className="p-2 font-semibold">
                                    : {order.coupon}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2">Monto Total</td>
                                <td className="p-2 font-semibold">
                                    : {order.total_amount}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2">Metodo de Pago</td>
                                <td className="p-2 font-semibold">
                                    : {order.payment_method}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2">Estado de Pago</td>
                                <td className="p-2 font-semibold">
                                    : {order.payment_status}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Card>
                <Card>
                    <h3 className="text-lg text-center uppercase font-semibold">
                        Información del Envío
                    </h3>
                    <table className="min-w-full mt-6">
                        <tbody>
                            <tr>
                                <td className="p-2">Nombre Completo</td>
                                <td className="p-2 font-semibold">
                                    : {order.first_name + " " + order.last_name}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2">Email</td>
                                <td className="p-2 font-semibold">
                                    : {order.email}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2">Teléfono</td>
                                <td className="p-2 font-semibold">
                                    : {order.phone}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2">Dirección</td>
                                <td className="p-2 font-semibold">
                                    : {order.address1}
                                    {order.address2
                                        ? `, ${order.address2}`
                                        : ""}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2">País</td>
                                <td className="p-2 font-semibold">
                                    : {order.country}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2">Código Postal</td>
                                <td className="p-2 font-semibold">
                                    : {order.post_code}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Card>
            </div>
        </Authenticated>
    );
}
