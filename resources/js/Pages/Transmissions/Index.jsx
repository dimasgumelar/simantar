import React, { useRef, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { FaCheckCircle, FaUsers } from "react-icons/fa";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SortableHeader from "@/Components/SortableHeader";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";
import DeleteModal from "@/Components/DeleteModal";
import TableNotFound from "@/Components/TableNotFound";
import TableSearch from "@/Components/TableSearch";
import TableDropdown from "@/Components/TableDropdown";
import {
    CreateButton,
    ViewButton,
    EditButton,
    DeleteButton,
    DownloadButton,
} from "@/Components/Button";
import { inertiaGet } from "@/utils/helper-function";
import { TRANSMISSION_STATUS_OPTIONS } from "@/utils/constants";
import Roles from "@/utils/UserFromUsePage";
import { BreadcrumbsTransmisi } from "@/Pages/Transmissions/Constant";

export default function TransmissionsIndex({ transmissions }) {
    const { role } = Roles();
    const breadcrumbs = [<BreadcrumbsTransmisi />, "Daftar"];

    const [deleteTransmissionId, setDeleteTransmissionId] = useState(null);
    const modalRef = useRef(null);
    const { post, processing } = useForm();

    const [perPage, setPerPage] = useState(transmissions.per_page || 10);
    const [search, setSearch] = useState("");
    const [selectedStatus, setselectedStatus] = useState([]);
    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState("");

    // Delete
    function openDeleteModal(id) {
        setDeleteTransmissionId(id);
        modalRef.current.showModal();
    }

    function closeDeleteModal() {
        modalRef.current.close();
        setDeleteTransmissionId(null);
    }

    function handleDelete() {
        if (deleteTransmissionId) {
            post(route("transmissions.destroy", deleteTransmissionId), {
                onSuccess: () => {
                    closeDeleteModal();
                },
                onError: () => {
                    alert("Gagal menghapus data transmisi.");
                },
            });
        }
    }

    function applyFilters(overrides = {}) {
        inertiaGet("transmissions.index", {
            page: 1,
            per_page: perPage,
            search: search,
            status: selectedStatus,
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

    // Status
    function toggleStatus(statusName) {
        const updatedStatuses = selectedStatus.includes(statusName)
            ? selectedStatus.filter((r) => r !== statusName)
            : [...selectedStatus, statusName];

        setselectedStatus(updatedStatuses);
        applyFilters({ status: updatedStatuses });
    }

    // Sort
    function handleSort(field, direction) {
        setSortField(field);
        setSortDirection(direction);
        applyFilters({ sort: field, direction: direction });
    }

    function handleExport() {
        window.location.href = route("transmissions.export", {
            search: search,
            status: selectedStatus,
            sort: sortField,
            direction: sortDirection,
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Transmissions" />
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
                        <TableDropdown
                            icon={<FaCheckCircle />}
                            title="Pilih Status"
                            list={TRANSMISSION_STATUS_OPTIONS}
                            selectedList={selectedStatus}
                            toggleItem={toggleStatus}
                        />
                        {(role.hasAdmin || role.hasKetuaTim) && (
                            <CreateButton
                                route={route("transmissions.create")}
                                title="Tambah Transmisi"
                            />
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th></th>
                                    <SortableHeader
                                        label="Nama"
                                        column="name"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <SortableHeader
                                        label="Alamat"
                                        column="address"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <SortableHeader
                                        label="Status"
                                        column="is_active"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {transmissions.data.length === 0 ? (
                                    <TableNotFound
                                        message="Tidak ada transmisi yang ditemukan."
                                        colspan={5}
                                    />
                                ) : (
                                    transmissions.data.map(
                                        (transmission, index) => (
                                            <tr key={transmission.id}>
                                                <th>
                                                    {(transmissions.current_page -
                                                        1) *
                                                        transmissions.per_page +
                                                        index +
                                                        1}
                                                </th>
                                                <td>{transmission.name}</td>
                                                <td>{transmission.address}</td>
                                                <td>
                                                    <span
                                                        className={`badge badge-outline mr-1 truncate block ${
                                                            transmission.is_active ==
                                                            1
                                                                ? "badge-success"
                                                                : "badge-error"
                                                        }`}
                                                    >
                                                        {transmission.is_active ==
                                                        1
                                                            ? "Aktif"
                                                            : "Tidak Aktif"}
                                                    </span>
                                                </td>
                                                <td className="flex flex-wrap justify-center items-center gap-2">
                                                    <ViewButton
                                                        route={route(
                                                            "transmissions.view",
                                                            transmission.id
                                                        )}
                                                    />
                                                    {(role.hasAdmin ||
                                                        role.hasKetuaTim) && (
                                                        <>
                                                            <EditButton
                                                                route={route(
                                                                    "transmissions.edit",
                                                                    transmission.id
                                                                )}
                                                            />
                                                            <DeleteButton
                                                                onClick={() =>
                                                                    openDeleteModal(
                                                                        transmission.id
                                                                    )
                                                                }
                                                            />
                                                            <Link
                                                                href={route(
                                                                    "transmissions.users",
                                                                    transmission.id
                                                                )}
                                                                className="btn btn-sm btn-warning"
                                                            >
                                                                <FaUsers />
                                                                <span className="hidden sm:flex">
                                                                    Pengguna
                                                                </span>
                                                            </Link>
                                                        </>
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
                            data={transmissions.links}
                        />
                    </div>
                </div>
            </div>
            <DeleteModal
                modalRef={modalRef}
                onCancel={closeDeleteModal}
                onConfirm={handleDelete}
                title="transmisi"
                isDeleting={processing}
            />
        </AuthenticatedLayout>
    );
}
