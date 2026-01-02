import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SortableHeader from "@/Components/SortableHeader";
import Breadcrumbs from "@/Components/Breadcrumbs";
import TableNotFound from "@/Components/TableNotFound";
import TableSearch from "@/Components/TableSearch";
import Pagination from "@/Components/Pagination";
import { inertiaGet } from "@/utils/helper-function";
import Roles from "@/utils/UserFromUsePage";
import { BreadcrumbsMonitorings } from "@/Pages/Monitorings/Constant";

export default function Index({ monitorings = { data: [] } }) {
    const { role } = Roles();
    const breadcrumbs = [<BreadcrumbsMonitorings />, "Daftar"];

    const [perPage, setPerPage] = useState(monitorings.per_page || 10);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState("");

    function applyFilters(overrides = {}) {
        inertiaGet("monitorings.index", {
            page: 1,
            per_page: perPage,
            search: search,
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

    function handleSearchSubmit(e) {
        e.preventDefault();
        applyFilters();
    }

    function handleSort(field, direction) {
        setSortField(field);
        setSortDirection(direction);
        applyFilters({ sort: field, direction: direction });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Monitoring TX" />
            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <div className="flex items-center justify-end">
                        <form onSubmit={handleSearchSubmit}>
                            <TableSearch inputHandler={setSearch} inputValue={search} />
                        </form>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <SortableHeader label="Operator" column="user_id" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                                    <SortableHeader label="Bulan" column="inventory_id" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                                    <SortableHeader label="Tahun" column="result" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                                </tr>
                            </thead>
                            <tbody>
                                {monitorings.data.length === 0 ? (
                                    <TableNotFound message="Tidak ada monitoring yang ditemukan." colspan={6} />
                                ) : (
                                    monitorings.data.map((m, index) => (
                                        <tr key={m.id}>
                                            <th>
                                                {(monitorings.current_page - 1) * monitorings.per_page + index + 1}
                                            </th>
                                            <td>{m.transmission_id}</td>
                                            <td>{m.inventory_id}</td>
                                            <td>{m.result}</td>
                                            <td>{m.created_at}</td>
                                            <td></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        <Pagination perPage={perPage} handlePerPageChange={handlePerPageChange} data={monitorings.links} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
