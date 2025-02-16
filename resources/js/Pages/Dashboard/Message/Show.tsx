import Breadcrumb from "@/Components/Dashboard/Breadcrumb";
import Card from "@/Components/Dashboard/Card";
import { MessageInterface } from "@/Interfaces/Message";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

type Props = {
    message: MessageInterface;
};

export default function Index({ message }: Props) {
    const [showModalDelete, setShowModalDelete] = useState(false);

    const handleDelete = async () => {
        if (message) {
            try {
                const response = await axios.delete(
                    route("banner.delete", message.id)
                );
                if (response.data.success) {
                    setShowModalDelete(false);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error al eliminar el banner: ", error);
            }
        }
    };

    return (
        <Authenticated>
            <Head title="Messages" />
            <Breadcrumb pageName="Mensajes" />
            <Card>
                <h5 className="text-lg font-semibold">Mensaje de {message.name}</h5>
                <div className="py-4 px-20">
                    <img
                        src="https://i.pinimg.com/236x/64/3a/4b/643a4b09d8ea2ad223059e741f35609a.jpg"
                        className=" rounded-full"
                        style={{ marginLeft: "44%" }}
                    />
                    <div className="py-6 text-base">
                        <p>De:</p>
                        <p><strong>Nombre: </strong>{message.name}</p>
                        <p><strong>Email: </strong>{message.email}</p>
                        <p><strong>Telefono: </strong>{message.phone}</p>
                    </div>
                    <hr />
                    <h5 className="text-lg text-center py-6 underline">
                        <strong>Asunto :</strong> {message.subject}
                    </h5>
                    <p className="py-5">{message.message}</p>
                </div>
            </Card>
        </Authenticated>
    );
}
