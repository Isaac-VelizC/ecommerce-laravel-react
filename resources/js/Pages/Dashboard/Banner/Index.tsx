import Breadcrumb from "@/Components/Dashboard/Breadcrumb";
import DataTableComponent from "@/Components/Dashboard/DataTable";
import { BannerInterface } from "@/Interfaces/Banner";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useMemo } from "react";

type Props = {
    banners: BannerInterface[];
};

export default function Banner({ banners }: Props) {
    const columns = useMemo(
        () => [
            {
                name: "Numero Serial",
                cell: (row: BannerInterface) => row.title,
                sortable: true,
            },
            {
                name: "Nombre del Dispositivo",
                cell: (row: BannerInterface) => row.photo,
            },
            {
                name: "Estdo",
                cell: (row: BannerInterface) => row.status,
                sortable: true,
            },
            {
                name: "Acciones",
                cell: (row: BannerInterface) => (
                    <div className="flex gap-4">
                        <button>
                            <i className="bi bi-pencil"></i> {row.status}
                        </button>
                    </div>
                ),
                ignoreRowClick: true,
            },
        ],
        [banners]
    );
    return (
        <Authenticated>
            <Head title="Banners" />
            <Breadcrumb pageName="Banner" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <DataTableComponent columns={columns} data={banners} buttonCreate={true} href={route("banner.create")} />
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
