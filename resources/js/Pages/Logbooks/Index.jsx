import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { FaBroadcastTower } from "react-icons/fa";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SortableHeader from "@/Components/SortableHeader";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";
import TableNotFound from "@/Components/TableNotFound";
import TableDropdown from "@/Components/TableDropdown";
import { ViewButton } from "@/Components/Button";
import { inertiaGet, parseDate } from "@/utils/helper-function";
import { BreadcrumbsLogbooks } from "@/Pages/Logbooks/Constant";

export default function LogbooksIndex({ logbooks, transmissions }) {
    const breadcrumbs = [<BreadcrumbsLogbooks />, "Daftar"];

    const [perPage, setPerPage] = useState(logbooks.per_page || 10);
    const [selectedTransmissions, setSelectedTransmissions] = useState([]);
    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState("");

    function applyFilters(overrides = {}) {
        inertiaGet("logbooks.index", {
            page: 1,
            per_page: perPage,
            transmissions: selectedTransmissions,
            sort: sortField,
            direction: sortDirection,
            ...overrides,
        });
    }

    function handlePerPageChange(e) {
        const value = e.target.value;
        setPerPage(value);
        applyFilters({ per_page: value });
    }

    function toggleTransmission(id) {
        const updated = selectedTransmissions.includes(id)
            ? selectedTransmissions.filter((t) => t !== id)
            : [...selectedTransmissions, id];

        setSelectedTransmissions(updated);
        applyFilters({ transmissions: updated });
    }

    function handleSort(field, direction) {
        setSortField(field);
        setSortDirection(direction);
        applyFilters({ sort: field, direction: direction });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Logbook" />
            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <div className="flex items-center justify-end">
                        <TableDropdown
                            title="Pilih Transmisi"
                            icon={<FaBroadcastTower />}
                            list={transmissions}
                            selectedList={selectedTransmissions}
                            toggleItem={toggleTransmission}
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th></th>
                                    <SortableHeader
                                        label="Tanggal"
                                        column="tanggal"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <th>Transmisi</th>
                                    <th>Petugas</th>
                                    <th>Status TTD</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {logbooks.data.length === 0 ? (
                                    <TableNotFound
                                        message="Tidak ada logbook yang ditemukan."
                                        colspan={6}
                                    />
                                ) : (
                                    logbooks.data.map((logbook, index) => (
                                        <tr key={logbook.id}>
                                            <th>
                                                {(logbooks.current_page - 1) *
                                                    logbooks.per_page +
                                                    index +
                                                    1}
                                            </th>
                                            <td>{parseDate(logbook.tanggal)}</td>
                                            <td>{logbook.transmission.name}</td>
                                            <td>
                                                {logbook.petugas_list.length >
                                                0
                                                    ? logbook.petugas_list
                                                          .map((p) => p.name)
                                                          .join(", ")
                                                    : "-"}
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge badge-outline truncate block ${
                                                        logbook.petugas_list
                                                            .length > 0
                                                            ? "badge-success"
                                                            : "badge-error"
                                                    }`}
                                                >
                                                    {
                                                        logbook.petugas_list
                                                            .length
                                                    }{" "}
                                                    TTD
                                                </span>
                                            </td>
                                            <td className="flex flex-wrap justify-center items-center gap-2">
                                                <ViewButton
                                                    route={route(
                                                        "logbooks.view",
                                                        logbook.id
                                                    )}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <Pagination
                            perPage={perPage}
                            handlePerPageChange={handlePerPageChange}
                            data={logbooks.links}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
