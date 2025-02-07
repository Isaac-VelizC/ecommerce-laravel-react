import DataTable, { TableColumn } from "react-data-table-component";
import React, { ReactNode, useEffect, useState } from "react";

type Props<T> = {
    columns: TableColumn<T>[];
    data: T[];
    title?: string;
    href?: string;
    children?: ReactNode;
    current_page: number;  // Página actual
    last_page: number;     // Última página
    per_page: number;      // Elementos por página
    total: number;         // Total de elementos
    onPageChange: (page: number) => void; // Función para cambiar de página
};

const customStyles = {
    headRow: {
        style: {
            backgroundColor: "#3d99b8", // Color oscuro para el encabezado
            color: "#0b0e0e",
            fontSize: "16px",
            fontWeight: "600",
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
            backgroundColor: "transparent",
            border: "none",
            padding: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "14px",
        },
    },
    rows: {
        style: {
            backgroundColor: "transparent",
            color: "#1E293B",
            fontSize: "14px",
            minHeight: "50px",
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
            backgroundColor: "transparent",
            padding: "10px",
            color: "#94A3B8",
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
    <div className="my-4 bg-body rounded-xl">
        <input
            type="text"
            placeholder="Buscar..."
            value={filterText}
            onChange={onFilter}
            className="border-0 outline-none bg-transparent placeholder:font-normal p-2 pl-6 focus:ring-0 text-gray-500"
        />
        <button
            onClick={onClear}
            className="ml-2 py-2 px-4 bg-accent text-white rounded-r-lg"
        >
            <i className="bx bx-x-circle text-xl"></i>
        </button>
    </div>
);

const DataTableComponent = <T extends Record<string, unknown>>({
    columns,
    data,
    title,
    children,
    current_page,
    last_page,
    per_page,
    total,
    onPageChange
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
                {children}
            </>
        );
    }, [filterText, resetPaginationToggle]);

    return (
        <DataTable
            title={title}
            columns={columns}
            data={filteredItems}
            pagination
            paginationRowsPerPageOptions={[5, 10, 20]}
            customStyles={customStyles}
            noDataComponent={<NoDataTable />}
            progressPending={loading}
            progressComponent={<LoadingTable />}
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
            persistTableHead
            paginationServer
            paginationTotalRows={total}
            paginationPerPage={per_page}
            paginationDefaultPage={current_page}
            onChangePage={onPageChange}
        />
    );
};

export default DataTableComponent;
