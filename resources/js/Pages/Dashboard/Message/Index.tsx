import Breadcrumb from "@/Components/Dashboard/Breadcrumb";
import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import SecondaryButton from "@/Components/Dashboard/Buttons/SecondaryButton";
import DataTableComponent from "@/Components/Dashboard/DataTable";
import { IconEye, IconTrash } from "@/Components/IconSvg";
import Modal from "@/Components/Modal";
import { MessageInterface } from "@/Interfaces/Message";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

type Props = {
    messages: {
        data: MessageInterface[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function Index({ messages }: Props) {
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [selectMessage, setSelectMessage] = useState<number | null>();
    const [messageList, setMessageList] = useState<MessageInterface[]>(
        messages.data
    );
    const columns = useMemo(
        () => [
            {
                name: "Id",
                cell: (row: MessageInterface) => row.id,
                width: "80px",
            },
            {
                name: "Nombre",
                cell: (row: MessageInterface) => row.name,
            },
            {
                name: "E-mail",
                cell: (row: MessageInterface) => row.email,
            },
            {
                name: "Sujeto",
                cell: (row: MessageInterface) => row.subject,
            },
            {
                name: "Fecha",
                cell: (row: MessageInterface) => row.phone,
            },
            {
                name: "Acciones",
                cell: (row: MessageInterface) => (
                    <div className="flex gap-4">
                        <IconEye
                            color="black"
                            size={16}
                            event={() =>
                                router.get(route("messages.show", row.id))
                            }
                        />
                        <IconTrash
                            color="black"
                            size={16}
                            event={() => handleDeleteMessage(row.id)}
                        />
                    </div>
                ),
                ignoreRowClick: true,
            },
        ],
        [messageList]
    );

    const handleDeleteMessage = (id: number) => {
        setShowModalDelete(true);
        setSelectMessage(id);
    };

    const handleDelete = async () => {
        if (selectMessage) {
            try {
                const response = await axios.delete(
                    route("message.delete", selectMessage)
                );
                if (response.data.success) {
                    setMessageList(
                        messageList.filter((item) => item.id !== selectMessage)
                    );
                    setShowModalDelete(false);
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error al eliminar el mensaje: ", error);
            }
        }
    };

    const handleCloseModal = () => {
        setShowModalDelete(false);
        setSelectMessage(null);
    };

    const handlePageChange = (page: number) => {
        router.get(route("messages.index"), { page: page });
    };

    const breadcrumbLinks = [
        { href: route('messages.index'), label: "Mensajes" },
    ];

    return (
        <Authenticated>
            <Head title="Messages" />
            <Breadcrumb pageName="Mensajes" links={breadcrumbLinks}/>
            <div className="mx-auto max-w-7xl">
                <div className="shadow rounded-2xl sm:p-4 bg-gray-500/10">
                    <DataTableComponent
                        columns={columns}
                        data={messageList}
                        current_page={messages.current_page}
                        last_page={messages.last_page}
                        per_page={messages.per_page}
                        total={messages.total}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
            <Modal
                show={showModalDelete}
                onClose={handleCloseModal}
                maxWidth="sm"
            >
                <div className="p-4">
                    <h2 className="font-semibold text-lg mb-4 text-text">
                        Confirmar Eliminación
                    </h2>
                    <p className="text-sx text-gray-400">
                        ¿Estás seguro de que deseas eliminar este mensaje? Esta
                        acción no se puede deshacer.
                    </p>
                    <div className="flex justify-center gap-4 mb-3 mt-5">
                        <DangerButton onClick={handleDelete}>
                            Eliminar
                        </DangerButton>
                        <SecondaryButton onClick={handleCloseModal}>
                            Cancelar
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>
        </Authenticated>
    );
}
