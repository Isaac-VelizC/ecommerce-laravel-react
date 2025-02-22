import { ProductInventaryInterface } from "@/Interfaces/Product";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";

type Props = {
    inventaries: ProductInventaryInterface[];
};

const TableInventary: React.FC<Props> = ({ inventaries }) => {
    const [listInventario, setListInventario] =
        useState<ProductInventaryInterface[]>(inventaries);
    useEffect(() => {
        setListInventario(inventaries);
    }, [inventaries]);

    const handleQuantityChange = (id: number, newQuantity: number) => {
        setListInventario((prevList) =>
            prevList.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
        debouncedUpdateQuantity(id, newQuantity);
    };

    const debouncedUpdateQuantity = _.debounce(
        async (id: number, newQuantity: number) => {
            try {
                await axios.patch(route("inventory.update", id), {
                    quantity: newQuantity,
                });
            } catch (error) {
                console.error("Error al actualizar cantidad", error);
            }
        },
        500
    );

    const handleBorrarInventario = async (id: number) => {
        if (id) {
            try {
                const response = await axios.delete(route("banner.delete", id));
                if (response.data.success) {
                    setListInventario(
                        listInventario.filter((item) => item.id !== id)
                    );
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error al eliminar el banner: ", error);
            }
        }
    };
    return (
        <div className="flex flex-wrap overflow-x-auto">
            <div className="mb-8 w-full">
                <table className="w-full border-collapse">
                    <thead className="border-b border-gray-200">
                        <tr className="text-base font-medium uppercase text-text">
                            <th className="py-2 px-4 text-left">Imagen</th>
                            <th className="py-2 px-4 text-center">Talla</th>
                            <th className="py-2 px-4 text-center">Color</th>
                            <th className="py-2 px-4 text-center">Cantidad</th>
                            <th className="py-2 px-4"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {listInventario.length <= 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="py-4 text-center text-gray-500 h-60"
                                >
                                    Lista Vacia
                                </td>
                            </tr>
                        ) : (
                            listInventario.map((item, index) => (
                                <tr
                                    key={index}
                                    className={`border-b border-gray-200 ${
                                        item.quantity <= 5 && "bg-[#ff0000b2]"
                                    }`}
                                >
                                    <td className="py-4 px-4 flex items-center">
                                        <img
                                            className="w-16 h-16 object-cover rounded-md mr-4"
                                            src={item.image.image}
                                            alt={item.image.image}
                                        />
                                    </td>
                                    <td className="py-4 px-4 text-center font-semibold">
                                        {item.size.name}
                                    </td>
                                    <td className="py-4 px-4 text-center font-semibold">
                                        {item.color.name}
                                    </td>
                                    <td className="py-4 px-4 text-center font-semibold">
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={item.quantity}
                                            min="0"
                                            className="w-16 text-center bg-transparent border border-gray-300 rounded p-1 focus:ring-0"
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    item.id,
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <button
                                            onClick={() =>
                                                handleBorrarInventario(item.id)
                                            }
                                            className="py-1 px-4 text-sm font-medium border border-gray-500 hover:bg-gray-300 rounded-lg"
                                        >
                                            Borrar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableInventary;
