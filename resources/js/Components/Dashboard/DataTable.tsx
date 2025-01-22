import DataTable, { TableColumn } from "react-data-table-component";
import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";

type Props<T> = {
    columns: TableColumn<T>[];
    data: T[];
    title?: string;
    href?: string;
    buttonCreate: boolean
};

const customStyles = {
    headRow: {
        style: {
            backgroundColor: "#1E293B", // Color oscuro para el encabezado
            color: "#FFFFFF", // Texto blanco
            fontSize: "16px",
            fontWeight: "bold",
        },
    },
    headCells: {
        style: {
            paddingLeft: "12px",
            paddingRight: "12px",
            fontSize: "14px",
            letterSpacing: "0.5px",
        },
    },
    subHeader: {
        style: {
            backgroundColor: "#CBD5E1", // Fondo gris claro
            borderBottom: "2px solid #94A3B8", // Línea divisoria
            padding: "12px", // Espaciado interno
            display: "flex",
            justifyContent: "space-between", // Distribuye elementos a los extremos
            alignItems: "center",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#1E293B", // Texto oscuro
        },
    },
    rows: {
        style: {
            backgroundColor: "#F8FAFC",
            color: "#1E293B",
            fontSize: "14px",
            minHeight: "50px",
            borderBottom: "1px solid #E2E8F0",
            "&:nth-child(odd)": {
                backgroundColor: "#E2E8F0",
            },
            "&:hover": {
                backgroundColor: "#D1E7DD",
                cursor: "pointer",
                transition: "background-color 0.3s ease-in-out",
            },
        },
    },
    pagination: {
        style: {
            backgroundColor: "#CBD5E1",
            borderTop: "1px solid #E2E8F0",
            padding: "10px",
        },
    },
};

const NoDataTable = () => {
    return (
        <div className="py-10">
            <p className="text-lg font-semibold">No hay Datos en la Tabla</p>
        </div>
    );
};

const LoadingTable = () => {
    return (
        <div className="h-50 flex justify-center items-center ">
            <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin" />
        </div>
    );
};

interface FilterComponentProps {
    filterText: string;
    onFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
    filterText,
    onFilter,
    onClear,
}) => (
    <div className="my-4 bg-gray-200 rounded-xl">
        <input
            type="text"
            placeholder="Buscar..."
            value={filterText}
            onChange={onFilter}
            className="border-0 outline-none bg-transparent p-2 focus:ring-0 text-gray-500"
        />
        <button
            onClick={onClear}
            className="ml-2 py-2 px-6 bg-gray-600 text-white rounded-r-xl"
        >
            <i className="bx bx-x-circle"></i>
        </button>
    </div>
);

const DataTableComponent = <T extends Record<string, unknown>>({
    columns,
    data,
    title,
    buttonCreate = false,
    href
}: Props<T>) => {
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 600);

        return () => clearTimeout(timer);
    }, []);

    const filteredItems = data.filter((item) => {
        return Object.values(item).some(
            (value) =>
                typeof value === "string" &&
                value.toLowerCase().includes(filterText.toLowerCase())
        );
    });

    const subHeaderComponentMemo = React.useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText("");
            }
        };
        return (
            <>
                <FilterComponent
                    onFilter={(e) => setFilterText(e.target.value)}
                    onClear={handleClear}
                    filterText={filterText}
                />
                {buttonCreate ? <Link href={href!} >Create</Link> : null }
            </>
        );
    }, [filterText, resetPaginationToggle]);

    return (
        <DataTable
            title={title}
            columns={columns}
            data={filteredItems}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 20]}
            customStyles={customStyles}
            noDataComponent={<NoDataTable />}
            progressPending={loading}
            progressComponent={<LoadingTable />}
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
            persistTableHead
        />
    );
};

export default DataTableComponent;
