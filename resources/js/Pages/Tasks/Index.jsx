import React, { useRef, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { FaEye, FaPlay, FaSpinner } from "react-icons/fa";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SortableHeader from "@/Components/SortableHeader";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";
import DeleteModal from "@/Components/DeleteModal";
import TableNotFound from "@/Components/TableNotFound";
import TableSearch from "@/Components/TableSearch";
import { BadgeStatus } from "@/Components/Badge";
import { inertiaGet } from "@/utils/helper-function";
import { DownloadButton } from "@/Components/Button";
import Roles from "@/utils/UserFromUsePage";
import { BreadcrumbsTasks } from "@/Pages/Tasks/Constant";

export default function TasksIndex({ maintenances }) {
    const { role } = Roles();
    const breadcrumbs = [<BreadcrumbsTasks />, "Daftar"];
    const [deleteInventoryId, setDeleteInventoryId] = useState(null);
    const modalRef = useRef(null);
    const { delete: destroy, post, processing } = useForm();

    const [perPage, setPerPage] = useState(maintenances.per_page || 10);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState("");
    const [loadingId, setLoadingId] = useState(null);

    function closeDeleteModal() {
        modalRef.current.close();
        setDeleteInventoryId(null);
    }

    function handleDelete() {
        if (deleteInventoryId) {
            destroy(route("maintenances.destroy", deleteInventoryId), {
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
        inertiaGet("tasks.index", {
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
        window.location.href = route("tasks.export", {
            search: search,
            sort: sortField,
            direction: sortDirection,
        });
    }

    function handleStartTask(id) {
        setLoadingId(id);
        post(route("tasks.start", id), {
            preserveScroll: true,
            onFinish: () => setLoadingId(null), // reset setelah selesai
            onError: () => {
                alert("Gagal memulai tugas.");
                setLoadingId(null);
            },
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Tugas" />
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
                                    {(role.hasAdmin || role.hasKetuaTim) && (
                                        <SortableHeader
                                            label="Nama"
                                            column="name"
                                            sortField={sortField}
                                            sortDirection={sortDirection}
                                            onSort={handleSort}
                                        />
                                    )}
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
                                        message="Tidak ada tugas yang ditemukan."
                                        colspan={
                                            role.hasAdmin || role.hasKetuaTim
                                                ? 6
                                                : 5
                                        }
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
                                                {(role.hasAdmin ||
                                                    role.hasKetuaTim) && (
                                                    <td>
                                                        {maintenance.user?.name}
                                                    </td>
                                                )}
                                                <td>
                                                    <BadgeStatus
                                                        param={
                                                            maintenance.latest_status
                                                        }
                                                    />
                                                </td>
                                                <td className="flex flex-wrap justify-center items-center gap-2">
                                                    {maintenance.latest_status ==
                                                        0 && (
                                                        <button
                                                            key={maintenance.id}
                                                            className="btn btn-sm btn-success flex items-center gap-2"
                                                            onClick={() =>
                                                                handleStartTask(
                                                                    maintenance.id
                                                                )
                                                            }
                                                            disabled={
                                                                loadingId ===
                                                                maintenance.id
                                                            }
                                                        >
                                                            {loadingId ===
                                                            maintenance.id ? (
                                                                <FaSpinner className="animate-spin" />
                                                            ) : (
                                                                <FaPlay />
                                                            )}
                                                            <span className="hidden sm:flex">
                                                                {loadingId ===
                                                                maintenance.id
                                                                    ? "Memulai..."
                                                                    : "Mulai"}
                                                            </span>
                                                        </button>
                                                    )}
                                                    {maintenance.latest_status !=
                                                        0 && (
                                                        <Link
                                                            href={route(
                                                                "tasks.view",
                                                                maintenance.id
                                                            )}
                                                            className="btn btn-sm btn-primary"
                                                        >
                                                            <FaEye />
                                                            <span className="hidden sm:flex">
                                                                Lihat
                                                            </span>
                                                        </Link>
                                                    )}
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
                title="tugas"
            />
        </AuthenticatedLayout>
    );
}
