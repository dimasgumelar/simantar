import React, { useRef, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SortableHeader from "@/Components/SortableHeader";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";
import DeleteModal from "@/Components/DeleteModal";
import TableNotFound from "@/Components/TableNotFound";
import TableSearch from "@/Components/TableSearch";
import {
    CreateButton,
    ViewButton,
    DeleteButton,
    DownloadButton,
} from "@/Components/Button";
import { BadgeStatus } from "@/Components/Badge";
import { inertiaGet } from "@/utils/helper-function";
import { BreadcrumbsMaintenances } from "@/Pages/Maintenances/Constant";

export default function MaintenancesIndex({ maintenances }) {
    const breadcrumbs = [<BreadcrumbsMaintenances />, "Daftar"];
    const [deleteMaintenanceId, setDeleteMaintenanceId] = useState(null);
    const modalRef = useRef(null);

    const [perPage, setPerPage] = useState(maintenances.per_page || 10);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState("");
    const { post, processing } = useForm();

    // Delete
    function openDeleteModal(id) {
        setDeleteMaintenanceId(id);
        modalRef.current.showModal();
    }

    function closeDeleteModal() {
        modalRef.current.close();
        setDeleteMaintenanceId(null);
    }

    function handleDelete() {
        if (deleteMaintenanceId) {
            post(route("maintenances.destroy", deleteMaintenanceId), {
                onSuccess: () => {
                    closeDeleteModal();
                },
                onError: () => {
                    alert("Gagal menghapus data pemeliharaan.");
                },
            });
        }
    }

    function applyFilters(overrides = {}) {
        inertiaGet("maintenances.index", {
            page: 1,
            per_page: perPage,
            search: search,
            sort: sortField,
            direction: sortDirection,
            ...overrides,
        });
    }

    // PerPage
    function handlePerPageChange(e) {
        const value = e.target.value;
        setPerPage(value);
        applyFilters({ per_page: value });
    }

    // Search
    function handleSearchSubmit(e) {
        e.preventDefault();
        applyFilters();
    }

    // Sort
    function handleSort(field, direction) {
        setSortField(field);
        setSortDirection(direction);
        applyFilters({ sort: field, direction: direction });
    }

    function handleExport() {
        window.location.href = route("maintenances.export", {
            search: search,
            sort: sortField,
            direction: sortDirection,
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Pemeliharaan" />
            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <div className="flex items-center justify-end">
                        <DownloadButton onClick={handleExport} />
                        <form onSubmit={handleSearchSubmit}>
                            <TableSearch
                                inputHandler={setSearch}
                                inputValue={search}
                            />
                        </form>
                        <CreateButton
                            route={route("maintenances.create")}
                            title="Tambah Pemeliharan"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th></th>
                                    <SortableHeader
                                        label="Alat"
                                        column="inventory"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <SortableHeader
                                        label="Transmisi"
                                        column="transmission"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <SortableHeader
                                        label="Nama"
                                        column="name"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <SortableHeader
                                        label="Status"
                                        column="status"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {maintenances.data.length === 0 ? (
                                    <TableNotFound
                                        message="Tidak ada pemeliharaan yang ditemukan."
                                        colspan={6}
                                    />
                                ) : (
                                    maintenances.data.map(
                                        (maintenance, index) => (
                                            <tr key={maintenance.id}>
                                                <th>
                                                    {(maintenances.current_page -
                                                        1) *
                                                        maintenances.per_page +
                                                        index +
                                                        1}
                                                </th>
                                                <td>
                                                    {
                                                        maintenance.inventory
                                                            ?.name
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        maintenance.transmission
                                                            ?.name
                                                    }
                                                </td>
                                                <td>
                                                    {maintenance.user?.name}
                                                </td>
                                                <td>
                                                    <BadgeStatus
                                                        param={
                                                            maintenance.latest_status
                                                        }
                                                    />
                                                </td>
                                                <td className="flex flex-wrap justify-center items-center gap-2">
                                                    <ViewButton
                                                        route={route(
                                                            "maintenances.view",
                                                            maintenance.id
                                                        )}
                                                    />
                                                    {/* <EditButton
                                                        route={route(
                                                            "maintenances.edit",
                                                            maintenance.id
                                                        )}
                                                    /> */}
                                                    <DeleteButton
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                maintenance.id
                                                            )
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                        <Pagination
                            perPage={perPage}
                            handlePerPageChange={handlePerPageChange}
                            data={maintenances.links}
                        />
                    </div>
                </div>
            </div>
            <DeleteModal
                modalRef={modalRef}
                onCancel={closeDeleteModal}
                onConfirm={handleDelete}
                title="pemeliharaan"
                isDeleting={processing}
            />
        </AuthenticatedLayout>
    );
}
