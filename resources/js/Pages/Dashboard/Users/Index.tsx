import Breadcrumb from "@/Components/Dashboard/Breadcrumb";
import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import PrimaryButton from "@/Components/Dashboard/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Dashboard/Buttons/SecondaryButton";
import DataTableComponent from "@/Components/Dashboard/DataTable";
import { IconEdit, IconTrash } from "@/Components/IconSvg";
import Modal from "@/Components/Modal";
import PreviewImage from "@/Components/PreviewImage";
import { UserInterface } from "@/Interfaces/User";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

type Props = {
    users: {
        data: UserInterface[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function Index({ users }: Props) {
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [selectUser, setSelectUser] = useState<UserInterface | null>();
    const [userList, setUserList] = useState<UserInterface[]>(users.data);
    const [isOpen, setIsOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const columns = useMemo(
        () => [
            {
                name: "Perfil",
                cell: (row: UserInterface) => (
                    <img
                        onClick={() =>
                            openModal(
                                row.photo ??
                                    "https://i.pinimg.com/736x/c3/36/df/c336dfaf9f076cdbebf896d68585c355.jpg"
                            )
                        }
                        src={
                            row.photo ??
                            "https://i.pinimg.com/736x/c3/36/df/c336dfaf9f076cdbebf896d68585c355.jpg"
                        }
                        alt={row.name}
                        className="w-12 h-12 p-1 rounded-full object-cover shadow transition-transform duration-300 ease-in-out hover:scale-150 hover:z-[99]"
                    />
                ),
                width: "80px",
            },
            {
                name: "Nombre de usuario",
                cell: (row: UserInterface) => row.name,
                sortable: true,
            },
            {
                name: "E-mail",
                cell: (row: UserInterface) => row.email,
            },

            {
                name: "Rol",
                cell: (row: UserInterface) => row.role,
            },
            {
                name: "Estado",
                cell: (row: UserInterface) => (
                    <div className="badges">
                        <button
                            className={
                                row.status === "inactive" ? "red" : "green"
                            }
                        >
                            {row.status}
                        </button>
                    </div>
                ),
                sortable: true,
            },
            {
                name: "Acciones",
                cell: (row: UserInterface) => (
                    <div className="flex gap-4">
                        <IconEdit
                            color="black"
                            size={16}
                            event={() => router.get(route("user.edit", row.id))}
                        />
                        <IconTrash
                            color="black"
                            size={16}
                            event={() => handleDeleteUser(row)}
                        />
                    </div>
                ),
                ignoreRowClick: true,
            },
        ],
        [userList]
    );

    const openModal = (url: string) => {
        setImageUrl(url);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleDeleteUser = (row: UserInterface) => {
        setShowModalDelete(true);
        setSelectUser(row);
    };

    const handleDelete = async () => {
        if (selectUser) {
            try {
                
                const response = await axios.delete(
                    route("user.delete.status", selectUser.id)
                );
                if (response.data.success) {
                    setUserList((prevUserList) => {
                        return prevUserList.map((item) => 
                            item.id === response.data.user.id ? response.data.user : item
                        );
                    });
                    setShowModalDelete(false);
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error(
                    "Ocurrio un error, por favor intentalo de nuevo: ",
                    error
                );
            }
        }
    };

    const handleCloseModal = () => {
        setShowModalDelete(false);
        setSelectUser(null);
    };

    const handlePageChange = (page: number) => {
        router.get(route("user.index"), { page: page });
    };

    const breadcrumbLinks = [
        { href: route("user.index"), label: "Usuarios" },
    ];

    return (
        <Authenticated>
            <Head title="Usuarios" />
            <Breadcrumb pageName="Usuarios" links={breadcrumbLinks}/>
            <div className="mx-auto max-w-7xl">
                <div className="shadow rounded-2xl sm:p-4 bg-gray-500/10">
                    <DataTableComponent
                        columns={columns}
                        data={userList}
                        children={
                            <PrimaryButton
                                onClick={() => router.get(route("user.create"))}
                            >
                                Nuevo
                            </PrimaryButton>
                        }
                        current_page={users.current_page}
                        last_page={users.last_page}
                        per_page={users.per_page}
                        total={users.total}
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
                        Confirmar{" "}
                        {selectUser?.status === "active"
                            ? "dar de baja"
                            : "dar de alta"}
                    </h2>
                    <p className="text-sx text-gray-400 text-center">
                        ¿Estás seguro de que deseas
                        {selectUser?.status === "active"
                            ? " dar de baja"
                            : " dar de alta"}{" "}
                        al usuario <span className="font-bold">{selectUser?.name}</span>?
                    </p>
                    <div className="flex justify-center gap-4 mb-3 mt-5">
                        <SecondaryButton onClick={handleCloseModal}>
                            Cancelar
                        </SecondaryButton>
                        <DangerButton onClick={() => handleDelete()}>
                            {selectUser?.status === "active"
                                ? "Dar de baja"
                                : "Dar de alta"}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
            <PreviewImage
                imageUrl={imageUrl}
                isOpen={isOpen}
                onClose={closeModal}
            />
        </Authenticated>
    );
}
