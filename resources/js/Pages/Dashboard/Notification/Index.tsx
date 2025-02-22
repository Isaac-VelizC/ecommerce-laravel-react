import Breadcrumb from "@/Components/Dashboard/Breadcrumb";
import DangerButton from "@/Components/Dashboard/Buttons/DangerButton";
import SecondaryButton from "@/Components/Dashboard/Buttons/SecondaryButton";
import Modal from "@/Components/Modal";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {};

export default function Index({}: Props) {
    const [showModalDelete, setShowModalDelete] = useState(false);
    //const [selectBanner, setSelectBanner] = useState<BannerInterface | null>();
    //const [bannerList, setBannerList] = useState<BannerInterface[]>(banners.data);

    /*const handleDelete = async () => {
        if (selectBanner) {
            try {
                const response = await axios.delete(
                    route("banner.delete", selectBanner.id)
                );
                if (response.data.success) {
                    setBannerList(
                        bannerList.filter(
                            (banner) => banner.id !== selectBanner.id
                        )
                    );
                    setShowModalDelete(false);
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error al eliminar el banner: ", error);
            }
        }
    };*/

    const handleCloseModal = () => {
        setShowModalDelete(false);
    };

    const breadcrumbLinks = [
        { href: route("all.notification"), label: "Notificaciones" },
    ];

    return (
        <Authenticated>
            <Head title="Notification" />
            <Breadcrumb pageName="Notificaciones" links={breadcrumbLinks} />
            <div className="mx-auto max-w-7xl">
                <div className="shadow rounded-2xl sm:p-4 bg-gray-500/10"></div>
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
                        ¿Estás seguro de que deseas eliminar este banner? Esta
                        acción no se puede deshacer.
                    </p>
                    <div className="flex justify-center gap-4 mb-3 mt-5">
                        <DangerButton>Eliminar</DangerButton>
                        <SecondaryButton onClick={handleCloseModal}>
                            Cancelar
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>
        </Authenticated>
    );
}
