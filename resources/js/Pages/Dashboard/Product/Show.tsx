import Breadcrumb from "@/Components/Dashboard/Breadcrumb";
import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import PrimaryButton from "@/Components/Dashboard/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Dashboard/Buttons/SecondaryButton";
import Card from "@/Components/Dashboard/Card";
import TableInventary from "@/Components/Dashboard/TableInventary";
import { fDate } from "@/Utils/format-time";
import {
    ProductInterface,
    ProductInventaryInterface,
} from "@/Interfaces/Product";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

type PropsInventary = {
    product: ProductInterface;
    inventaries: ProductInventaryInterface[];
};

export default function Show({ product, inventaries }: PropsInventary) {
    const dateFormat = fDate(product.date);
    const exitPage = () => {
        router.get("/products");
    };
    return (
        <Authenticated>
            <Head title={product.title} />
            <Breadcrumb pageName={product.slug} />
            <Card>
                <div className="flex justify-between items-center mb-10">
                    <h4 className="font-semibold text-text">
                        Producto{" "}
                        <span className="text-accent">{product.title}</span>
                    </h4>
                    <div className=" flex gap-2">
                        <DangerButton onClick={() => exitPage()}>
                            Volver
                        </DangerButton>
                        <SecondaryButton
                            onClick={() =>
                                router.get(route("product.edit", product.id))
                            }
                        >
                            Editar
                        </SecondaryButton>
                        <PrimaryButton
                            onClick={() =>
                                router.get(
                                    route(
                                        "product.create.inventary",
                                        product.slug
                                    )
                                )
                            }
                        >
                            Inventario
                        </PrimaryButton>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="w-full">
                        <img
                            src={product.photo}
                            alt={product.slug}
                            width={400}
                        />
                    </div>
                    <div>
                        <table className="min-w-full mt-6">
                            <tbody>
                                <tr>
                                    <td className="p-2">Nombre del producto</td>
                                    <td className="p-2 font-semibold">
                                        : {product.title}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-2">Marca</td>
                                    <td className="p-2 font-semibold">
                                        : {product.brand?.title}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-2">Stock Total</td>
                                    <td className="p-2 font-semibold">
                                        : {product.stock}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-2">Precio</td>
                                    <td className="p-2 font-semibold">
                                        : ${product.price}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-2">Descuentos</td>
                                    <td className="p-2 font-semibold">
                                        : {product.discount}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-2">Condicíon</td>
                                    <td className="p-2 font-semibold">
                                        : {product.condition}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-2">Categoria</td>
                                    <td className="p-2 font-semibold">
                                        : {product.cat_info.title}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-2">Fecha Registro</td>
                                    <td className="p-2 font-semibold">
                                        : {dateFormat}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-2">Reseñas</td>
                                    <td className="p-2 font-semibold">
                                        :{" "}
                                        {product.get_review_avg_rate ??
                                            "Sin reseñas"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-2">Estado de Producto</td>
                                    <td className="p-2 font-semibold">
                                        : {product.status}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
            <br className="py-4" />
            <Card>
                <div className="text-center mb-8">
                    <h2 className="text-xl font-semibold uppercase">
                        Inventario del Producto
                    </h2>
                </div>
                <TableInventary inventaries={inventaries} />
            </Card>
        </Authenticated>
    );
}
